import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { docId } = await params;
    const isAdmin = (session.user as any).role === "ADMIN";

    const doc = await prisma.document.findFirst({
      where: isAdmin ? { id: docId } : { id: docId, userId: session.user.id },
    });

    if (!doc) {
      return Response.json({ error: "Document not found" }, { status: 404 });
    }

    // Fetch the private blob server-side using the token, then stream to client
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const blobRes = await fetch(doc.fileUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!blobRes.ok) {
      return Response.json({ error: "Failed to fetch document" }, { status: 502 });
    }

    const contentType = doc.fileType || blobRes.headers.get("content-type") || "application/octet-stream";
    const body = await blobRes.arrayBuffer();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${doc.fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error: any) {
    console.error("Document view error:", error);
    return Response.json(
      { error: "Failed to load document", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
