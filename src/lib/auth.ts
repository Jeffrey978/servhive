import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import type { Role, User } from "@/generated/prisma/client";

/**
 * Role is owned by OUR database, never by Clerk unsafeMetadata or localStorage
 * (the legacy app let any browser rewrite its own role). Admins are granted
 * by email via ADMIN_EMAILS.
 */
function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Returns the signed-in DB user, creating the row on first sight. Null if signed out. */
export const getSessionUser = cache(async (): Promise<User | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  const cu = await currentUser();
  if (!cu) return null;
  const email = cu.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;
  const name =
    cu.fullName ||
    [cu.firstName, cu.lastName].filter(Boolean).join(" ") ||
    cu.username ||
    email?.split("@")[0] ||
    "Servhive member";
  const isAdmin = !!email && adminEmails().includes(email);

  return db.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email,
      phone: cu.primaryPhoneNumber?.phoneNumber ?? null,
      name,
      avatarUrl: cu.imageUrl ?? null,
      role: isAdmin ? "ADMIN" : "CLIENT",
      onboarded: isAdmin,
    },
  });
});

/** Require a signed-in, onboarded user. Redirects otherwise. */
export async function requireUser(returnTo?: string): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect(`/sign-in${returnTo ? `?redirect_url=${encodeURIComponent(returnTo)}` : ""}`);
  if (!user.onboarded) redirect("/onboarding");
  return user;
}

/** Require one of the given roles; sends everyone else to their own home. */
export async function requireRole(roles: Role | Role[], returnTo?: string): Promise<User> {
  const user = await requireUser(returnTo);
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) redirect(homeFor(user.role));
  return user;
}

export function homeFor(role: Role) {
  if (role === "ARTISAN") return "/pro";
  if (role === "ADMIN") return "/admin";
  return "/account";
}

/** For server actions: throw instead of redirect so the caller gets an error result. */
export async function assertRole(roles: Role | Role[]): Promise<User> {
  const user = await getSessionUser();
  if (!user || !user.onboarded) throw new AuthError("You need to sign in first.");
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) throw new AuthError("You don't have access to do that.");
  return user;
}

export class AuthError extends Error {}
