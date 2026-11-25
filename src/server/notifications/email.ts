import "server-only";
import { Resend } from "resend";

/**
 * Email sending via Resend, behind a tiny interface so SMS (or another provider)
 * can slot in later without touching callers. Email-only for now (A.6/A.8).
 *
 * Env:
 *   RESEND_API_KEY  — Resend API key (required to actually send)
 *   EMAIL_FROM      — "Servhive <onboarding@resend.dev>" until a domain is verified
 *
 * While no domain is verified, Resend only delivers FROM onboarding@resend.dev and
 * only TO the account owner's address. Sending is therefore best-effort: a failure
 * is logged and swallowed so a reminder sweep never crashes on one bad address.
 */

export type EmailMessage = {
  to: string;
  subject: string;
  /** Plain-text body. We keep emails text-first for deliverability and simplicity. */
  text: string;
  html?: string;
};

export type SendResult = { ok: true; id?: string } | { ok: false; error: string; skipped?: boolean };

let client: Resend | null = null;
function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client ??= new Resend(key);
  return client;
}

export function emailFrom() {
  return process.env.EMAIL_FROM || "Servhive <onboarding@resend.dev>";
}

/** True when email can actually be sent (key present). Lets callers no-op cleanly in dev. */
export function emailEnabled() {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  const r = resend();
  if (!r) {
    console.warn("[email] RESEND_API_KEY not set — skipping:", msg.subject, "→", msg.to);
    return { ok: false, error: "Email is not configured.", skipped: true };
  }
  if (!msg.to || !msg.to.includes("@")) {
    return { ok: false, error: "No valid recipient address.", skipped: true };
  }
  try {
    const { data, error } = await r.emails.send({
      from: emailFrom(),
      to: msg.to,
      subject: msg.subject,
      text: msg.text,
      ...(msg.html ? { html: msg.html } : {}),
    });
    if (error) {
      console.error("[email] send failed:", error.message, "→", msg.to);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (e) {
    console.error("[email] send threw:", (e as Error).message, "→", msg.to);
    return { ok: false, error: (e as Error).message };
  }
}
