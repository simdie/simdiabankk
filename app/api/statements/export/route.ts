import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount);
}

function mapDisplayType(type: string): string {
  if (type === "ADMIN_DEPOSIT") return "Credit Transfer";
  if (type === "ADMIN_DEBIT") return "Debit Transfer";
  if (type === "LOCAL_WIRE") return "Local Wire";
  if (type === "INTERNATIONAL_WIRE") return "Intl. Wire";
  if (type === "WIRE_TRANSFER") return "Wire Transfer";
  if (type === "INTERNAL") return "Internal";
  return type.replace(/_/g, " ");
}

async function generateStatementPDF(opts: {
  account: { accountNumber: string; currency: string; balance: number };
  user: {
    firstName: string; lastName: string;
    addressLine1?: string | null; addressLine2?: string | null;
    city?: string | null; state?: string | null; country?: string | null; zipCode?: string | null;
  };
  from: Date;
  to: Date;
  transactions: Array<{
    id: string; reference: string; type: string; status: string;
    amount: number; currency: string; description: string | null;
    createdAt: Date;
    isCredit: boolean;
    runningBalance: number;
  }>;
  openingBalance: number;
  closingBalance: number;
}): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const W = 595.28;
    const H = 841.89;
    const MARGIN = 50;
    const CONTENT_W = W - 2 * MARGIN;

    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const hasLogo = fs.existsSync(logoPath);

    const fmt = (amount: number) => formatCurrency(amount, opts.account.currency);
    const fullName = `${opts.user.firstName} ${opts.user.lastName}`;
    const last4 = opts.account.accountNumber.slice(-4);
    const last6 = opts.account.accountNumber.slice(-6);
    const year = opts.from.getFullYear();
    const stmtRef = `BOA-STMT-${last6}-${year}`;

    const now = new Date();
    const generatedDateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const generatedTimeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const generatedFull = `${generatedDateStr}, ${generatedTimeStr}`;
    const fromStr = opts.from.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const toStr = opts.to.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

    const totalCredits = opts.transactions.filter(t => t.isCredit).reduce((s, t) => s + t.amount, 0);
    const totalDebits = opts.transactions.filter(t => !t.isCredit).reduce((s, t) => s + t.amount, 0);
    const netMovement = opts.closingBalance - opts.openingBalance;

    // Address string
    const addrParts = [
      opts.user.addressLine1,
      opts.user.city,
      opts.user.state,
      opts.user.country,
      opts.user.zipCode,
    ].filter(Boolean);
    const addressStr = addrParts.length > 0 ? addrParts.join(", ") : "—";

    // Currency full names
    const CURRENCY_NAMES: Record<string, string> = {
      USD: "US Dollar", EUR: "Euro", GBP: "British Pound", SGD: "Singapore Dollar",
      CAD: "Canadian Dollar", AUD: "Australian Dollar", CHF: "Swiss Franc",
      JPY: "Japanese Yen", CNY: "Chinese Yuan", AED: "UAE Dirham",
    };
    const currencyName = CURRENCY_NAMES[opts.account.currency] || opts.account.currency;

    // Estimate page count (rough)
    const rowsOnFirstPage = Math.min(opts.transactions.length, 28);
    const remaining = opts.transactions.length - rowsOnFirstPage;
    const extraPages = remaining > 0 ? Math.ceil(remaining / 36) : 0;
    const totalPages = 1 + extraPages;

    const doc = new PDFDocument({ size: "A4", margin: 0, info: {
      Title: `Bank of Asia Online — Statement ${stmtRef}`,
      Author: "Bank of Asia Online",
      Subject: "Official Statement of Account",
    }});

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    let pageNum = 1;

    // ── Watermark helper ───────────────────────────────────────────────────────
    function addWatermark() {
      doc.save();
      doc.rotate(-42, { origin: [297, 421] });
      doc.fontSize(48).font("Helvetica-Bold").fillColor("#cccccc").fillOpacity(0.055);
      doc.text("BANK OF ASIA ONLINE", 60, 370, { width: 500, align: "center", lineBreak: false });
      doc.restore();
      doc.fillOpacity(1);
    }

    // ── Footer helper ──────────────────────────────────────────────────────────
    function addFooter(pn: number, tp: number) {
      doc.moveTo(MARGIN, 812).lineTo(W - MARGIN, 812).lineWidth(0.5).strokeColor("#1a3a6b").stroke();
      doc.font("Helvetica").fontSize(7).fillColor("#777777");
      doc.text("Bank of Asia Online  |  Regulated by MAS  |  SWIFT: BOASSGSG  |  www.bankofasia.com", MARGIN, 818, { lineBreak: false, width: CONTENT_W / 2 });
      doc.text("STRICTLY CONFIDENTIAL", MARGIN, 818, { align: "center", width: CONTENT_W, lineBreak: false });
      doc.text(`Page ${pn} of ${tp}`, MARGIN, 818, { align: "right", width: CONTENT_W, lineBreak: false });
    }

    // ── Continuation page header ───────────────────────────────────────────────
    doc.on("pageAdded", () => {
      pageNum++;
      doc.rect(0, 0, W, H).fill("#FFFFFF");
      addWatermark();
      doc.rect(MARGIN, 20, CONTENT_W, 20).fill("#1a3a6b");
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#ffffff");
      doc.text("BANK OF ASIA ONLINE — Statement Continued", MARGIN + 8, 26, { lineBreak: false });
      doc.font("Helvetica").fontSize(7).fillColor("#aaaaaa");
      doc.text(`Ref: ${stmtRef}`, MARGIN, 26, { align: "right", width: CONTENT_W, lineBreak: false });
    });

    // ── Page 1 background ─────────────────────────────────────────────────────
    doc.rect(0, 0, W, H).fill("#FFFFFF");
    addWatermark();

    // ── HEADER ────────────────────────────────────────────────────────────────
    // Logo (left, y=40)
    if (hasLogo) {
      doc.image(logoPath, MARGIN, 40, { width: 130 });
    } else {
      doc.font("Helvetica-Bold").fontSize(16).fillColor("#1a3a6b");
      doc.text("BANK OF ASIA ONLINE", MARGIN, 48, { lineBreak: false });
    }

    // Right side header text
    const rightX = 350;
    const rightW = W - MARGIN - rightX;
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#1a3a6b");
    doc.text("STATEMENT OF ACCOUNT", rightX, 40, { width: rightW, align: "right", lineBreak: false });
    doc.font("Helvetica").fontSize(8).fillColor("#555555");
    doc.text(`Ref: ${stmtRef}`, rightX, 55, { width: rightW, align: "right", lineBreak: false });
    doc.text(`Generated: ${generatedFull}`, rightX, 67, { width: rightW, align: "right", lineBreak: false });
    doc.text(`Statement Period: ${fromStr} — ${toStr}`, rightX, 79, { width: rightW, align: "right", lineBreak: false });

    // Header rule
    doc.moveTo(MARGIN, 100).lineTo(W - MARGIN, 100).lineWidth(1.5).strokeColor("#1a3a6b").stroke();

    // Bank address line
    doc.font("Helvetica").fontSize(7.5).fillColor("#777777");
    doc.text(
      "Bank of Asia Online  ·  123 Financial District, Singapore 048946  ·  Tel: +65 6000 0000  ·  www.bankofasia.com  ·  SWIFT: BOASSGSG",
      MARGIN, 106, { lineBreak: false, width: CONTENT_W }
    );

    // Thin rule below address
    doc.moveTo(MARGIN, 116).lineTo(W - MARGIN, 116).lineWidth(0.5).strokeColor("#dddddd").stroke();

    // ── ACCOUNT INFORMATION BOX ───────────────────────────────────────────────
    const acctBoxY = 124;
    const acctBoxH = 118;

    // Fill + border
    doc.rect(MARGIN, acctBoxY, CONTENT_W, acctBoxH).fillColor("#f7f9fc").fill();
    doc.rect(MARGIN, acctBoxY, CONTENT_W, acctBoxH).strokeColor("#b0b8c8").lineWidth(0.5).stroke();

    // Header row inside box
    doc.rect(MARGIN, acctBoxY, CONTENT_W, 16).fillColor("#e2e8f2").fill();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#1a3a6b");
    doc.text("ACCOUNT INFORMATION", MARGIN + 8, acctBoxY + 4, { lineBreak: false });

    // Two columns
    const colL = MARGIN + 8;
    const valL = MARGIN + 160;
    const colR = MARGIN + CONTENT_W / 2 + 8;
    const valR = MARGIN + CONTENT_W / 2 + 110;

    const leftRows: [string, string][] = [
      ["Account Holder", fullName],
      ["Account Number", `****${last4}  (${opts.account.currency})`],
      ["Account Type", "Current Account"],
      ["Sort Code", `04-92-${last4}`],
      ["Address", addressStr],
    ];
    const rightRows: [string, string][] = [
      ["Statement Period", `${fromStr} to ${toStr}`],
      ["Date Generated", generatedDateStr],
      ["IBAN", `BOASSGSG${last6}`],
      ["SWIFT/BIC", "BOASSGSG"],
      ["Currency", currencyName],
    ];

    let rowY = acctBoxY + 22;
    const labelStyle = { fontSize: 7.5 as const, color: "#888888" as const, font: "Helvetica" as const };
    const valueStyle = { fontSize: 8 as const, color: "#222222" as const, font: "Helvetica" as const };

    for (let i = 0; i < Math.max(leftRows.length, rightRows.length); i++) {
      if (leftRows[i]) {
        const [lbl, val] = leftRows[i];
        doc.font("Helvetica").fontSize(7.5).fillColor("#888888");
        doc.text(lbl, colL, rowY, { lineBreak: false, width: 90 });
        doc.font("Helvetica").fontSize(8).fillColor("#222222");
        doc.text(val, valL, rowY, { lineBreak: false, width: CONTENT_W / 2 - 100 });
      }
      if (rightRows[i]) {
        const [lbl, val] = rightRows[i];
        doc.font("Helvetica").fontSize(7.5).fillColor("#888888");
        doc.text(lbl, colR, rowY, { lineBreak: false, width: 90 });
        doc.font("Helvetica").fontSize(8).fillColor("#222222");
        doc.text(val, valR, rowY, { lineBreak: false, width: CONTENT_W / 2 - 120 });
      }
      rowY += 18;
    }

    // ── BALANCE SUMMARY BAR ───────────────────────────────────────────────────
    const summaryBarY = acctBoxY + acctBoxH + 10;
    doc.rect(MARGIN, summaryBarY, CONTENT_W, 48).fillColor("#1a3a6b").fill();

    const sbCols = [
      { label: "OPENING BALANCE", value: fmt(opts.openingBalance), color: "#ffffff", bold: false },
      { label: "TOTAL CREDITS", value: `+${fmt(totalCredits)}`, color: "#86efac", bold: false },
      { label: "TOTAL DEBITS", value: `-${fmt(totalDebits)}`, color: "#fca5a5", bold: false },
      { label: "CLOSING BALANCE", value: fmt(opts.closingBalance), color: "#ffffff", bold: true },
    ];
    const sbW = CONTENT_W / 4;
    const sbXPositions = [MARGIN + 22, MARGIN + sbW + 22, MARGIN + sbW * 2 + 22, MARGIN + sbW * 3 + 22];

    sbCols.forEach((col, i) => {
      const bx = sbXPositions[i];
      doc.font("Helvetica").fontSize(6.5).fillColor("rgba(255,255,255,0.7)");
      doc.text(col.label, bx, summaryBarY + 9, { lineBreak: false, width: sbW - 20 });
      doc.font(col.bold ? "Helvetica-Bold" : "Helvetica-Bold").fontSize(col.bold ? 10 : 9).fillColor(col.color);
      doc.text(col.value, bx, summaryBarY + 22, { lineBreak: false, width: sbW - 20 });
    });

    // ── TRANSACTION TABLE ─────────────────────────────────────────────────────
    let tableY = summaryBarY + 60;

    // Column definitions (x, width)
    const COLS = {
      date:  { x: MARGIN + 2,   w: 58  },
      desc:  { x: MARGIN + 60,  w: 175 },
      ref:   { x: MARGIN + 235, w: 92  },
      type:  { x: MARGIN + 327, w: 68  },
      debit: { x: MARGIN + 395, w: 52  },
      credit:{ x: MARGIN + 447, w: 50  },
    };

    function drawTransactionHeader(ty: number) {
      doc.rect(MARGIN, ty, CONTENT_W, 20).fillColor("#dde4f0").fill();
      doc.moveTo(MARGIN, ty).lineTo(W - MARGIN, ty).lineWidth(1).strokeColor("#1a3a6b").stroke();
      doc.moveTo(MARGIN, ty + 20).lineTo(W - MARGIN, ty + 20).lineWidth(0.5).strokeColor("#1a3a6b").stroke();
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#1a3a6b");
      doc.text("DATE",        COLS.date.x,          ty + 7, { lineBreak: false, width: COLS.date.w });
      doc.text("DESCRIPTION", COLS.desc.x,          ty + 7, { lineBreak: false, width: COLS.desc.w });
      doc.text("REFERENCE",   COLS.ref.x,           ty + 7, { lineBreak: false, width: COLS.ref.w });
      doc.text("TYPE",        COLS.type.x,           ty + 7, { lineBreak: false, width: COLS.type.w });
      doc.text("DEBIT",       COLS.debit.x,          ty + 7, { lineBreak: false, width: COLS.debit.w, align: "right" });
      doc.text("CREDIT",      COLS.credit.x,         ty + 7, { lineBreak: false, width: COLS.credit.w, align: "right" });
    }

    drawTransactionHeader(tableY);
    tableY += 20;

    for (let idx = 0; idx < opts.transactions.length; idx++) {
      const tx = opts.transactions[idx];
      const desc = tx.description || mapDisplayType(tx.type);
      const descH = doc.fontSize(8).heightOfString(desc, { width: COLS.desc.w - 2 });
      const rowH = Math.max(20, descH + 10);

      if (tableY + rowH > 790) {
        addFooter(pageNum, totalPages);
        doc.addPage();
        tableY = MARGIN + 46;
        drawTransactionHeader(tableY);
        tableY += 20;
      }

      const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
      doc.rect(MARGIN, tableY, CONTENT_W, rowH).fillColor(rowBg).fill();
      doc.moveTo(MARGIN, tableY + rowH).lineTo(W - MARGIN, tableY + rowH).lineWidth(0.3).strokeColor("#e5e9f0").stroke();

      // Vertical separators
      [COLS.desc.x, COLS.ref.x, COLS.type.x, COLS.debit.x, COLS.credit.x].forEach(cx => {
        doc.moveTo(cx - 2, tableY).lineTo(cx - 2, tableY + rowH).lineWidth(0.3).strokeColor("#d0d7e3").stroke();
      });

      const cy = tableY + (rowH - 8) / 2;

      const txDateStr = new Date(tx.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      doc.font("Helvetica").fontSize(8).fillColor("#333333");
      doc.text(txDateStr, COLS.date.x, cy, { lineBreak: false, width: COLS.date.w });

      // Description — full, wraps
      doc.font("Helvetica").fontSize(8).fillColor("#333333");
      doc.text(desc, COLS.desc.x, tableY + 5, { width: COLS.desc.w - 2, lineBreak: true });

      // Reference in blue monospace
      doc.font("Courier").fontSize(7.5).fillColor("#2563eb");
      doc.text(tx.reference, COLS.ref.x, cy, { lineBreak: false, width: COLS.ref.w - 2 });

      // Type
      doc.font("Helvetica").fontSize(7.5).fillColor("#666666");
      doc.text(mapDisplayType(tx.type), COLS.type.x, cy, { lineBreak: false, width: COLS.type.w - 2 });

      // Debit / Credit
      if (!tx.isCredit) {
        doc.font("Helvetica").fontSize(8).fillColor("#dc2626");
        doc.text(fmt(tx.amount), COLS.debit.x, cy, { lineBreak: false, width: COLS.debit.w, align: "right" });
        doc.font("Helvetica").fontSize(8).fillColor("#aaaaaa");
        doc.text("—", COLS.credit.x, cy, { lineBreak: false, width: COLS.credit.w, align: "center" });
      } else {
        doc.font("Helvetica").fontSize(8).fillColor("#aaaaaa");
        doc.text("—", COLS.debit.x, cy, { lineBreak: false, width: COLS.debit.w, align: "center" });
        doc.font("Helvetica").fontSize(8).fillColor("#16a34a");
        doc.text(fmt(tx.amount), COLS.credit.x, cy, { lineBreak: false, width: COLS.credit.w, align: "right" });
      }

      tableY += rowH;
    }

    // Bottom table rule
    doc.moveTo(MARGIN, tableY).lineTo(W - MARGIN, tableY).lineWidth(1.5).strokeColor("#1a3a6b").stroke();

    // ── SUMMARY + NOTICES SECTION ─────────────────────────────────────────────
    const belowTableY = tableY + 15;

    // Check if we need a new page
    if (belowTableY + 130 > 780) {
      addFooter(pageNum, totalPages);
      doc.addPage();
    }

    const noticesY = pageNum > 1 ? MARGIN + 46 : belowTableY;
    const noticesW = 270;
    const summaryW = 215;
    const summaryX = MARGIN + noticesW + 10;

    // Important Notices box
    const noticesLineH = 13;
    const noticesLines = [
      "1. Please verify all transactions and report discrepancies within 14 days to support@bankofasia.com",
      "2. This statement covers the period stated above only.",
      "3. Unauthorized use of account information is prohibited.",
      "4. For disputes or queries: +65 6000 0000",
      "5. Computer generated — valid without wet signature.",
    ];
    const noticesTextH = noticesLines.length * noticesLineH + 8;
    const noticesH = 16 + noticesTextH + 8;

    doc.rect(MARGIN, noticesY, noticesW, noticesH).fillColor("#f7f9fc").fill();
    doc.rect(MARGIN, noticesY, noticesW, noticesH).strokeColor("#c0c8d8").lineWidth(0.5).stroke();
    doc.rect(MARGIN, noticesY, noticesW, 16).fillColor("#e2e8f2").fill();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#1a3a6b");
    doc.text("IMPORTANT NOTICES", MARGIN + 8, noticesY + 4, { lineBreak: false });

    let nlY = noticesY + 20;
    doc.font("Helvetica").fontSize(7.5).fillColor("#555555");
    noticesLines.forEach(line => {
      doc.text(line, MARGIN + 8, nlY, { width: noticesW - 16, lineBreak: false });
      nlY += noticesLineH;
    });

    // Account Summary box
    const summaryRows: [string, string, string, boolean][] = [
      ["Opening Balance", fmt(opts.openingBalance), "#333333", false],
      ["Total Credits", `+${fmt(totalCredits)}`, "#16a34a", false],
      ["Total Debits", `-${fmt(totalDebits)}`, "#dc2626", false],
      ["Net Movement", (netMovement >= 0 ? "+" : "") + fmt(Math.abs(netMovement)), netMovement >= 0 ? "#16a34a" : "#dc2626", false],
    ];
    const summaryDataH = summaryRows.length * 16 + 2 + 22; // rows + separator + closing row
    const summaryH = 16 + summaryDataH + 8;

    doc.rect(summaryX, noticesY, summaryW, summaryH).fillColor("#f7f9fc").fill();
    doc.rect(summaryX, noticesY, summaryW, summaryH).strokeColor("#c0c8d8").lineWidth(0.5).stroke();
    doc.rect(summaryX, noticesY, summaryW, 16).fillColor("#e2e8f2").fill();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#1a3a6b");
    doc.text("ACCOUNT SUMMARY", summaryX + 8, noticesY + 4, { lineBreak: false });

    let srY = noticesY + 20;
    const valColX = summaryX + summaryW - 8;
    summaryRows.forEach(([lbl, val, col]) => {
      doc.font("Helvetica").fontSize(8).fillColor("#555555");
      doc.text(lbl, summaryX + 8, srY, { lineBreak: false, width: 110 });
      doc.font("Helvetica").fontSize(8).fillColor(col as string);
      doc.text(val, summaryX + 8, srY, { lineBreak: false, width: summaryW - 16, align: "right" });
      srY += 16;
    });
    // Separator
    doc.moveTo(summaryX + 4, srY).lineTo(summaryX + summaryW - 4, srY).lineWidth(0.5).strokeColor("#c0c8d8").stroke();
    srY += 4;
    // Closing balance row (highlighted)
    doc.rect(summaryX, srY, summaryW, 22).fillColor("#e8edf8").fill();
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#1a3a6b");
    doc.text("Closing Balance", summaryX + 8, srY + 6, { lineBreak: false, width: 110 });
    doc.text(fmt(opts.closingBalance), summaryX + 8, srY + 6, { lineBreak: false, width: summaryW - 16, align: "right" });

    // ── SIGNATURE SECTION ─────────────────────────────────────────────────────
    const sigSectionY = noticesY + Math.max(noticesH, summaryH) + 20;

    if (sigSectionY + 120 > 790) {
      addFooter(pageNum, totalPages);
      doc.addPage();
    }

    const sigTopY = pageNum > totalPages - 1 ? sigSectionY : MARGIN + 46;
    // Thin rule
    doc.moveTo(MARGIN, sigTopY).lineTo(W - MARGIN, sigTopY).lineWidth(0.5).strokeColor("#cccccc").stroke();

    // "AUTHORISED SIGNATORIES" label
    doc.font("Helvetica").fontSize(7.5).fillColor("#888888");
    doc.text("AUTHORISED SIGNATORIES", MARGIN, sigTopY + 6, { align: "center", width: CONTENT_W, lineBreak: false });

    const sigY = sigTopY + 18;
    const x1 = MARGIN + 10;
    const x2 = W / 2 + 20;

    // ── Left signature — Dr. James Wei ────────────────────────────────────────
    doc.font("Helvetica").fontSize(7).fillColor("#aaaaaa");
    doc.text("Authorised Signatory", x1, sigY, { lineBreak: false });

    const sy1 = sigY + 30;
    doc.save();
    doc.strokeColor("#0d1f3c").lineWidth(1.3).lineCap("round").lineJoin("round");
    doc.moveTo(x1, sy1)
      .bezierCurveTo(x1 + 6, sy1 - 14, x1 + 16, sy1 - 18, x1 + 28, sy1 - 10)
      .bezierCurveTo(x1 + 38, sy1 - 4, x1 + 44, sy1 - 16, x1 + 56, sy1 - 20)
      .bezierCurveTo(x1 + 66, sy1 - 24, x1 + 76, sy1 - 12, x1 + 88, sy1 - 8)
      .bezierCurveTo(x1 + 96, sy1 - 4, x1 + 104, sy1 - 16, x1 + 116, sy1 - 6)
      .stroke();
    doc.moveTo(x1 + 20, sy1 - 8)
      .bezierCurveTo(x1 + 26, sy1 + 2, x1 + 36, sy1 + 4, x1 + 48, sy1 - 4)
      .bezierCurveTo(x1 + 58, sy1 - 10, x1 + 64, sy1 + 2, x1 + 72, sy1)
      .strokeColor("#0d1f3c").lineWidth(0.9).stroke();
    doc.moveTo(x1, sy1 + 4)
      .bezierCurveTo(x1 + 30, sy1 + 10, x1 + 70, sy1 + 6, x1 + 120, sy1 + 8)
      .strokeColor("#0d1f3c").lineWidth(0.7).stroke();
    doc.moveTo(x1 + 2, sy1 - 2)
      .bezierCurveTo(x1 - 2, sy1 - 10, x1 + 4, sy1 - 16, x1 + 10, sy1 - 12)
      .strokeColor("#0d1f3c").lineWidth(0.8).stroke();
    doc.restore();

    doc.moveTo(x1, sigY + 48).lineTo(x1 + 150, sigY + 48).strokeColor("#333333").lineWidth(0.7).stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#0d1f3c");
    doc.text("Dr. James Wei", x1, sigY + 52, { lineBreak: false });
    doc.font("Helvetica").fontSize(7.5).fillColor("#555555");
    doc.text("Chief Operations Officer", x1, sigY + 63, { lineBreak: false });
    doc.text("Bank of Asia Online", x1, sigY + 74, { lineBreak: false });
    doc.font("Helvetica").fontSize(7).fillColor("#888888");
    doc.text("MAS License: BOA-OPS-2024-001", x1, sigY + 85, { lineBreak: false });

    // ── Right signature — Ms. Sarah Chen ──────────────────────────────────────
    doc.font("Helvetica").fontSize(7).fillColor("#aaaaaa");
    doc.text("Authorised Signatory", x2, sigY, { lineBreak: false });

    const sy2 = sigY + 30;
    doc.save();
    doc.strokeColor("#0d1f3c").lineWidth(1.3).lineCap("round").lineJoin("round");
    doc.moveTo(x2, sy2)
      .bezierCurveTo(x2 + 10, sy2 - 20, x2 + 24, sy2 - 22, x2 + 38, sy2 - 12)
      .bezierCurveTo(x2 + 50, sy2 - 4, x2 + 56, sy2 - 18, x2 + 70, sy2 - 22)
      .bezierCurveTo(x2 + 82, sy2 - 26, x2 + 94, sy2 - 10, x2 + 108, sy2 - 14)
      .bezierCurveTo(x2 + 118, sy2 - 18, x2 + 126, sy2 - 6, x2 + 138, sy2 - 10)
      .stroke();
    doc.moveTo(x2 + 4, sy2 - 14)
      .bezierCurveTo(x2 + 8, sy2 - 28, x2 + 20, sy2 - 30, x2 + 28, sy2 - 18)
      .strokeColor("#0d1f3c").lineWidth(0.9).stroke();
    doc.moveTo(x2 + 40, sy2 - 4)
      .bezierCurveTo(x2 + 60, sy2 + 8, x2 + 90, sy2 + 6, x2 + 120, sy2 + 2)
      .bezierCurveTo(x2 + 130, sy2, x2 + 136, sy2 - 4, x2 + 142, sy2 - 2)
      .strokeColor("#0d1f3c").lineWidth(0.8).stroke();
    doc.moveTo(x2 + 100, sy2 - 12)
      .bezierCurveTo(x2 + 108, sy2 - 4, x2 + 114, sy2 + 2, x2 + 122, sy2 - 6)
      .strokeColor("#0d1f3c").lineWidth(0.7).stroke();
    doc.restore();

    doc.moveTo(x2, sigY + 48).lineTo(x2 + 150, sigY + 48).strokeColor("#333333").lineWidth(0.7).stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#0d1f3c");
    doc.text("Ms. Sarah Chen, LLB", x2, sigY + 52, { lineBreak: false });
    doc.font("Helvetica").fontSize(7.5).fillColor("#555555");
    doc.text("Head of Compliance & Risk", x2, sigY + 63, { lineBreak: false });
    doc.text("Bank of Asia Online", x2, sigY + 74, { lineBreak: false });
    doc.font("Helvetica").fontSize(7).fillColor("#888888");
    doc.text("MAS License: BOA-COMP-2024-002", x2, sigY + 85, { lineBreak: false });

    // ── Official stamp (centered between signatures) ───────────────────────────
    const stampCX = 297;
    const stampCY = sigY + 50;

    // Outer ring
    doc.circle(stampCX, stampCY, 40).strokeColor("#1a3a6b").lineWidth(2).stroke();
    // Inner ring
    doc.circle(stampCX, stampCY, 34).strokeColor("#1a3a6b").lineWidth(0.8).stroke();

    if (hasLogo) {
      const logoImgW = 38;
      doc.image(logoPath, stampCX - logoImgW / 2, stampCY - 20, { width: logoImgW });
    } else {
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#1a3a6b");
      doc.text("BOA", stampCX - 12, stampCY - 12, { lineBreak: false });
    }

    doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#1a3a6b");
    doc.text("✓ VERIFIED", stampCX - 27, stampCY + 8, { width: 54, align: "center", lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#1a3a6b");
    doc.text("BANK OF ASIA ONLINE", stampCX - 27, stampCY + 18, { width: 54, align: "center", lineBreak: false });

    // ── Final footer ──────────────────────────────────────────────────────────
    addFooter(pageNum, totalPages);

    doc.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { accountId, from: fromStr, to: toStr } = await req.json();
    if (!accountId || !fromStr || !toStr) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const from = new Date(fromStr);
    const to = new Date(toStr);

    const account = await prisma.account.findFirst({
      where: { id: accountId, userId: session.user.id },
      include: { user: { select: { firstName: true, lastName: true, addressLine1: true, addressLine2: true, city: true, state: true, country: true, zipCode: true } } },
    });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    const allTxs = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderAccount: { id: accountId } },
          { receiverAccount: { id: accountId } },
        ],
        status: "COMPLETED",
      },
      orderBy: { createdAt: "asc" },
      include: {
        senderAccount: { select: { id: true } },
        receiverAccount: { select: { id: true } },
      },
    });

    const currentBalance = Number(account.balance);

    const txsAfterTo = allTxs.filter(tx => new Date(tx.createdAt) > to);
    let netAfterTo = 0;
    for (const tx of txsAfterTo) {
      if (tx.receiverAccount?.id === accountId) netAfterTo += Number(tx.amount);
      if (tx.senderAccount?.id === accountId) netAfterTo -= Number(tx.amount);
    }
    const closingBalance = currentBalance - netAfterTo;

    const txsInPeriod = allTxs.filter(tx => {
      const d = new Date(tx.createdAt);
      return d >= from && d <= to;
    });

    let netInPeriod = 0;
    for (const tx of txsInPeriod) {
      if (tx.receiverAccount?.id === accountId) netInPeriod += Number(tx.amount);
      if (tx.senderAccount?.id === accountId) netInPeriod -= Number(tx.amount);
    }
    const openingBalance = closingBalance - netInPeriod;

    let running = openingBalance;
    const txsWithRunning = txsInPeriod.map(tx => {
      const isCredit = tx.receiverAccount?.id === accountId;
      const isSender = tx.senderAccount?.id === accountId;
      const delta = isCredit ? Number(tx.amount) : isSender ? -Number(tx.amount) : 0;
      running += delta;
      return {
        id: tx.id,
        reference: tx.reference,
        type: tx.type,
        status: tx.status,
        amount: Number(tx.amount),
        currency: tx.currency,
        description: tx.description,
        createdAt: tx.createdAt,
        isCredit,
        runningBalance: running,
      };
    });

    const pdfBuffer = await generateStatementPDF({
      account: {
        accountNumber: account.accountNumber,
        currency: account.currency,
        balance: currentBalance,
      },
      user: {
        firstName: account.user.firstName,
        lastName: account.user.lastName,
        addressLine1: account.user.addressLine1,
        addressLine2: account.user.addressLine2,
        city: account.user.city,
        state: account.user.state,
        country: account.user.country,
        zipCode: account.user.zipCode,
      },
      from,
      to,
      transactions: txsWithRunning,
      openingBalance,
      closingBalance,
    });

    const filename = `statement-${account.currency}-${from.toISOString().slice(0, 10)}-${to.toISOString().slice(0, 10)}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[STATEMENTS_EXPORT]", err);
    return NextResponse.json({ error: "Failed to generate statement" }, { status: 500 });
  }
}
