import Link from "next/link";
import { listConversations } from "@/server/messaging";
import { loadPro } from "@/server/pro";
import { Avatar, EmptyState, PageHeader } from "@/components/ui/misc";
import { NoProvider } from "@/components/pro/no-provider";
import { timeAgo } from "@/lib/utils";

export default async function ProMessagesPage() {
  const { user, provider } = await loadPro("/pro/messages");
  if (!provider) return <NoProvider />;

  const conversations = await listConversations(user);

  return (
    <>
      <PageHeader eyebrow="Messages" title="Inbox" description="Agree details here. Keep payment on Servhive so the job stays protected." />
      {conversations.length === 0 ? (
        <EmptyState title="No messages yet" body="When a client messages you from your profile, the thread appears here." />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link href={`/pro/messages/${c.id}`} className="flex items-center gap-4 py-4 transition-colors hover:bg-surface-2/50">
                <Avatar name={c.counterpart.name} src={c.counterpart.avatarUrl} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-medium">{c.counterpart.name}</p>
                    <span className="shrink-0 text-xs text-muted">{timeAgo(c.lastMessage?.createdAt ?? c.updatedAt)}</span>
                  </div>
                  <p className="truncate text-sm text-muted">
                    {c.lastMessage ? `${c.lastMessage.mine ? "You: " : ""}${c.lastMessage.body}` : "No messages yet"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
