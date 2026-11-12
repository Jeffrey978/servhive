import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getThread } from "@/server/messaging";
import { DomainError } from "@/server/escrow";
import { loadPro } from "@/server/pro";
import { sendProMessage } from "@/server/pro-actions";
import { ConversationView } from "@/components/messaging/conversation-view";
import { NoProvider } from "@/components/pro/no-provider";

export default async function ProThreadPage({ params }: PageProps<"/pro/messages/[id]">) {
  const { id } = await params;
  const { user, provider } = await loadPro(`/pro/messages/${id}`);
  if (!provider) return <NoProvider />;

  let thread;
  try {
    thread = await getThread(user, id);
  } catch (e) {
    if (e instanceof DomainError) notFound();
    throw e;
  }
  if (thread.side !== "artisan") notFound();

  return (
    <>
      <Link href="/pro/messages" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Inbox
      </Link>
      <ConversationView conversationId={thread.id} counterpart={thread.counterpart} messages={thread.messages} send={sendProMessage} />
    </>
  );
}
