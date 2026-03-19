import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, docId } = await params;

    const doc = await prisma.document.findFirst({
      where: { id: docId, userId: id },
    });

    if (!doc) {
      return Response.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete from Vercel Blob if it's a blob URL
    if (doc.fileUrl && doc.fileUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(doc.fileUrl);
      } catch (blobError) {
        console.warn("Blob delete failed:", blobError);
        // Continue — still delete DB record
      }
    }

    await prisma.document.delete({ where: { id: docId } });

    // Audit log (non-fatal)
    try {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DOCUMENT_DELETED",
          target: docId,
          details: {
            fileName: doc.fileName,
            documentType: doc.documentType,
            deletedForUserId: id,
          },
          ipAddress: req.headers.get("x-forwarded-for") || null,
        },
      });
    } catch (auditError) {
      console.warn("Audit log failed:", auditError);
    }

    return Response.json({ success: true, message: "Document deleted successfully" });
  } catch (error: any) {
    console.error("Delete document error:", error);
    return Response.json(
      { error: "Failed to delete document", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
