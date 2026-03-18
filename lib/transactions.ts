import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { generateReference, generateToken } from "@/lib/utils";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface InternalTransferInput {
  senderAccountId: string;
  receiverAccountNumber: string;
  amount: number;
  description?: string;
  userId: string;
  ipAddress?: string;
}

export interface WireTransferInput {
  senderAccountId: string;
  amount: number;
  currency: string;
  description?: string;
  type: "LOCAL_WIRE" | "INTERNATIONAL_WIRE";
  externalDetails: Record<string, string>;
  userId: string;
  ipAddress?: string;
}

export interface AdminDepositInput {
  targetAccountId: string;
  amount: number;
  description?: string;
  adminUserId: string;
  ipAddress?: string;
}

const TX_OPTIONS = {
  maxWait: 10_000,
  timeout: 30_000,
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};

// ─────────────────────────────────────────────
// 1. INTERNAL TRANSFER
// ─────────────────────────────────────────────
export async function executeInternalTransfer(input: InternalTransferInput) {
  const { senderAccountId, receiverAccountNumber, amount, description, userId, ipAddress } = input;

  if (amount <= 0) throw new Error("Amount must be greater than zero");

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Lock sender account (SELECT FOR UPDATE)
    const [senderRow] = await tx.$queryRaw<Array<{ id: string; balance: string; status: string; currency: string; user_id: string }>>`
      SELECT id, balance, status, currency, "userId" as user_id
      FROM accounts WHERE id = ${senderAccountId} FOR UPDATE
    `;
    if (!senderRow) throw new Error("Sender account not found");
    if (senderRow.user_id !== userId) throw new Error("Account does not belong to you");
    if (senderRow.status !== "ACTIVE") throw new Error("Sender account is not active");

    const senderBalance = parseFloat(senderRow.balance);
    if (senderBalance < amount) throw new Error("Insufficient balance");

    // Lock receiver account
    const [receiverRow] = await tx.$queryRaw<Array<{ id: string; balance: string; status: string; currency: string }>>`
      SELECT id, balance, status, currency
      FROM accounts WHERE "accountNumber" = ${receiverAccountNumber} FOR UPDATE
    `;
    if (!receiverRow) throw new Error("Receiver account not found");
    if (receiverRow.id === senderAccountId) throw new Error("Cannot transfer to the same account");
    if (receiverRow.status !== "ACTIVE") throw new Error("Receiver account is not active");

    // Check SystemSettings
    const settings = await tx.systemSettings.findUnique({ where: { id: "singleton" } });
    const requiresEmailConfirm = settings?.requireEmailConfirmForTransfers ?? false;
    const requiresTransferToken = settings?.requireTokenForTransfers ?? false;

    const reference = generateReference();
    const emailConfirmToken = requiresEmailConfirm ? generateToken(32) : null;
    const status = requiresEmailConfirm ? "AWAITING_CONFIRMATION" : "COMPLETED";

    // Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        reference,
        type: "INTERNAL",
        senderAccountId,
        receiverAccountId: receiverRow.id,
        amount: new Prisma.Decimal(amount),
        currency: senderRow.currency as any,
        status: status as any,
        description: description || "Internal Transfer",
        requiresEmailConfirm,
        emailConfirmToken,
        requiresTransferToken,
      },
    });

    if (!requiresEmailConfirm) {
      // Debit sender
      await tx.$executeRaw`
        UPDATE accounts SET balance = balance - ${amount} WHERE id = ${senderAccountId}
      `;
      // Credit receiver
      await tx.$executeRaw`
        UPDATE accounts SET balance = balance + ${amount} WHERE id = ${receiverRow.id}
      `;
    }

    // Audit log
    await tx.auditLog.create({
      data: {
        userId,
        action: requiresEmailConfirm ? "TRANSFER_AWAITING_CONFIRMATION" : "TRANSFER_COMPLETED",
        target: receiverRow.id,
        details: { reference, amount, currency: senderRow.currency, requiresEmailConfirm },
        ipAddress: ipAddress || null,
      },
    });

    return { transaction, requiresEmailConfirm, emailConfirmToken };
  }, TX_OPTIONS);
}

// ─────────────────────────────────────────────
// 2. WIRE TRANSFER
// ─────────────────────────────────────────────
export async function executeWireTransfer(input: WireTransferInput) {
  const { senderAccountId, amount, currency, description, type, externalDetails, userId, ipAddress } = input;

  if (amount <= 0) throw new Error("Amount must be greater than zero");

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Lock sender account
    const [senderRow] = await tx.$queryRaw<Array<{ id: string; balance: string; status: string; user_id: string }>>`
      SELECT id, balance, status, "userId" as user_id
      FROM accounts WHERE id = ${senderAccountId} FOR UPDATE
    `;
    if (!senderRow) throw new Error("Sender account not found");
    if (senderRow.user_id !== userId) throw new Error("Account does not belong to you");
    if (senderRow.status !== "ACTIVE") throw new Error("Sender account is not active");

    const senderBalance = parseFloat(senderRow.balance);
    if (senderBalance < amount) throw new Error("Insufficient balance");

    const settings = await tx.systemSettings.findUnique({ where: { id: "singleton" } });
    const requiresEmailConfirm = settings?.requireEmailConfirmForTransfers ?? false;
    const requiresTransferToken = settings?.requireTokenForTransfers ?? false;

    const reference = generateReference();
    const emailConfirmToken = requiresEmailConfirm ? generateToken(32) : null;
    const status = requiresEmailConfirm ? "AWAITING_CONFIRMATION" : "PENDING";

    const transaction = await tx.transaction.create({
      data: {
        reference,
        type: type as any,
        senderAccountId,
        externalDetails,
        amount: new Prisma.Decimal(amount),
        currency: currency as any,
        status: status as any,
        description: description || `${type === "LOCAL_WIRE" ? "Local" : "International"} Wire Transfer`,
        requiresEmailConfirm,
        emailConfirmToken,
        requiresTransferToken,
      },
    });

    if (!requiresEmailConfirm) {
      // Debit sender immediately for wire (funds held while processing)
      await tx.$executeRaw`
        UPDATE accounts SET balance = balance - ${amount} WHERE id = ${senderAccountId}
      `;
    }

    await tx.auditLog.create({
      data: {
        userId,
        action: "WIRE_TRANSFER_INITIATED",
        target: senderAccountId,
        details: { reference, amount, currency, type, requiresEmailConfirm },
        ipAddress: ipAddress || null,
      },
    });

    return { transaction, requiresEmailConfirm, emailConfirmToken };
  }, TX_OPTIONS);
}

// ─────────────────────────────────────────────
// 3. ADMIN DEPOSIT
// ─────────────────────────────────────────────
export async function executeAdminDeposit(input: AdminDepositInput) {
  const { targetAccountId, amount, description, adminUserId, ipAddress } = input;

  if (amount <= 0) throw new Error("Amount must be greater than zero");

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Lock receiver account
    const [accountRow] = await tx.$queryRaw<Array<{ id: string; status: string; currency: string; balance: string }>>`
      SELECT id, status, currency, balance FROM accounts WHERE id = ${targetAccountId} FOR UPDATE
    `;
    if (!accountRow) throw new Error("Account not found");
    if (accountRow.status === "CLOSED") throw new Error("Cannot deposit to a closed account");

    const reference = generateReference();

    const transaction = await tx.transaction.create({
      data: {
        reference,
        type: "ADMIN_DEPOSIT",
        receiverAccountId: targetAccountId,
        amount: new Prisma.Decimal(amount),
        currency: accountRow.currency as any,
        status: "COMPLETED",
        description: description || "Administrative Deposit",
        requiresEmailConfirm: false,
        requiresTransferToken: false,
      },
    });

    await tx.$executeRaw`
      UPDATE accounts SET balance = balance + ${amount} WHERE id = ${targetAccountId}
    `;

    await tx.auditLog.create({
      data: {
        userId: adminUserId,
        action: "ADMIN_DEPOSIT",
        target: targetAccountId,
        details: { reference, amount, currency: accountRow.currency, description },
        ipAddress: ipAddress || null,
      },
    });

    return { transaction };
  }, TX_OPTIONS);
}

// ─────────────────────────────────────────────
// 4. ADMIN DEBIT
// ─────────────────────────────────────────────
export interface AdminDebitInput {
  targetAccountId: string;
  amount: number;
  description?: string;
  adminUserId: string;
  ipAddress?: string;
}

export async function executeAdminDebit(input: AdminDebitInput) {
  const { targetAccountId, amount, description, adminUserId, ipAddress } = input;

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const account = await tx.account.findUnique({
      where: { id: targetAccountId },
    });
    if (!account) throw new Error("Account not found");
    if (Number(account.balance) < amount) throw new Error("Insufficient account balance");

    const reference = generateReference();

    const [updatedAccount, transaction] = await Promise.all([
      tx.account.update({
        where: { id: targetAccountId },
        data: { balance: { decrement: amount } },
      }),
      tx.transaction.create({
        data: {
          reference,
          type: "ADMIN_DEBIT" as any,
          senderAccountId: targetAccountId,
          amount,
          currency: account.currency,
          status: "COMPLETED",
          description: description || "Administrative debit",
        },
      }),
    ]);

    await tx.auditLog.create({
      data: {
        userId: adminUserId,
        action: "ADMIN_DEBIT_ACCOUNT",
        target: targetAccountId,
        details: { amount, description, reference, previousBalance: Number(account.balance), newBalance: Number(updatedAccount.balance) },
        ipAddress: ipAddress || null,
      },
    });

    return { account: updatedAccount, transaction };
  }, TX_OPTIONS);
}

// ─────────────────────────────────────────────
// 5. CONFIRM EMAIL-GATED TRANSACTION
// ─────────────────────────────────────────────
export async function confirmEmailTransaction(token: string) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const transaction = await tx.transaction.findFirst({
      where: { emailConfirmToken: token, status: "AWAITING_CONFIRMATION" },
    });
    if (!transaction) throw new Error("Invalid or expired confirmation token");
    if (transaction.emailConfirmedAt) throw new Error("Transaction already confirmed");

    // Execute the actual debit/credit
    if (transaction.type === "INTERNAL") {
      await tx.$executeRaw`
        UPDATE accounts SET balance = balance - ${transaction.amount}
        WHERE id = ${transaction.senderAccountId}
      `;
      await tx.$executeRaw`
        UPDATE accounts SET balance = balance + ${transaction.amount}
        WHERE id = ${transaction.receiverAccountId}
      `;
    } else {
      // Wire — debit sender
      await tx.$executeRaw`
        UPDATE accounts SET balance = balance - ${transaction.amount}
        WHERE id = ${transaction.senderAccountId}
      `;
    }

    const updated = await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: transaction.type === "INTERNAL" ? "COMPLETED" : "PENDING",
        emailConfirmedAt: new Date(),
        emailConfirmToken: null,
      },
    });

    return updated;
  }, TX_OPTIONS);
}
