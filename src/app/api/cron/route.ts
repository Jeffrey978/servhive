import type { NextRequest } from "next/server";
import { runReminderSweeps } from "@/server/reminders";

/**
 * Scheduled reminder + auto-release sweep (A.6, A.8). Triggered by Vercel Cron
 * (see vercel.json). Secured by CRON_SECRET: Vercel Cron sends it as a Bearer
 * token, so no human/browser can trigger it. Safe to run often — the sweep is
 * idempotent (SentReminder de-dups, auto-release is status-guarded).
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed if not configured
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

async function handle(request: NextRequest) {
  if (!authorized(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runReminderSweeps();
    return Response.json({ ok: true, ...result });
  } catch (e) {
    console.error("[cron] sweep failed:", (e as Error).message);
    return Response.json({ ok: false, error: "Sweep failed" }, { status: 500 });
  }
}

// Vercel Cron issues GET; POST is accepted too for manual/authorized triggers.
export async function GET(request: NextRequest) {
  return handle(request);
}
export async function POST(request: NextRequest) {
  return handle(request);
}
