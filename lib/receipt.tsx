import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ReceiptData {
  reference: string;
  type: "INTERNAL" | "WIRE_TRANSFER" | "LOCAL_WIRE" | "INTERNATIONAL_WIRE" | "ADMIN_DEPOSIT" | string;
  status: string;
  amount: number;
  currency: string;
  description: string | null;
  createdAt: string | Date;
  sender?: { name: string; accountNumber: string; currency: string } | null;
  receiver?: { name: string; accountNumber: string; currency: string } | null;
  externalDetails?: Record<string, string> | null;
  processedAt?: string | Date | null;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount);
}

function typeLabel(type: string): string {
  if (type === "INTERNAL") return "Internal Transfer";
  if (type === "LOCAL_WIRE") return "Local Wire Transfer";
  if (type === "INTERNATIONAL_WIRE") return "International Wire Transfer";
  if (type === "WIRE_TRANSFER") return "Wire Transfer";
  if (type === "ADMIN_DEPOSIT") return "Administrative Deposit";
  return type.replace(/_/g, " ");
}

function statusColor(status: string): string {
  if (status === "COMPLETED") return "#059669";
  if (status === "FAILED") return "#DC2626";
  if (status === "AWAITING_CONFIRMATION") return "#D97706";
  return "#6B7280";
}

function statusBg(status: string): string {
  if (status === "COMPLETED") return "#ECFDF5";
  if (status === "FAILED") return "#FEF2F2";
  if (status === "AWAITING_CONFIRMATION") return "#FFFBEB";
  return "#F9FAFB";
}

// ─── PDF Generator ────────────────────────────────────────────────────────────
export async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const logoPath = path.join(process.cwd(), "public", "logo-dark-bg.png");
    const hasLogo = fs.existsSync(logoPath);

    const doc = new PDFDocument({ size: "A4", margin: 0, info: {
      Title: `Bank of Asia Online Receipt — ${data.reference}`,
      Author: "Bank of Asia Online",
      Subject: "Official Transaction Receipt",
    }});

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = 595.28;
    const H = 841.89;
    const MARGIN = 48;
    const CONTENT_W = W - 2 * MARGIN;
    const generatedAt = new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
    const txDateFull = new Date(data.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "medium" });

    // ── White background ──
    doc.rect(0, 0, W, H).fill("#FFFFFF");

    // ── Header bar ──
    doc.rect(0, 0, W, 80).fill("#003B7A");
    doc.rect(0, 76, W, 4).fill("#0070D2");

    if (hasLogo) {
      doc.image(logoPath, MARGIN, 16, { height: 48 });
    } else {
      doc.font("Helvetica-Bold").fontSize(16).fillColor("#FFFFFF");
      doc.text("BANK OF ASIA ONLINE", MARGIN, 28, { lineBreak: false });
    }
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#FFFFFF");
    doc.text("TRANSACTION RECEIPT", MARGIN, 22, { align: "right", width: CONTENT_W, lineBreak: false });
    doc.font("Helvetica").fontSize(8.5).fillColor("rgba(255,255,255,0.7)");
    doc.text(txDateFull, MARGIN, 42, { align: "right", width: CONTENT_W, lineBreak: false });

    // ── Amount hero ──
    let y = 104;
    doc.rect(MARGIN, y, CONTENT_W, 90).fill("#F0F7FF").stroke("#BFDBFE");

    doc.font("Helvetica").fontSize(9).fillColor("#6B7280");
    doc.text("TRANSACTION AMOUNT", MARGIN, y + 14, { align: "center", width: CONTENT_W, lineBreak: false });

    doc.font("Helvetica-Bold").fontSize(34).fillColor("#003B7A");
    doc.text(formatCurrency(data.amount, data.currency), MARGIN, y + 28, { align: "center", width: CONTENT_W, lineBreak: false });

    doc.font("Helvetica").fontSize(10).fillColor("#374151");
    doc.text(`${data.currency} · ${typeLabel(data.type)}`, MARGIN, y + 68, { align: "center", width: CONTENT_W, lineBreak: false });

    y += 102;

    // Status badge — explicit dimensions to keep text inside box
    const sCo = statusColor(data.status);
    const sBg = statusBg(data.status);
    const statusText = data.status.replace(/_/g, " ");
    const badgeH = 24;
    const badgeW = 160;
    const badgeX = W / 2 - badgeW / 2;
    const dotR = 3.5;
    const dotX = badgeX + 18;
    const dotY = y + badgeH / 2;
    const textX = dotX + dotR + 7;
    const textY = y + (badgeH - 9) / 2;
    doc.roundedRect(badgeX, y, badgeW, badgeH, 12).fill(sBg);
    doc.circle(dotX, dotY, dotR).fill(sCo);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(sCo);
    doc.text(statusText, textX, textY, { lineBreak: false, width: badgeW - (textX - badgeX) - 8 });
    y += badgeH + 12;

    // ── Divider ──
    doc.moveTo(MARGIN, y).lineTo(W - MARGIN, y).lineWidth(1).strokeColor("#E5E7EB").stroke();
    y += 18;

    // ── Transaction Details ──
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#003B7A");
    doc.text("TRANSACTION DETAILS", MARGIN, y, { lineBreak: false });
    y += 14;

    const rows: Array<[string, string]> = [
      ["Reference Number", data.reference],
      ["Transaction Type", typeLabel(data.type)],
      ["Date & Time", txDateFull],
      ["Currency", data.currency],
      ["Status", statusText],
    ];
    if (data.sender) rows.push(["Sender", `${data.sender.name}  ·  ****${data.sender.accountNumber.slice(-4)}`]);
    if (data.receiver) rows.push(["Recipient", `${data.receiver.name}  ·  ****${data.receiver.accountNumber.slice(-4)}`]);
    if (data.description) rows.push(["Description", data.description]);

    for (let i = 0; i < rows.length; i++) {
      const [label, value] = rows[i];
      const rowBg = i % 2 === 0 ? "#FFFFFF" : "#F9FAFB";
      doc.rect(MARGIN, y, CONTENT_W, 22).fill(rowBg).stroke("#F3F4F6");
      doc.font("Helvetica").fontSize(9).fillColor("#6B7280");
      doc.text(label, MARGIN + 10, y + 6, { lineBreak: false, width: CONTENT_W / 2 });
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#111827");
      doc.text(value, MARGIN + CONTENT_W / 2, y + 6, { lineBreak: false, width: CONTENT_W / 2, align: "right" });
      y += 22;
    }

    // ── Wire Details ──
    if (data.type.includes("WIRE") && data.externalDetails && Object.keys(data.externalDetails).length > 0) {
      y += 12;
      doc.rect(MARGIN, y, CONTENT_W, 22).fill("#1E3A8A");
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#FFFFFF");
      doc.text("WIRE TRANSFER BENEFICIARY", MARGIN + 10, y + 7, { lineBreak: false });
      y += 22;

      const wireFields: Array<[string, string | undefined]> = [
        ["Beneficiary Name", data.externalDetails.beneficiaryName],
        ["Bank Name", data.externalDetails.bankName],
        ["SWIFT / BIC", data.externalDetails.swift],
        ["IBAN / Account", data.externalDetails.iban],
        ["Routing Number", data.externalDetails.routingNumber],
        ["Country", data.externalDetails.country],
        ["Bank Address", data.externalDetails.bankAddress],
      ];
      let wi = 0;
      for (const [label, value] of wireFields) {
        if (!value) continue;
        const rowBg = wi % 2 === 0 ? "#F0F7FF" : "#FFFFFF";
        doc.rect(MARGIN, y, CONTENT_W, 22).fill(rowBg).stroke("#BFDBFE");
        doc.font("Helvetica").fontSize(9).fillColor("#374151");
        doc.text(label, MARGIN + 10, y + 6, { lineBreak: false });
        doc.font("Courier").fontSize(9).fillColor("#003B7A");
        doc.text(value, MARGIN + 10, y + 6, { align: "right", width: CONTENT_W - 20, lineBreak: false });
        y += 22;
        wi++;
      }
    }

    // ── Authorised Signatory — text only, no signature drawing ──
    const sigY = Math.max(y + 36, 610);
    doc.moveTo(MARGIN, sigY).lineTo(W - MARGIN, sigY).lineWidth(0.5).strokeColor("#E5E7EB").stroke();

    const sigTextY = sigY + 10;
    doc.font("Helvetica").fontSize(8).fillColor("#9CA3AF");
    doc.text("AUTHORISED SIGNATORY", MARGIN, sigTextY, { lineBreak: false, characterSpacing: 1.5 });

    const sigNameY = sigTextY + 26;
    doc.moveTo(MARGIN, sigNameY - 2).lineTo(MARGIN + 160, sigNameY - 2).lineWidth(0.5).strokeColor("#CBD5E1").stroke();
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#0A1628");
    doc.text("Dr. James Wei", MARGIN, sigNameY + 4, { lineBreak: false });
    doc.font("Helvetica").fontSize(9).fillColor("#374151");
    doc.text("Chief Operations Officer", MARGIN, sigNameY + 19, { lineBreak: false });
    doc.font("Helvetica").fontSize(9).fillColor("#374151");
    doc.text("Bank of Asia Online Operations Division", MARGIN, sigNameY + 32, { lineBreak: false });
    doc.font("Helvetica").fontSize(9).fillColor("#6B7280");
    doc.text("MAS License: BOA-OPS-2024-001", MARGIN, sigNameY + 45, { lineBreak: false });

    // ── Footer ──
    doc.rect(0, H - 44, W, 44).fill("#F4F6F9");
    doc.moveTo(0, H - 44).lineTo(W, H - 44).lineWidth(1).strokeColor("#E5E7EB").stroke();
    doc.font("Helvetica").fontSize(7).fillColor("#6B7280");
    doc.text(`This is an official Bank of Asia Online receipt. Reference: ${data.reference}`, MARGIN, H - 32, { lineBreak: false, width: CONTENT_W / 2 });
    doc.text(`Generated: ${generatedAt}  ·  boasiaonline.com`, MARGIN, H - 32, { align: "right", width: CONTENT_W, lineBreak: false });
    doc.font("Helvetica").fontSize(6.5).fillColor("#9CA3AF");
    doc.text("CONFIDENTIAL — For the named account holder only. Verify at boasiaonline.com/verify", MARGIN, H - 18, { align: "center", width: CONTENT_W, lineBreak: false });

    doc.end();
  });
}
