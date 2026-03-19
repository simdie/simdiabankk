import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { docId } = await params;

    const doc = await prisma.document.findFirst({
      where: { id: docId, userId: session.user.id },
    });

    if (!doc) {
      return Response.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete from Vercel Blob
    if (doc.fileUrl && doc.fileUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(doc.fileUrl);
      } catch (e) {
        console.warn("Blob delete failed:", e);
      }
    }

    await prisma.document.delete({ where: { id: docId } });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("User delete doc error:", error);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
