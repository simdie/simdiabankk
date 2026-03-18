import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Accepted: JPG, PNG, PDF" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/id-docs/
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "id-docs");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${session.user.id}-id-${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);

    const publicUrl = `/uploads/id-docs/${filename}`;

    // Update user record with the document path and create Document record
    await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: { idDocument: publicUrl },
      }),
      prisma.document.create({
        data: {
          userId: session.user.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: publicUrl,
          documentType: "Identity Document",
        },
      }),
    ]);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("[UPLOAD_ID]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
