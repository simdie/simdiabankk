import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf, Svg, Path, Line, Rect, Circle } from "@react-pdf/renderer";

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

  // Signature section
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 44,
    paddingTop: 24,
    paddingBottom: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  sigBlock: { width: 190 },
  sigLine: {
    height: 1, backgroundColor: C.borderD, marginBottom: 6,
  },
  sigName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.text, marginBottom: 2 },
  sigTitle: { fontSize: 8, color: C.muted },
  sigLicence: { fontSize: 7, color: C.light, marginTop: 2 },
  stampBlock: { width: 120, alignItems: "center" },
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

// Professional professor-style signature for Dr. James Wei
function SigDrWei() {
  return (
    <Svg width="190" height="58" viewBox="0 0 190 58">
      {/* Capital J with serif top and looped descender */}
      <Path
        d="M 22 11 L 36 11"
        stroke="#1B3A6B" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      <Path
        d="M 30 11 C 30 11 32 9 34 11 C 36 14 34 24 32 34 C 30 44 27 52 20 53 C 13 54 9 49 11 44 C 13 39 18 43 17 48"
        stroke="#1B3A6B" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Dot — period separator */}
      <Circle cx="40" cy="36" r="2.5" fill="#1B3A6B" />
      {/* Flowing middle strokes suggesting 'ames' */}
      <Path
        d="M 46 28 C 52 18 60 20 62 30 C 64 38 60 42 66 36 C 71 30 78 26 82 34 C 86 40 84 46 90 40 C 95 34 102 28 106 36 C 109 42 106 48 112 40"
        stroke="#1B3A6B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* W — distinctive double-peak strokes of 'Wei' */}
      <Path
        d="M 116 22 C 120 34 124 44 128 34 C 132 24 136 22 140 34 C 144 46 148 44 153 30"
        stroke="#1B3A6B" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Long elegant underline with terminal uptick flourish */}
      <Path
        d="M 9 54 C 45 57 95 57 148 52 C 163 50 172 43 165 36"
        stroke="#1B3A6B" strokeWidth="1.3" fill="none" strokeLinecap="round"
      />
    </Svg>
  );
}

// Professional professor-style signature for Ms. Sarah Chen
function SigMsChen() {
  return (
    <Svg width="190" height="58" viewBox="0 0 190 58">
      {/* Capital S — elegant S-curve opening */}
      <Path
        d="M 26 16 C 20 12 10 14 10 24 C 10 32 22 30 24 38 C 26 46 16 50 9 44"
        stroke="#1B3A6B" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Period separator */}
      <Circle cx="32" cy="38" r="2.5" fill="#1B3A6B" />
      {/* Flowing 'arah' middle cursive section */}
      <Path
        d="M 38 28 C 44 18 54 18 56 28 C 58 36 54 40 60 34 C 65 28 73 24 77 32 C 81 40 78 46 84 38 C 89 30 97 26 101 36"
        stroke="#1B3A6B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* C — open bowl of 'Chen' */}
      <Path
        d="M 120 18 C 110 12 98 16 96 28 C 94 40 102 50 114 48 C 122 46 126 38 124 30"
        stroke="#1B3A6B" strokeWidth="2.2" fill="none" strokeLinecap="round"
      />
      {/* h — ascender with arch */}
      <Path
        d="M 128 14 L 128 46 M 128 32 C 132 24 140 22 144 30 C 146 35 144 40 142 46"
        stroke="#1B3A6B" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      {/* en — flowing into end */}
      <Path
        d="M 148 30 C 152 22 160 22 162 30 C 164 37 158 42 152 40 M 162 30 L 148 30"
        stroke="#1B3A6B" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      {/* Elegant underline flourish */}
      <Path
        d="M 8 54 C 45 58 100 58 152 52 C 168 50 176 42 168 34"
        stroke="#1B3A6B" strokeWidth="1.3" fill="none" strokeLinecap="round"
      />
    </Svg>
  );
}

function OfficialStamp({ date }: { date: string }) {
  return (
    <Svg width="108" height="108" viewBox="0 0 108 108">
      <Circle cx="54" cy="54" r="50" stroke={C.navy} strokeWidth="2.5" fill="none" />
      <Circle cx="54" cy="54" r="42" stroke={C.gold} strokeWidth="1" fill="none" />
      <Circle cx="54" cy="54" r="38" stroke={C.navy} strokeWidth="0.5" fill="rgba(0,43,107,0.03)" />
      {/* Stars at top */}
      <Path d="M 54 8 L 55.5 12.5 L 60 12.5 L 56.5 15.5 L 58 20 L 54 17.5 L 50 20 L 51.5 15.5 L 48 12.5 L 52.5 12.5 Z"
        fill={C.gold} />
      <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", fill: C.navy, textAnchor: "middle" }} x="54" y="33">BANK OF ASIA</Text>
      <Text style={{ fontSize: 5.5, fill: C.gold, textAnchor: "middle", letterSpacing: 1.5 }} x="54" y="43">SINGAPORE • EST. 2014</Text>
      <Line x1="24" y1="50" x2="84" y2="50" stroke={C.borderD} strokeWidth="0.7" />
      <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", fill: C.navy, textAnchor: "middle" }} x="54" y="63">{date}</Text>
      <Line x1="24" y1="68" x2="84" y2="68" stroke={C.borderD} strokeWidth="0.7" />
      <Text style={{ fontSize: 6, fill: C.muted, textAnchor: "middle" }} x="54" y="79">AUTHENTICATED</Text>
      <Text style={{ fontSize: 5.5, fill: C.light, textAnchor: "middle" }} x="54" y="89">bankofasia.com</Text>
      {/* Bottom star */}
      <Path d="M 54 94 L 55.2 97.5 L 58.9 97.5 L 56 99.8 L 57 103 L 54 101 L 51 103 L 52 99.8 L 49.1 97.5 L 52.8 97.5 Z"
        fill={C.gold} />
    </Svg>
  );
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
            <Text style={S.bankAddress}>
              {"One Financial Plaza, Asia Pacific Tower  •  Level 42\n"}
              {"Singapore 048583  •  Republic of Singapore\n"}
              {"SWIFT/BIC: BKASSGSG  •  T: +65 6800 0000  •  bankofasia.com"}
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
            {data.address && <Text style={S.infoSub}>{data.address}</Text>}
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

        {/* Signature + stamp section */}
        <View style={S.signatureSection}>
          {/* Sig 1 */}
          <View style={S.sigBlock}>
            <SigDrWei />
            <View style={S.sigLine} />
            <Text style={S.sigName}>Dr. James Wei</Text>
            <Text style={S.sigTitle}>Chief Operations Officer</Text>
            <Text style={S.sigLicence}>Bank of Asia Online Operations Division  •  Lic: MAS-BOA-001</Text>
          </View>

          {/* Sig 2 */}
          <View style={S.sigBlock}>
            <SigMsChen />
            <View style={S.sigLine} />
            <Text style={S.sigName}>Ms. Sarah Chen, LLB</Text>
            <Text style={S.sigTitle}>Head of Compliance & Regulatory Affairs</Text>
            <Text style={S.sigLicence}>Bank of Asia Online Legal Division  •  Lic: MAS-BOA-002</Text>
          </View>

          {/* Stamp */}
          <View style={S.stampBlock}>
            <OfficialStamp date={generated} />
          </View>
        </View>

        {/* Legal notice */}
        <View style={S.legalNotice}>
          <Text style={S.legalText}>
            {"This statement is issued by Bank of Asia Online, regulated by the Monetary Authority of Singapore (MAS) under the Banking Act (Cap. 19).\n"}
            {"The information contained herein is accurate as of the statement date. Discrepancies must be reported within 30 days of this statement date.\n"}
            {"CONFIDENTIAL — This document is intended solely for the named account holder. Unauthorised disclosure, copying or distribution is strictly prohibited."}
          </Text>
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
          <View style={S.footerBot}>
            <Text style={S.footerBotText}>
              © {new Date().getFullYear()} Bank of Asia Online  •  One Financial Plaza, Singapore 048583  •  SWIFT: BKASSGSG  •  Regulated by MAS
            </Text>
            <Text style={S.footerBotText}>bankofasia.com  •  +65 6800 0000</Text>
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
