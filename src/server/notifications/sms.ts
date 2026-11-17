import "server-only";

/**
 * SMS stub. Email-only for now (user's decision); this keeps the interface ready
 * so a Nigeria-focused provider (e.g. Termii) can slot in later without changing
 * callers. Today it just logs and reports "skipped".
 */

export type SmsMessage = { to: string; text: string };
export type SmsResult = { ok: true; id?: string } | { ok: false; error: string; skipped?: boolean };

export function smsEnabled() {
  return false; // flip on when an SMS provider is wired here
}

export async function sendSms(msg: SmsMessage): Promise<SmsResult> {
  console.info("[sms] (stub, not sent):", msg.to, "—", msg.text.slice(0, 60));
  return { ok: false, error: "SMS is not enabled yet.", skipped: true };
}
