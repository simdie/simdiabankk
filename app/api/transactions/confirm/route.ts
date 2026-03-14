import { NextRequest, NextResponse } from "next/server";
import { confirmEmailTransaction } from "@/lib/transactions";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse(errorPage("Missing confirmation token."), {
      status: 400, headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const transaction = await confirmEmailTransaction(token);
    return new NextResponse(successPage(transaction.reference, Number(transaction.amount), transaction.currency), {
      status: 200, headers: { "Content-Type": "text/html" },
    });
  } catch (err: any) {
    return new NextResponse(errorPage(err.message || "Confirmation failed."), {
      status: 400, headers: { "Content-Type": "text/html" },
    });
  }
}

function successPage(reference: string, amount: number, currency: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Transfer Confirmed — Bank of Asia Online</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#03050a;font-family:'DM Sans',Arial,sans-serif;color:#f0f4ff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:linear-gradient(135deg,rgba(0,229,160,0.08),rgba(13,26,48,0.9));border:1px solid rgba(0,229,160,0.25);border-radius:20px;padding:48px 40px;max-width:480px;width:100%;text-align:center;box-shadow:0 0 60px rgba(0,229,160,0.08)}
  .icon{width:80px;height:80px;border-radius:50%;background:rgba(0,229,160,0.1);border:2px solid rgba(0,229,160,0.4);display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 24px}
  h1{font-size:26px;font-weight:700;margin-bottom:10px}
  .ref{font-family:monospace;font-size:13px;color:#00d4ff;background:rgba(0,212,255,0.08);padding:8px 16px;border-radius:8px;border:1px solid rgba(0,212,255,0.15);margin:16px 0;display:inline-block}
  .amount{font-size:32px;font-weight:800;color:#00e5a0;margin:12px 0}
  p{color:#8899b5;font-size:14px;line-height:1.6}
  a{display:inline-block;margin-top:28px;padding:12px 28px;background:linear-gradient(135deg,#00d4ff,#0088cc);color:#03050a;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px}
  </style></head><body>
  <div class="card">
    <div class="icon">✅</div>
    <h1>Transfer Confirmed!</h1>
    <div class="ref">${reference}</div>
    <div class="amount">${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${currency}</div>
    <p>Your transfer has been confirmed and is being processed. You will receive a notification once it completes.</p>
    <a href="/dashboard">Return to Dashboard</a>
  </div></body></html>`;
}

function errorPage(message: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Error — Bank of Asia Online</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#03050a;font-family:'DM Sans',Arial,sans-serif;color:#f0f4ff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:linear-gradient(135deg,rgba(255,59,92,0.08),rgba(13,26,48,0.9));border:1px solid rgba(255,59,92,0.25);border-radius:20px;padding:48px 40px;max-width:480px;width:100%;text-align:center}
  .icon{width:80px;height:80px;border-radius:50%;background:rgba(255,59,92,0.1);border:2px solid rgba(255,59,92,0.4);display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 24px}
  h1{font-size:24px;font-weight:700;margin-bottom:12px}
  .msg{font-family:monospace;font-size:13px;color:rgba(255,150,160,0.9);background:rgba(0,0,0,0.3);padding:12px 16px;border-radius:8px;margin:16px 0;text-align:left}
  a{display:inline-block;margin-top:24px;padding:12px 28px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#f0f4ff;border-radius:10px;text-decoration:none;font-size:14px}
  </style></head><body>
  <div class="card">
    <div class="icon">⚠️</div>
    <h1>Confirmation Failed</h1>
    <div class="msg">${message}</div>
    <a href="/dashboard">Return to Dashboard</a>
  </div></body></html>`;
}
