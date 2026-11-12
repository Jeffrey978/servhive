import "server-only";
import { db } from "@/lib/db";
import { DomainError } from "@/server/escrow";
import type { User } from "@/generated/prisma/client";

/**
 * Client ↔ artisan messaging. A conversation is unique per (client, provider).
 * The artisan side acts through the Provider linked to their User.
 * Messages that look like attempts to move payment off-platform are flagged (not blocked)
 * so the UI can show the escrow-bypass warning the legacy chat had.
 */

const BYPASS = /\b(transfer|send (?:me )?(?:the )?money|account (?:no|number)|pay (?:me )?direct|outside (?:the )?app|whatsapp|0[789][01]\d{8})\b/i;

export function looksLikeBypass(body: string) {
  return BYPASS.test(body);
}

async function participant(user: User, conversationId: string) {
  const c = await db.conversation.findUnique({
    where: { id: conversationId },
    include: { provider: { select: { id: true, userId: true, businessName: true, slug: true, imageUrl: true } }, client: { select: { id: true, name: true, avatarUrl: true } } },
  });
  if (!c) throw new DomainError("Conversation not found.");
  const isClient = c.clientId === user.id;
  const isArtisan = !!c.provider.userId && c.provider.userId === user.id;
  if (!isClient && !isArtisan) throw new DomainError("Conversation not found.");
  return { c, side: isClient ? ("client" as const) : ("artisan" as const) };
}

/** Client opens (or reuses) a thread with an artisan. */
export async function startConversation(client: User, providerId: string) {
  const provider = await db.provider.findUnique({ where: { id: providerId }, select: { id: true, userId: true, status: true } });
  if (!provider || provider.status !== "APPROVED") throw new DomainError("This artisan isn't available.");
  if (provider.userId === client.id) throw new DomainError("You can't message yourself.");
  return db.conversation.upsert({
    where: { clientId_providerId: { clientId: client.id, providerId } },
    update: {},
    create: { clientId: client.id, providerId },
  });
}

export async function sendMessage(user: User, conversationId: string, body: string) {
  const text = body.trim();
  if (!text) throw new DomainError("Message can't be empty.");
  if (text.length > 2000) throw new DomainError("Message is too long.");
  await participant(user, conversationId);
  const [msg] = await db.$transaction([
    db.message.create({ data: { conversationId, senderId: user.id, body: text } }),
    db.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } }),
  ]);
  return { message: msg, flagged: looksLikeBypass(text) };
}

/** Inbox for either side. `counterpart` is who the user is talking to. */
export async function listConversations(user: User) {
  const provider = user.role === "ARTISAN" ? await db.provider.findUnique({ where: { userId: user.id }, select: { id: true } }) : null;
  const rows = await db.conversation.findMany({
    where: provider ? { providerId: provider.id } : { clientId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      provider: { select: { businessName: true, imageUrl: true, slug: true } },
      client: { select: { name: true, avatarUrl: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    updatedAt: r.updatedAt,
    counterpart: provider
      ? { name: r.client.name, avatarUrl: r.client.avatarUrl, href: null as string | null }
      : { name: r.provider.businessName, avatarUrl: r.provider.imageUrl, href: `/artisans/${r.provider.slug}` },
    lastMessage: r.messages[0] ? { body: r.messages[0].body, mine: r.messages[0].senderId === user.id, createdAt: r.messages[0].createdAt } : null,
  }));
}

/** Full thread, shaped for <ConversationView>. */
export async function getThread(user: User, conversationId: string) {
  const { c, side } = await participant(user, conversationId);
  const messages = await db.message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" }, take: 500 });
  return {
    id: c.id,
    side,
    counterpart:
      side === "client"
        ? { name: c.provider.businessName, avatarUrl: c.provider.imageUrl, href: `/artisans/${c.provider.slug}` }
        : { name: c.client.name, avatarUrl: c.client.avatarUrl, href: null },
    messages: messages.map((m) => ({
      id: m.id,
      body: m.body,
      mine: m.senderId === user.id,
      createdAt: m.createdAt.toISOString(),
      flagged: looksLikeBypass(m.body),
    })),
  };
}

export type Thread = Awaited<ReturnType<typeof getThread>>;
