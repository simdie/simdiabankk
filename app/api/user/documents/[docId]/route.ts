import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { docId } = await params;

    const doc = await prisma.document.findFirst({
      where: { id: docId, userId: session.user.id },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    try {
      const filePath = join(process.cwd(), "public", doc.fileUrl);
      await unlink(filePath);
    } catch {
      // File may already be missing
    }

    await prisma.document.delete({ where: { id: docId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[USER_DELETE_DOC]", err);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
