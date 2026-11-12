import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { DomainError } from "@/server/escrow";
import { getThread } from "@/server/messaging";
import { sendClientMessage } from "@/server/client-actions";
import { ConversationView } from "@/components/messaging/conversation-view";

export const metadata = { title: "Conversation" };

async function loadThread(...args: Parameters<typeof getThread>) {
  try {
    return await getThread(...args);
  } catch (e) {
    if (e instanceof DomainError) return null;
    throw e;
  }
}

export default async function ThreadPage({
  params,
}: PageProps<"/account/messages/[id]">) {
  const { id } = await params;
  const user = await requireRole("CLIENT", `/account/messages/${id}`);
  const thread = await loadThread(user, id);
  if (!thread || thread.side !== "client") notFound();

  return (
    <div>
      <Link
        href="/account/messages"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" /> Inbox
      </Link>
      <ConversationView
        conversationId={thread.id}
        counterpart={thread.counterpart}
        messages={thread.messages}
        send={sendClientMessage}
      />
    </div>
  );
}
