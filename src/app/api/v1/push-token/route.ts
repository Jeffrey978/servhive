import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiUser, handler } from "@/server/api/http";

export const dynamic = "force-dynamic";

const Token = z
  .string()
  .trim()
  .max(200)
  .regex(/^Expo(nent)?PushToken\[[^\]]+\]$/, "Not an Expo push token.");

/**
 * Register this phone for push. A token belongs to whoever signed in on the
 * device last, so it is reassigned rather than duplicated.
 */
export const POST = handler(async (req: NextRequest) => {
  const user = await apiUser({ allowNotOnboarded: true });
  const body = z.object({ token: Token, platform: z.enum(["ios", "android"]) }).parse(await req.json().catch(() => ({})));
  await db.pushToken.upsert({
    where: { token: body.token },
    update: { userId: user.id, platform: body.platform },
    create: { token: body.token, platform: body.platform, userId: user.id },
  });
  return { ok: true };
});

/** Stop pushes to this phone (called on sign-out). Only the owner's own token is removed. */
export const DELETE = handler(async (req: NextRequest) => {
  const user = await apiUser({ allowNotOnboarded: true });
  const { token } = z.object({ token: Token }).parse(await req.json().catch(() => ({})));
  await db.pushToken.deleteMany({ where: { token, userId: user.id } });
  return { ok: true };
});
