import "server-only";
import { z } from "zod";
import { unstable_rethrow } from "next/navigation";
import { AuthError } from "@/lib/auth";
import { DomainError } from "@/server/escrow";

/**
 * Uniform server-action result. Pair with React's useActionState:
 *   const [state, formAction, pending] = useActionState(myAction, null)
 */
export type ActionResult<T = undefined> = { ok: true; data?: T; message?: string } | { ok: false; error: string };

/** Turn thrown AuthError/DomainError/ZodError into a user-facing { ok:false }. Re-throws Next redirects. */
export async function run<T>(fn: () => Promise<T>, message?: string): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data, message };
  } catch (e) {
    unstable_rethrow(e); // let redirect()/notFound() propagate
    if (e instanceof AuthError || e instanceof DomainError) return { ok: false, error: e.message };
    if (e instanceof z.ZodError) return { ok: false, error: e.issues[0]?.message ?? "Check the form and try again." };
    console.error(e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/** FormData → plain object of strings (multi-value keys become arrays). */
export function formToObject(fd: FormData) {
  const out: Record<string, string | string[]> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v !== "string") continue;
    const prev = out[k];
    out[k] = prev === undefined ? v : Array.isArray(prev) ? [...prev, v] : [prev, v];
  }
  return out;
}
