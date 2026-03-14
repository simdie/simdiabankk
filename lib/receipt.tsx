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
    const logoPath = path.join(process.cwd(), "public", "logo.png");
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
      doc.image(logoPath, MARGIN, 18, { width: 140 });
    } else {
      doc.font("Helvetica-Bold").fontSize(22).fillColor("#FFFFFF");
      doc.text("BANK OF ASIA ONLINE", MARGIN, 22, { lineBreak: false });
    }
    doc.font("Helvetica").fontSize(9).fillColor("rgba(255,255,255,0.65)");
    doc.text("OFFICIAL TRANSACTION RECEIPT", MARGIN, 54, { lineBreak: false });

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

    // Status badge
    const sCo = statusColor(data.status);
    const sBg = statusBg(data.status);
    const statusText = data.status.replace(/_/g, " ");
    const badgeW = 140;
    const badgeX = W / 2 - badgeW / 2;
    doc.rect(badgeX, y, badgeW, 22).fill(sBg).stroke(sCo);
    doc.circle(badgeX + 14, y + 11, 4).fill(sCo);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(sCo);
    doc.text(statusText, badgeX + 20, y + 7, { lineBreak: false, width: badgeW - 24 });
    y += 34;

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

    // ── Signature Block ──
    const sigY = Math.max(y + 36, 630);
    doc.moveTo(MARGIN, sigY).lineTo(W - MARGIN, sigY).lineWidth(0.5).strokeColor("#E5E7EB").stroke();

    // Section title
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#003B7A");
    doc.text("AUTHORISED SIGNATORIES", MARGIN, sigY + 8, { lineBreak: false });

    // LEFT SIGNATURE - Dr. James Wei (professor-style)
    const sx1 = MARGIN, sy1 = sigY + 36;
    doc.save();
    // J with serif top bar and descending loop
    doc.strokeColor("#1B3A6B").lineWidth(2.2).lineCap("round").lineJoin("round");
    doc.moveTo(sx1 + 22, sy1 - 27).lineTo(sx1 + 36, sy1 - 27).lineWidth(2).stroke(); // top bar
    doc.moveTo(sx1 + 30, sy1 - 27)
      .bezierCurveTo(sx1 + 34, sy1 - 23, sx1 + 34, sy1 - 11, sx1 + 32, sy1 - 1)
      .bezierCurveTo(sx1 + 30, sy1 + 9, sx1 + 26, sy1 + 17, sx1 + 20, sy1 + 18)
      .bezierCurveTo(sx1 + 13, sy1 + 19, sx1 + 9, sy1 + 14, sx1 + 11, sy1 + 9)
      .bezierCurveTo(sx1 + 13, sy1 + 4, sx1 + 17, sy1 + 8, sx1 + 17, sy1 + 13)
      .lineWidth(2.2).stroke();
    // Flowing middle 'ames'
    doc.lineWidth(2);
    doc.moveTo(sx1 + 40, sy1 - 10)
      .bezierCurveTo(sx1 + 46, sy1 - 20, sx1 + 54, sy1 - 18, sx1 + 56, sy1 - 8)
      .bezierCurveTo(sx1 + 58, sy1 - 1, sx1 + 54, sy1 + 4, sx1 + 60, sy1 - 2)
      .bezierCurveTo(sx1 + 65, sy1 - 8, sx1 + 72, sy1 - 12, sx1 + 76, sy1 - 4)
      .bezierCurveTo(sx1 + 80, sy1 + 2, sx1 + 78, sy1 + 8, sx1 + 84, sy1 + 2)
      .bezierCurveTo(sx1 + 89, sy1 - 4, sx1 + 96, sy1 - 8, sx1 + 100, sy1)
      .bezierCurveTo(sx1 + 103, sy1 + 6, sx1 + 100, sy1 + 12, sx1 + 106, sy1 + 4)
      .stroke();
    // W section of 'Wei'
    doc.lineWidth(2.2);
    doc.moveTo(sx1 + 110, sy1 - 14)
      .bezierCurveTo(sx1 + 114, sy1 - 4, sx1 + 118, sy1 + 6, sx1 + 122, sy1 - 4)
      .bezierCurveTo(sx1 + 126, sy1 - 14, sx1 + 130, sy1 - 14, sx1 + 134, sy1 - 4)
      .bezierCurveTo(sx1 + 138, sy1 + 6, sx1 + 142, sy1 + 4, sx1 + 147, sy1 - 8)
      .stroke();
    // Long underline with uptick flourish
    doc.lineWidth(1.3);
    doc.moveTo(sx1 + 9, sy1 + 18)
      .bezierCurveTo(sx1 + 45, sy1 + 21, sx1 + 95, sy1 + 21, sx1 + 148, sy1 + 16)
      .bezierCurveTo(sx1 + 163, sy1 + 14, sx1 + 172, sy1 + 7, sx1 + 165, sy1)
      .stroke();
    doc.restore();
    doc.moveTo(sx1, sy1 + 26).lineTo(sx1 + 165, sy1 + 26).lineWidth(0.5).strokeColor("#D1D5DB").stroke();
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#111827").text("Dr. James Wei", sx1, sy1 + 30, { lineBreak: false });
    doc.font("Helvetica").fontSize(8.5).fillColor("#374151").text("Chief Operations Officer", sx1, sy1 + 43, { lineBreak: false });
    doc.font("Helvetica").fontSize(8).fillColor("#6B7280").text("Bank of Asia Online Operations Division", sx1, sy1 + 55, { lineBreak: false });
    doc.font("Helvetica").fontSize(7.5).fillColor("#9CA3AF").text("License No: MAS-BOA-2024-001", sx1, sy1 + 67, { lineBreak: false });

    // RIGHT SIGNATURE - Ms. Sarah Chen (professor-style)
    const sx2 = W / 2 + 10, sy2 = sigY + 36;
    doc.save();
    // S-curve opening
    doc.strokeColor("#1B3A6B").lineWidth(2.2).lineCap("round").lineJoin("round");
    doc.moveTo(sx2 + 24, sy2 - 22)
      .bezierCurveTo(sx2 + 18, sy2 - 26, sx2 + 8, sy2 - 24, sx2 + 8, sy2 - 14)
      .bezierCurveTo(sx2 + 8, sy2 - 5, sx2 + 20, sy2 - 7, sx2 + 22, sy2 + 1)
      .bezierCurveTo(sx2 + 24, sy2 + 8, sx2 + 14, sy2 + 12, sx2 + 7, sy2 + 7)
      .stroke();
    // Flowing 'arah' middle section
    doc.lineWidth(2);
    doc.moveTo(sx2 + 28, sy2 - 10)
      .bezierCurveTo(sx2 + 34, sy2 - 20, sx2 + 44, sy2 - 20, sx2 + 46, sy2 - 10)
      .bezierCurveTo(sx2 + 48, sy2 - 3, sx2 + 44, sy2 + 2, sx2 + 50, sy2 - 4)
      .bezierCurveTo(sx2 + 55, sy2 - 10, sx2 + 63, sy2 - 14, sx2 + 67, sy2 - 6)
      .bezierCurveTo(sx2 + 71, sy2 + 2, sx2 + 68, sy2 + 8, sx2 + 74, sy2 + 0)
      .bezierCurveTo(sx2 + 79, sy2 - 6, sx2 + 87, sy2 - 10, sx2 + 91, sy2 - 2)
      .stroke();
    // C open bowl of 'Chen'
    doc.lineWidth(2.2);
    doc.moveTo(sx2 + 112, sy2 - 22)
      .bezierCurveTo(sx2 + 102, sy2 - 28, sx2 + 92, sy2 - 22, sx2 + 90, sy2 - 10)
      .bezierCurveTo(sx2 + 88, sy2 + 2, sx2 + 96, sy2 + 14, sx2 + 108, sy2 + 11)
      .bezierCurveTo(sx2 + 116, sy2 + 8, sx2 + 120, sy2 + 2, sx2 + 118, sy2 - 6)
      .stroke();
    // h + en
    doc.lineWidth(2);
    doc.moveTo(sx2 + 122, sy2 - 28).lineTo(sx2 + 122, sy2 + 10).stroke(); // h ascender
    doc.moveTo(sx2 + 122, sy2 - 6)
      .bezierCurveTo(sx2 + 126, sy2 - 14, sx2 + 134, sy2 - 16, sx2 + 138, sy2 - 8)
      .bezierCurveTo(sx2 + 142, sy2 - 1, sx2 + 140, sy2 + 6, sx2 + 138, sy2 + 10)
      .stroke(); // h arch + en
    doc.moveTo(sx2 + 140, sy2 - 4)
      .bezierCurveTo(sx2 + 144, sy2 - 12, sx2 + 152, sy2 - 12, sx2 + 154, sy2 - 4)
      .bezierCurveTo(sx2 + 156, sy2 + 2, sx2 + 152, sy2 + 6, sx2 + 146, sy2 + 4)
      .moveTo(sx2 + 154, sy2 - 4).lineTo(sx2 + 140, sy2 - 4)
      .stroke(); // 'e'
    // Underline flourish
    doc.lineWidth(1.3);
    doc.moveTo(sx2 + 6, sy2 + 16)
      .bezierCurveTo(sx2 + 44, sy2 + 20, sx2 + 98, sy2 + 20, sx2 + 152, sy2 + 14)
      .bezierCurveTo(sx2 + 168, sy2 + 12, sx2 + 176, sy2 + 4, sx2 + 168, sy2 - 2)
      .stroke();
    doc.restore();
    doc.moveTo(sx2, sy2 + 26).lineTo(sx2 + 165, sy2 + 26).lineWidth(0.5).strokeColor("#D1D5DB").stroke();
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#111827").text("Ms. Sarah Chen, LLB", sx2, sy2 + 30, { lineBreak: false });
    doc.font("Helvetica").fontSize(8.5).fillColor("#374151").text("Head of Compliance & Risk", sx2, sy2 + 43, { lineBreak: false });
    doc.font("Helvetica").fontSize(8).fillColor("#6B7280").text("Bank of Asia Online Regulatory Affairs", sx2, sy2 + 55, { lineBreak: false });
    doc.font("Helvetica").fontSize(7.5).fillColor("#9CA3AF").text("License No: MAS-BOA-2024-002", sx2, sy2 + 67, { lineBreak: false });

    // OFFICIAL STAMP (centered between signatures)
    const stampX = W / 2;
    const stampY = sigY + 44;
    doc.circle(stampX, stampY, 42).strokeColor("#003B7A").lineWidth(2).stroke();
    doc.circle(stampX, stampY, 35).strokeColor("#003B7A").lineWidth(0.5).stroke();
    if (hasLogo) {
      doc.image(logoPath, stampX - 19, stampY - 20, { width: 38 });
    }
    doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#003B7A");
    doc.text("✓ VERIFIED", stampX - 27, stampY + 8, { width: 54, align: "center", lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#003B7A");
    doc.text("BANK OF ASIA ONLINE", stampX - 27, stampY + 18, { width: 54, align: "center", lineBreak: false });
    doc.font("Helvetica").fontSize(6).fillColor("#374151");
    doc.text("OFFICIAL RECEIPT", stampX - 27, stampY + 27, { width: 54, align: "center", lineBreak: false });
    doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), stampX - 20, stampY + 18, { lineBreak: false });
    doc.rect(stampX - 38, stampY + 50, 76, 3).fill("#003B7A");

    // ── Footer ──
    doc.rect(0, H - 44, W, 44).fill("#F4F6F9");
    doc.moveTo(0, H - 44).lineTo(W, H - 44).lineWidth(1).strokeColor("#E5E7EB").stroke();
    doc.font("Helvetica").fontSize(7).fillColor("#6B7280");
    doc.text(`This is an official Bank of Asia Online receipt. Reference: ${data.reference}`, MARGIN, H - 32, { lineBreak: false, width: CONTENT_W / 2 });
    doc.text(`Generated: ${generatedAt}  ·  bankofasia.com`, MARGIN, H - 32, { align: "right", width: CONTENT_W, lineBreak: false });
    doc.font("Helvetica").fontSize(6.5).fillColor("#9CA3AF");
    doc.text("CONFIDENTIAL — For the named account holder only. Verify at bankofasia.com/verify", MARGIN, H - 18, { align: "center", width: CONTENT_W, lineBreak: false });

    doc.end();
  });
}
