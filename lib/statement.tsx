import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

export interface StatementTransaction {
  id: string;
  reference: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  description: string | null;
  createdAt: string | Date;
  isCredit: boolean;
  counterparty?: string;
  runningBalance?: number;
}

export interface StatementData {
  accountNumber: string;
  currency: string;
  ownerName: string;
  email: string;
  fromDate: string | Date;
  toDate: string | Date;
  openingBalance: number;
  closingBalance: number;
  transactions: StatementTransaction[];
  // Optional address fields
  address?: string;
  phone?: string;
}

const C = {
  navy:     "#002B6B",
  navyDark: "#001A47",
  gold:     "#B8943F",
  goldLight:"#D4AE5A",
  text:     "#0F1C2E",
  sub:      "#2D3E55",
  muted:    "#5A6E87",
  light:    "#8EA3BA",
  bg:       "#FFFFFF",
  bgAlt:    "#F7F9FC",
  bgBlue:   "#EBF0F8",
  border:   "#D8E2EE",
  borderD:  "#BFD0E4",
  credit:   "#0A5C3A",
  debit:    "#8B1A1A",
  creditBg: "#EBF8F3",
  debitBg:  "#FEF1F1",
};

const S = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    fontFamily: "Helvetica",
    paddingBottom: 90,
  },

  // Top navy stripe
  topStripe: { height: 8, backgroundColor: C.navyDark },
  goldStripe: { height: 3, backgroundColor: C.gold },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 44,
    paddingTop: 22,
    paddingBottom: 20,
    backgroundColor: C.bg,
    borderBottomWidth: 2,
    borderBottomColor: C.navy,
  },
  logoBlock: { flexDirection: "column" },
  bankName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    letterSpacing: 2.5,
  },
  bankTagline: {
    fontSize: 7.5,
    color: C.gold,
    letterSpacing: 2.5,
    marginTop: 3,
    textTransform: "uppercase",
  },
  bankAddress: {
    fontSize: 7,
    color: C.muted,
    marginTop: 7,
    lineHeight: 1.6,
  },
  headerRight: { alignItems: "flex-end" },
  docTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  docRef: {
    fontSize: 9,
    fontFamily: "Courier-Bold",
    color: C.gold,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  docDate: {
    fontSize: 8,
    color: C.muted,
    marginTop: 2,
    textAlign: "right",
  },

  // Blue accent bar
  accentBar: {
    height: 2,
    backgroundColor: C.bgBlue,
    marginHorizontal: 0,
  },

  // Account + statement info row
  infoSection: {
    flexDirection: "row",
    paddingHorizontal: 44,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.bgAlt,
    gap: 0,
  },
  infoCol: { flex: 1, paddingRight: 20 },
  infoColLast: { flex: 1, alignItems: "flex-end" },
  infoLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: C.text,
    marginBottom: 2,
  },
  infoSub: { fontSize: 8, color: C.muted, marginBottom: 2 },
  accountNum: {
    fontSize: 13,
    fontFamily: "Courier-Bold",
    color: C.navy,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  iban: {
    fontSize: 8,
    fontFamily: "Courier",
    color: C.muted,
    letterSpacing: 0.5,
  },

  // Summary boxes
  summarySection: {
    flexDirection: "row",
    paddingHorizontal: 44,
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  summaryBox: {
    flex: 1, padding: "11px 12px", borderRadius: 5,
    backgroundColor: C.bg, borderWidth: 1,
    borderColor: C.border, borderLeftWidth: 3,
    borderLeftColor: C.navy,
  },
  summaryBoxCredit: {
    flex: 1, padding: "11px 12px", borderRadius: 5,
    backgroundColor: C.creditBg, borderWidth: 1,
    borderColor: "#B2DFCD", borderLeftWidth: 3,
    borderLeftColor: C.credit,
  },
  summaryBoxDebit: {
    flex: 1, padding: "11px 12px", borderRadius: 5,
    backgroundColor: C.debitBg, borderWidth: 1,
    borderColor: "#F5C6C6", borderLeftWidth: 3,
    borderLeftColor: C.debit,
  },
  summaryBoxClose: {
    flex: 1, padding: "11px 12px", borderRadius: 5,
    backgroundColor: C.bgBlue, borderWidth: 1,
    borderColor: "#B8CFE8", borderLeftWidth: 3,
    borderLeftColor: C.navy,
  },
  summaryLabel: {
    fontSize: 7, fontFamily: "Helvetica-Bold",
    color: C.muted, letterSpacing: 1,
    textTransform: "uppercase", marginBottom: 4,
  },
  summaryValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.text },
  summaryValueCredit: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.credit },
  summaryValueDebit: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.debit },
  summaryValueClose: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.navy },
  summaryCount: { fontSize: 7.5, color: C.muted, marginTop: 2 },

  // Divider line
  sectionDivider: {
    marginHorizontal: 44, borderTopWidth: 1,
    borderTopColor: C.borderD, marginBottom: 0,
  },

  // Transaction table
  tableSection: { paddingHorizontal: 44, paddingTop: 18 },
  tableTitle: {
    fontSize: 9, fontFamily: "Helvetica-Bold",
    color: C.navy, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 10,
    paddingBottom: 6, borderBottomWidth: 1.5,
    borderBottomColor: C.navy,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 7, paddingHorizontal: 10,
    backgroundColor: C.navy, marginBottom: 1,
  },

  thDate:    { width: 58,  fontSize: 7, fontFamily: "Helvetica-Bold", color: "#FFFFFF", letterSpacing: 0.5 },
  thRef:     { width: 86,  fontSize: 7, fontFamily: "Helvetica-Bold", color: "#FFFFFF", letterSpacing: 0.5 },
  thDesc:    { flex: 1,    fontSize: 7, fontFamily: "Helvetica-Bold", color: "#FFFFFF", letterSpacing: 0.5 },
  thType:    { width: 58,  fontSize: 7, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 },
  thStatus:  { width: 52,  fontSize: 7, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 },
  thDebit:   { width: 74,  fontSize: 7, fontFamily: "Helvetica-Bold", color: "#FFD4D4", letterSpacing: 0.5, textAlign: "right" },
  thCredit:  { width: 74,  fontSize: 7, fontFamily: "Helvetica-Bold", color: "#C8F0DC", letterSpacing: 0.5, textAlign: "right" },
  thBalance: { width: 78,  fontSize: 7, fontFamily: "Helvetica-Bold", color: "#D4E8FF", letterSpacing: 0.5, textAlign: "right" },

  tableRow: {
    flexDirection: "row", paddingVertical: 7, paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  tableRowAlt: {
    flexDirection: "row", paddingVertical: 7, paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
    backgroundColor: C.bgAlt,
  },

  tdDate:    { width: 58,  fontSize: 7.5, color: C.sub },
  tdRef:     { width: 86,  fontSize: 7,   color: C.navy, fontFamily: "Courier" },
  tdDesc:    { flex: 1,    fontSize: 7.5, color: C.text },
  tdType:    { width: 58,  fontSize: 6.5, color: C.muted },
  tdStatus:  { width: 52,  fontSize: 6.5, color: C.muted },
  tdDebit:   { width: 74,  fontSize: 8,   fontFamily: "Helvetica-Bold", color: C.debit, textAlign: "right" },
  tdCredit:  { width: 74,  fontSize: 8,   fontFamily: "Helvetica-Bold", color: C.credit, textAlign: "right" },
  tdBalance: { width: 78,  fontSize: 8,   fontFamily: "Helvetica-Bold", color: C.navy, textAlign: "right" },
  tdEmpty:   { width: 74,  fontSize: 7.5, color: C.light, textAlign: "right" },

  legalNotice: {
    paddingHorizontal: 44,
    paddingBottom: 10,
  },
  legalText: { fontSize: 7, color: C.light, lineHeight: 1.5 },

  // Footer
  footer: { position: "absolute", bottom: 0, left: 0, right: 0 },
  footerTop: {
    paddingHorizontal: 44, paddingVertical: 9,
    borderTopWidth: 1, borderTopColor: C.border,
    flexDirection: "row", justifyContent: "space-between",
    backgroundColor: C.bgAlt,
  },
  footerText: { fontSize: 7, color: C.muted },
  footerBot: {
    paddingHorizontal: 44, paddingVertical: 7,
    backgroundColor: C.navyDark,
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center",
  },
  footerBotText: { fontSize: 6.5, color: "rgba(255,255,255,0.4)" },
  pageNum: { fontSize: 7, color: C.muted, textAlign: "right" },
});

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(Math.abs(amount));
}

function typeShort(type: string): string {
  if (type === "INTERNAL") return "Int'l Transfer";
  if (type === "LOCAL_WIRE") return "Local Wire";
  if (type === "INTERNATIONAL_WIRE") return "Intl Wire";
  if (type === "ADMIN_DEPOSIT") return "Cr. Deposit";
  if (type === "ADMIN_DEBIT") return "Dr. Debit";
  return type.replace(/_/g, " ").slice(0, 14);
}



function StatementDocument({ data }: { data: StatementData }) {
  const fromStr = new Date(data.fromDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const toStr = new Date(data.toDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const generated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const genFull = new Date().toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" });

  const totalCredits = data.transactions.filter(t => t.isCredit).reduce((s, t) => s + t.amount, 0);
  const totalDebits = data.transactions.filter(t => !t.isCredit).reduce((s, t) => s + t.amount, 0);
  const creditCount = data.transactions.filter(t => t.isCredit).length;
  const debitCount = data.transactions.filter(t => !t.isCredit).length;

  let runningBal = data.openingBalance;
  const txsWithBalance = data.transactions.map(tx => {
    if (tx.runningBalance !== undefined) return tx;
    runningBal = tx.isCredit ? runningBal + tx.amount : runningBal - tx.amount;
    return { ...tx, runningBalance: runningBal };
  });

  const maskedAccount = `•••• •••• ${data.accountNumber.slice(-4)}`;
  const stmRef = `STM-${data.accountNumber.slice(-6)}-${new Date(data.fromDate).getFullYear()}${String(new Date(data.fromDate).getMonth() + 1).padStart(2, "0")}`;

  return (
    <Document
      title={`Bank of Asia Online Account Statement — ${data.ownerName}`}
      author="Bank of Asia Online"
      subject={`Account Statement — ${data.ownerName}`}
      creator="Bank of Asia Online Digital Banking Platform"
    >
      <Page size="A4" style={S.page}>
        {/* Top stripes */}
        <View style={S.topStripe} />
        <View style={S.goldStripe} />

        {/* Header */}
        <View style={S.header}>
          <View style={S.logoBlock}>
            <Text style={S.bankName}>BANK OF ASIA</Text>
            <Text style={S.bankTagline}>Premium Digital Banking • Asia Pacific</Text>
            <Text style={{ fontSize: 8, color: "#374151", lineHeight: 1.4, marginTop: 7 }}>
              {"Bank of Asia Online  ·  123 Financial District, Singapore 048946  ·  Tel: +65 6532 1234  ·  www.boasiaonline.com"}
            </Text>
          </View>
          <View style={S.headerRight}>
            <Text style={S.docTitle}>Account Statement</Text>
            <Text style={S.docRef}>{stmRef}</Text>
            <Text style={[S.docDate, { marginTop: 6, fontFamily: "Helvetica-Bold", color: C.sub }]}>Statement Period</Text>
            <Text style={S.docDate}>{fromStr}</Text>
            <Text style={[S.docDate, { color: C.light }]}>through</Text>
            <Text style={S.docDate}>{toStr}</Text>
            <Text style={[S.docDate, { marginTop: 8, fontSize: 7, color: C.light }]}>
              {"Generated: "}{genFull}
            </Text>
          </View>
        </View>

        {/* Account info section */}
        <View style={S.infoSection}>
          <View style={S.infoCol}>
            <Text style={S.infoLabel}>Account Holder</Text>
            <Text style={S.infoValue}>{data.ownerName}</Text>
            <Text style={S.infoSub}>{data.email}</Text>
            {data.phone && <Text style={S.infoSub}>{data.phone}</Text>}
            {data.address && (
              <View style={{ minHeight: 36, justifyContent: "flex-start" }}>
                <Text style={{ fontSize: 9, color: "#374151", lineHeight: 1.8, flex: 1 }}>
                  {data.address}
                </Text>
              </View>
            )}
          </View>
          <View style={S.infoCol}>
            <Text style={S.infoLabel}>Account Details</Text>
            <Text style={S.accountNum}>{maskedAccount}</Text>
            <Text style={S.infoSub}>{data.currency} Personal Account  •  Digital Banking</Text>
            <Text style={S.iban}>IBAN: AS{data.accountNumber.slice(-8)}BKSG{data.currency.slice(0, 3)}</Text>
          </View>
          <View style={S.infoColLast}>
            <Text style={S.infoLabel}>Account Status</Text>
            <Text style={[S.infoSub, { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.credit }]}>● ACTIVE</Text>
            <Text style={[S.infoLabel, { marginTop: 10 }]}>Statement Transactions</Text>
            <Text style={[S.infoSub, { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.navy }]}>
              {data.transactions.length} Total
            </Text>
            <Text style={[S.infoSub, { fontSize: 8 }]}>{creditCount} credits  •  {debitCount} debits</Text>
          </View>
        </View>

        {/* Summary boxes */}
        <View style={S.summarySection}>
          <View style={S.summaryBox}>
            <Text style={S.summaryLabel}>Opening Balance</Text>
            <Text style={S.summaryValue}>{fmt(data.openingBalance, data.currency)}</Text>
            <Text style={S.summaryCount}>As of {fromStr}</Text>
          </View>
          <View style={S.summaryBoxCredit}>
            <Text style={S.summaryLabel}>Total Credits</Text>
            <Text style={S.summaryValueCredit}>+ {fmt(totalCredits, data.currency)}</Text>
            <Text style={S.summaryCount}>{creditCount} credit transaction{creditCount !== 1 ? "s" : ""}</Text>
          </View>
          <View style={S.summaryBoxDebit}>
            <Text style={S.summaryLabel}>Total Debits</Text>
            <Text style={S.summaryValueDebit}>- {fmt(totalDebits, data.currency)}</Text>
            <Text style={S.summaryCount}>{debitCount} debit transaction{debitCount !== 1 ? "s" : ""}</Text>
          </View>
          <View style={S.summaryBoxClose}>
            <Text style={S.summaryLabel}>Closing Balance</Text>
            <Text style={S.summaryValueClose}>{fmt(data.closingBalance, data.currency)}</Text>
            <Text style={S.summaryCount}>As of {toStr}</Text>
          </View>
        </View>

        {/* Transaction table */}
        <View style={S.tableSection}>
          <Text style={S.tableTitle}>Transaction History</Text>
          <View style={S.tableHeader}>
            <Text style={S.thDate}>Date</Text>
            <Text style={S.thRef}>Reference No.</Text>
            <Text style={S.thDesc}>Description / Counterparty</Text>
            <Text style={S.thType}>Category</Text>
            <Text style={S.thStatus}>Status</Text>
            <Text style={S.thDebit}>Debit (DR)</Text>
            <Text style={S.thCredit}>Credit (CR)</Text>
            <Text style={S.thBalance}>Balance</Text>
          </View>

          {txsWithBalance.length === 0 ? (
            <View style={{ padding: "28px 10px" }}>
              <Text style={{ fontSize: 10, color: C.muted, textAlign: "center" }}>
                No transactions recorded during this statement period.
              </Text>
            </View>
          ) : (
            txsWithBalance.map((tx, i) => {
              const d = new Date(tx.createdAt);
              const dateStr = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
              const desc = (tx.description || tx.counterparty || typeShort(tx.type)).slice(0, 34);
              const rowStyle = i % 2 === 0 ? S.tableRow : S.tableRowAlt;
              return (
                <View key={tx.id} style={rowStyle} wrap={false}>
                  <Text style={S.tdDate}>{dateStr}</Text>
                  <Text style={S.tdRef}>{tx.reference.slice(0, 16)}</Text>
                  <Text style={S.tdDesc}>{desc}</Text>
                  <Text style={S.tdType}>{typeShort(tx.type)}</Text>
                  <Text style={S.tdStatus}>{tx.status === "COMPLETED" ? "POSTED" : tx.status.slice(0, 9)}</Text>
                  {tx.isCredit ? (
                    <>
                      <Text style={S.tdEmpty}>—</Text>
                      <Text style={S.tdCredit}>{fmt(tx.amount, tx.currency)}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={S.tdDebit}>{fmt(tx.amount, tx.currency)}</Text>
                      <Text style={S.tdEmpty}>—</Text>
                    </>
                  )}
                  <Text style={S.tdBalance}>
                    {tx.runningBalance !== undefined ? fmt(tx.runningBalance, tx.currency) : "—"}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Authorised Signatory — text only, no SVG, no stamp */}
        <View style={{ paddingHorizontal: 44, paddingBottom: 20 }}>
          <View style={{
            marginTop: 36,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            borderTopStyle: "solid",
          }}>
            <Text style={{ fontSize: 8, color: "#9CA3AF", letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center", marginBottom: 28 }}>
              Authorised Signatory
            </Text>
            <View style={{ width: "45%" }}>
              <View style={{ width: 180, height: 1, backgroundColor: "#CBD5E1", marginBottom: 10 }} />
              <Text style={{ fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#0A1628", marginBottom: 4 }}>
                Dr. James Wei
              </Text>
              <Text style={{ fontSize: 9, color: "#374151", marginBottom: 3 }}>
                Chief Operations Officer
              </Text>
              <Text style={{ fontSize: 9, color: "#374151", marginBottom: 3 }}>
                Bank of Asia Online Operations Division
              </Text>
              <Text style={{ fontSize: 9, color: "#6B7280" }}>
                MAS License: BOA-OPS-2024-001
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notices */}
        <View style={S.legalNotice}>
          {[
            "Please verify all transactions and report discrepancies within 14 days to support@boasiaonline.com",
            "This statement covers the period stated above only.",
            "Unauthorized use of account information is prohibited.",
            "For disputes or queries: +65 6532 1234 (Singapore) or +1 (212) 555-0147 (USA)",
            "Computer generated — valid without wet signature.",
          ].map((notice, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 9, alignItems: "flex-start" }}>
              <Text style={{ fontSize: 8.5, color: "#374151", marginRight: 5, lineHeight: 1.6, width: 12, flexShrink: 0 }}>
                {i + 1}.
              </Text>
              <Text style={{ fontSize: 8.5, color: "#374151", flex: 1, lineHeight: 1.6 }}>
                {notice}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={S.footer} fixed>
          <View style={S.footerTop}>
            <View>
              <Text style={S.footerText}>Bank of Asia Online  •  Official Account Statement  •  Ref: {stmRef}</Text>
              <Text style={[S.footerText, { marginTop: 2 }]}>
                {`Account: ${maskedAccount}  •  Currency: ${data.currency}  •  Period: ${fromStr} to ${toStr}`}
              </Text>
            </View>
            <Text style={S.pageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <Text style={{ fontSize: 8, color: "#6B7280" }}>
              Bank of Asia Online  |  Regulated by MAS  |  STRICTLY CONFIDENTIAL
            </Text>
            <Text style={{ fontSize: 8, color: "#6B7280" }}>Page 1 of 1</Text>
          </View>
          <View style={{ marginTop: 3 }}>
            <Text style={{ fontSize: 8, color: "#9CA3AF" }}>www.boasiaonline.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function generateStatementPDF(data: StatementData): Promise<Buffer> {
  const doc = <StatementDocument data={data} />;
  const instance = pdf(doc);
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
