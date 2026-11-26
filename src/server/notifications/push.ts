import "server-only";
import { after } from "next/server";
import { db } from "@/lib/db";

/**
 * Push notifications to the mobile app through Expo's push service
 * (https://exp.host/--/api/v2/push/send). Best-effort, like the emails: a push
 * failure is logged and never breaks a booking, payment or message.
 *
 * `data.type` tells the app where a tap should go:
 *   message (conversationId), request, quote, job (client, id), pro-job (artisan, id),
 *   complaints, billing.
 *
 * Optional EXPO_ACCESS_TOKEN: only needed if "enhanced push security" is
 * switched on in the Expo dashboard.
 */

export type PushData = { type: string; id?: string; conversationId?: string };
export type PushMessage = { title: string; body: string; data: PushData; channel?: "default" | "messages" };

const ENDPOINT = "https://exp.host/--/api/v2/push/send";
const BATCH = 100; // Expo's limit per request

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** Send now (awaitable). Returns how many devices Expo accepted the message for. */
export async function sendPushNow(userIds: (string | null | undefined)[], msg: PushMessage): Promise<number> {
  const ids = [...new Set(userIds.filter((u): u is string => !!u))];
  if (!ids.length) return 0;
  try {
    const rows = await db.pushToken.findMany({ where: { userId: { in: ids } }, select: { token: true } });
    if (!rows.length) return 0;
    const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
    if (process.env.EXPO_ACCESS_TOKEN) headers.Authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;

    let accepted = 0;
    const dead: string[] = [];
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(
          batch.map((r) => ({
            to: r.token,
            title: clip(msg.title, 80),
            body: clip(msg.body, 180),
            data: msg.data,
            sound: "default",
            priority: "high",
            channelId: msg.channel ?? "default",
          })),
        ),
      });
      if (!res.ok) {
        console.error("[push] Expo push API", res.status, await res.text().catch(() => ""));
        continue;
      }
      const json = (await res.json().catch(() => null)) as { data?: { status: string; details?: { error?: string } }[] } | null;
      (json?.data ?? []).forEach((t, j) => {
        if (t.status === "ok") accepted++;
        else if (t.details?.error === "DeviceNotRegistered") dead.push(batch[j]!.token);
        else console.error("[push] ticket error", t.details?.error);
      });
    }
    // The app was uninstalled or notifications turned off at the OS level: stop sending there.
    if (dead.length) await db.pushToken.deleteMany({ where: { token: { in: dead } } });
    return accepted;
  } catch (e) {
    console.error("[push] send failed:", (e as Error).message);
    return 0;
  }
}

/**
 * Send after the current response has gone out (Next's after()), so pushes
 * never slow a request down. Falls back to fire-and-forget outside a request.
 */
export function notifyUsers(userIds: (string | null | undefined)[], msg: PushMessage) {
  const run = () => sendPushNow(userIds, msg).then(() => undefined);
  try {
    after(run);
  } catch {
    void run();
  }
}
