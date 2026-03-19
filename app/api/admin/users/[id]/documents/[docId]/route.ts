import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { del } from "@vercel/blob";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, docId } = await params;

    const doc = await prisma.document.findFirst({
      where: { id: docId, userId: id },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete from Vercel Blob if stored there
    if (doc.fileUrl.includes("blob.vercel-storage.com")) {
      try { await del(doc.fileUrl); } catch { /* non-fatal */ }
    }

    await prisma.document.delete({ where: { id: docId } });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_DELETE_DOCUMENT",
        target: docId,
        details: { fileName: doc.fileName, documentType: doc.documentType, deletedForUserId: id },
        ipAddress: req.headers.get("x-forwarded-for") || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ADMIN_DELETE_DOC]", err);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
