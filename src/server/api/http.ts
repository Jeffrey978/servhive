import "server-only";
import { z } from "zod";
import { AuthError, getSessionUser } from "@/lib/auth";
import { DomainError } from "@/server/escrow";
import type { Role, User } from "@/generated/prisma/client";

/**
 * Plumbing for the mobile JSON API (/api/v1). The app signs in with Clerk's
 * Expo SDK and sends `Authorization: Bearer <session token>`; clerkMiddleware
 * (src/proxy.ts) verifies it, so getSessionUser() and every assertRole() in the
 * existing server actions work unchanged. Roles still come from OUR database.
 *
 * Rule for every endpoint: return an explicit field list. The website renders
 * on the server, so private columns (phones, user ids, bank numbers, billing
 * dates) never reached a browser; JSON goes straight to the phone, so nothing
 * is returned unless it is named.
 */

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type UserOpts = { roles?: Role[]; allowNotOnboarded?: boolean };

/** The signed-in DB user, or an HttpError (401 signed out, 403 not set up / wrong role). */
export async function apiUser(opts: UserOpts = {}): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw new HttpError(401, "Sign in first.");
  if (!user.onboarded && !opts.allowNotOnboarded) throw new HttpError(403, "Finish setting up your account first.");
  if (opts.roles && !opts.roles.includes(user.role)) throw new HttpError(403, "You don't have access to that.");
  return user;
}

const NO_STORE = { "Cache-Control": "private, no-store" };

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: NO_STORE });
}

export function errorResponse(e: unknown) {
  if (e instanceof HttpError) return json({ error: e.message }, e.status);
  if (e instanceof AuthError) return json({ error: e.message }, 403);
  if (e instanceof DomainError) return json({ error: e.message }, 400);
  if (e instanceof z.ZodError) return json({ error: e.issues[0]?.message ?? "Check the details and try again." }, 422);
  console.error("[api]", e);
  return json({ error: "Something went wrong. Please try again." }, 500);
}

/** Wrap a route handler: its return value becomes the JSON body; thrown errors map to statuses. */
export function handler<A extends unknown[]>(fn: (...args: A) => Promise<unknown>) {
  return async (...args: A): Promise<Response> => {
    try {
      return json((await fn(...args)) ?? { ok: true });
    } catch (e) {
      return errorResponse(e);
    }
  };
}

/** First value of a query-string key, trimmed. */
export function qp(url: URL, key: string, max = 120) {
  return (url.searchParams.get(key) ?? "").trim().slice(0, max);
}
