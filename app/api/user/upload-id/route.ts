import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

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

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${session.user.id}-id-${Date.now()}.${ext}`;

    const blob = await put(`documents/${session.user.id}/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    const fileUrl = blob.url;

    await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: { idDocument: fileUrl },
      }),
      prisma.document.create({
        data: {
          userId: session.user.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl,
          documentType: "Identity Document",
        },
      }),
    ]);

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("[UPLOAD_ID]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
