import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = (formData.get("documentType") as string) || "Identity Document";

    if (!file || file.size === 0) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: "Invalid file type. JPG, PNG, PDF only." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
    }

    const timestamp = Date.now();
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const safeName = documentType.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const blobName = `documents/${session.user.id}/${safeName}-${timestamp}.${ext}`;

    const blob = await put(blobName, file, {
      access: "private",
      contentType: file.type,
    });

    const doc = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: blob.url,
        documentType,
        uploadedAt: new Date(),
      },
    });

    // Also update user.idDocument for backwards compat
    await prisma.user.update({
      where: { id: session.user.id },
      data: { idDocument: blob.url },
    }).catch(() => { /* field may not exist on all schemas */ });

    return Response.json({ success: true, document: doc });
  } catch (error: any) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Upload failed", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const documents = await prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { uploadedAt: "desc" },
    });
    return Response.json({ documents });
  } catch (error: any) {
    console.error("Documents GET error:", error);
    return Response.json({ error: "Failed to load documents" }, { status: 500 });
  }
}
