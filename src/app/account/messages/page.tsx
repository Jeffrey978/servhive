import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { listConversations } from "@/server/messaging";
import { timeAgo } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, EmptyState, PageHeader } from "@/components/ui/misc";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const user = await requireRole("CLIENT", "/account/messages");
  const conversations = await listConversations(user);

  return (
    <div>
      <PageHeader
        eyebrow="Messages"
        title="Inbox"
        description="Talk through the job before you book. Keep payments on Servhive."
      />
      {conversations.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          body="Tap Message on an artisan's profile to ask a question before you book."
          action={
            <Link
              href="/artisans"
              className={buttonVariants({ variant: "accent" })}
            >
              Find an artisan
            </Link>
          }
        />
      ) : (
        <ul className="border-t border-border-strong">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/account/messages/${c.id}`}
                className="flex items-center gap-4 border-b border-border py-4 transition-colors hover:bg-surface-2/60 sm:px-2"
              >
                <Avatar
                  name={c.counterpart.name}
                  src={c.counterpart.avatarUrl}
                  size={44}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-medium">{c.counterpart.name}</p>
                    <span className="shrink-0 text-xs text-muted">
                      {timeAgo(c.lastMessage?.createdAt ?? c.updatedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {c.lastMessage
                      ? `${c.lastMessage.mine ? "You: " : ""}${c.lastMessage.body}`
                      : "No messages yet"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
