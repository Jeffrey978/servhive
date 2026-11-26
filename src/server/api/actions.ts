import "server-only";
import type { ActionResult } from "@/lib/action";
import { completeOnboardingCore } from "@/app/(auth)/onboarding/actions";
import {
  acceptQuoteCore,
  bookServiceCore,
  cancelQuoteAction,
  disputeJobAction,
  messageProviderCore,
  releaseJobAction,
  reportProviderAction,
  requestQuoteAction,
  sendClientMessage,
  submitReviewAction,
  toggleSavedAction,
} from "@/server/client-actions";
import {
  addWorkPhotoAction,
  buyBoostAction,
  declineQuoteAction,
  deleteServiceAction,
  deleteWorkPhotoAction,
  markJobCompleteAction,
  paySubscriptionAction,
  respondToReportAction,
  saveServiceAction,
  savePayoutAction,
  sendProMessage,
  sendQuoteAction,
  submitForReviewAction,
  updateProfileAction,
  updateProfilePhotoAction,
  uploadDocumentAction,
} from "@/server/pro-actions";

/**
 * Every mutation the mobile app may call, by name. Each entry is the SAME
 * server action the website uses (same zod validation, role check via
 * assertRole, provider scoping and cache revalidation) — the API only changes
 * how the form arrives. Admin actions are deliberately not listed.
 *
 *   POST /api/v1/actions/<name>   body: JSON object or multipart form
 *
 * Field names match the website's forms. Images are data URLs
 * (data:image/jpeg;base64,...), downscaled on the phone first: Vercel limits a
 * request body to ~4.5MB.
 */

type Run = (fd: FormData) => Promise<ActionResult<unknown>>;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "");

export const ACTIONS: Record<string, { run: Run; allowNotOnboarded?: boolean }> = {
  // Onboarding (signed in, not yet set up)
  "onboarding.complete": { run: completeOnboardingCore, allowNotOnboarded: true },

  // Client
  "client.requestQuote": { run: (fd) => requestQuoteAction(null, fd) },
  "client.bookService": { run: bookServiceCore },
  "client.report": { run: (fd) => reportProviderAction(null, fd) },
  "client.toggleSaved": { run: (fd) => toggleSavedAction(str(fd, "providerId")) },
  "client.startConversation": { run: messageProviderCore },
  "client.acceptQuote": { run: acceptQuoteCore },
  "client.cancelQuote": { run: (fd) => cancelQuoteAction(null, fd) },
  "client.releaseJob": { run: (fd) => releaseJobAction(null, fd) },
  "client.disputeJob": { run: (fd) => disputeJobAction(null, fd) },
  "client.submitReview": { run: (fd) => submitReviewAction(null, fd) },
  "client.sendMessage": { run: (fd) => sendClientMessage(str(fd, "conversationId"), str(fd, "body")) },

  // Artisan
  "pro.sendQuote": { run: (fd) => sendQuoteAction(null, fd) },
  "pro.declineQuote": { run: (fd) => declineQuoteAction(null, fd) },
  "pro.markJobComplete": { run: (fd) => markJobCompleteAction(null, fd) },
  "pro.respondToReport": { run: (fd) => respondToReportAction(null, fd) },
  "pro.updateProfile": { run: (fd) => updateProfileAction(null, fd) },
  "pro.updatePhoto": { run: (fd) => updateProfilePhotoAction(null, fd) },
  "pro.saveService": { run: (fd) => saveServiceAction(null, fd) },
  "pro.deleteService": { run: (fd) => deleteServiceAction(null, fd) },
  "pro.addWorkPhoto": { run: (fd) => addWorkPhotoAction(null, fd) },
  "pro.deleteWorkPhoto": { run: (fd) => deleteWorkPhotoAction(null, fd) },
  "pro.uploadDocument": { run: (fd) => uploadDocumentAction(null, fd) },
  "pro.submitForReview": { run: (fd) => submitForReviewAction(null, fd) },
  "pro.savePayout": { run: (fd) => savePayoutAction(null, fd) },
  "pro.paySubscription": { run: (fd) => paySubscriptionAction(null, fd) },
  "pro.buyBoost": { run: (fd) => buyBoostAction(null, fd) },
  "pro.sendMessage": { run: (fd) => sendProMessage(str(fd, "conversationId"), str(fd, "body")) },
};

/** JSON body -> FormData, so the existing form-based actions accept it. Arrays become repeated keys. */
export function toFormData(body: unknown): FormData {
  const fd = new FormData();
  if (!body || typeof body !== "object" || Array.isArray(body)) return fd;
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (v === undefined || v === null) continue;
    for (const item of Array.isArray(v) ? v : [v]) {
      if (item === undefined || item === null) continue;
      fd.append(k, typeof item === "string" ? item : typeof item === "object" ? JSON.stringify(item) : String(item));
    }
  }
  return fd;
}
