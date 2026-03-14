import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateReceiptPDF, type ReceiptData } from "@/lib/receipt";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const txId = req.nextUrl.searchParams.get("id");
    const format = req.nextUrl.searchParams.get("format") ?? "pdf";
    if (!txId) return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: txId,
        OR: [
          { senderAccount: { userId: session.user.id } },
          { receiverAccount: { userId: session.user.id } },
          ...(((session.user as any).role === "ADMIN") ? [{}] : []),
        ],
      },
      include: {
        senderAccount: { include: { user: { select: { firstName: true, lastName: true } } } },
        receiverAccount: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!transaction) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const receiptData: ReceiptData = {
      reference: transaction.reference,
      type: transaction.type,
      status: transaction.status,
      amount: Number(transaction.amount),
      currency: transaction.currency,
      description: transaction.description,
      createdAt: transaction.createdAt,
      sender: transaction.senderAccount
        ? {
            name: `${transaction.senderAccount.user.firstName} ${transaction.senderAccount.user.lastName}`,
            accountNumber: transaction.senderAccount.accountNumber,
            currency: transaction.senderAccount.currency,
          }
        : null,
      receiver: transaction.receiverAccount
        ? {
            name: `${transaction.receiverAccount.user.firstName} ${transaction.receiverAccount.user.lastName}`,
            accountNumber: transaction.receiverAccount.accountNumber,
            currency: transaction.receiverAccount.currency,
          }
        : null,
      externalDetails: transaction.externalDetails as Record<string, string> | null,
    };

    if (format === "json") {
      return NextResponse.json({ receipt: receiptData });
    }

    const pdfBuffer = await generateReceiptPDF(receiptData);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${transaction.reference}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[RECEIPT_GET]", err);
    return NextResponse.json(
      { error: "Failed to generate receipt. Please try again." },
      { status: 500 }
    );
  }
}
