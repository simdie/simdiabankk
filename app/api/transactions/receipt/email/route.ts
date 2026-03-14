import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { generateReceiptPDF } from "@/lib/receipt";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { txId } = await req.json();
    if (!txId) return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: txId,
        OR: [
          { senderAccount: { userId: session.user.id } },
          { receiverAccount: { userId: session.user.id } },
        ],
      },
      include: {
        senderAccount: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        receiverAccount: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!transaction) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, firstName: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const receiptData = {
      reference: transaction.reference,
      type: transaction.type,
      status: transaction.status,
      amount: Number(transaction.amount),
      currency: transaction.currency,
      description: transaction.description,
      createdAt: transaction.createdAt,
      sender: transaction.senderAccount ? {
        name: `${transaction.senderAccount.user.firstName} ${transaction.senderAccount.user.lastName}`,
        accountNumber: transaction.senderAccount.accountNumber,
        currency: transaction.senderAccount.currency,
      } : null,
      receiver: transaction.receiverAccount ? {
        name: `${transaction.receiverAccount.user.firstName} ${transaction.receiverAccount.user.lastName}`,
        accountNumber: transaction.receiverAccount.accountNumber,
        currency: transaction.receiverAccount.currency,
      } : null,
      externalDetails: transaction.externalDetails as Record<string, string> | null,
    };

    const pdfBuffer = await generateReceiptPDF(receiptData);

    const html = `
      <div style="background:#03050a;padding:36px;font-family:sans-serif;max-width:580px;margin:0 auto;border-radius:14px;border:1px solid rgba(0,212,255,0.15)">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:20px;font-weight:800;color:#F0B429;letter-spacing:3px">BANK OF ASIA</div>
          <div style="font-size:10px;color:#8899B5;letter-spacing:2px;margin-top:4px">NEXT-GENERATION DIGITAL BANKING</div>
        </div>
        <h2 style="color:#f0f4ff;font-size:18px;margin-bottom:8px">Transaction Receipt</h2>
        <p style="color:#9ca3af;font-size:14px;line-height:1.6">
          Dear ${user.firstName},<br/><br/>
          Please find your transaction receipt attached as a PDF document.<br/><br/>
          <strong style="color:#f0f4ff">Reference:</strong> ${transaction.reference}<br/>
          <strong style="color:#f0f4ff">Amount:</strong> ${Number(transaction.amount).toFixed(2)} ${transaction.currency}<br/>
          <strong style="color:#f0f4ff">Status:</strong> ${transaction.status}
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0"/>
        <p style="color:#4b5563;font-size:11px;text-align:center">Bank of Asia Online · Secure Digital Banking · This is an automated email, please do not reply.</p>
      </div>
    `;

    await sendEmail(
      user.email,
      `Bank of Asia Online: Receipt for ${transaction.reference}`,
      html,
      [{ filename: `receipt-${transaction.reference}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[RECEIPT_EMAIL]", err);
    return NextResponse.json({ error: "Failed to send receipt email" }, { status: 500 });
  }
}
