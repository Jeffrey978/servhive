"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useOptimistic, useRef, useTransition } from "react";
import { ArrowUp, ShieldAlert } from "lucide-react";
import { Avatar } from "@/components/ui/misc";
import { cn, formatDate } from "@/lib/utils";

export type ViewMessage = { id: string; body: string; mine: boolean; createdAt: string; flagged?: boolean };

/**
 * Chat thread UI shared by /account/messages and /pro/messages.
 * `send` is a server action bound by the page: (conversationId, body) => { ok } | { ok:false, error }.
 * Polls with router.refresh() every 8s while visible (no websockets yet).
 */
export function ConversationView({
  conversationId,
  counterpart,
  messages,
  send,
}: {
  conversationId: string;
  counterpart: { name: string; avatarUrl: string | null; href: string | null };
  messages: ViewMessage[];
  send: (conversationId: string, body: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [optimistic, addOptimistic] = useOptimistic(messages, (list: ViewMessage[], m: ViewMessage) => [...list, m]);
  const list = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [optimistic.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 8000);
    return () => window.clearInterval(id);
  }, [router]);

  function submit(fd: FormData) {
    const body = String(fd.get("body") ?? "").trim();
    if (!body) return;
    form.current?.reset();
    start(async () => {
      addOptimistic({ id: `tmp-${Date.now()}`, body, mine: true, createdAt: new Date().toISOString() });
      await send(conversationId, body);
      router.refresh();
    });
  }

  const name = counterpart.href ? (
    <Link href={counterpart.href} className="font-medium hover:underline">
      {counterpart.name}
    </Link>
  ) : (
    <span className="font-medium">{counterpart.name}</span>
  );

  return (
    <div className="flex h-[min(72dvh,46rem)] flex-col overflow-hidden rounded-card border border-border bg-surface">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Avatar name={counterpart.name} src={counterpart.avatarUrl} size={36} />
        <div className="min-w-0 flex-1">
          {name}
          <p className="text-xs text-muted">Keep payments on Servhive — escrow only protects jobs booked here.</p>
        </div>
      </div>

      <div ref={list} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto px-5 py-6">
        {optimistic.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">Say hello and describe what you need.</p>
        ) : (
          optimistic.map((m, i) => {
            const prev = optimistic[i - 1];
            const newDay = !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
            return (
              <div key={m.id}>
                {newDay ? <p className="eyebrow my-4 text-center">{formatDate(m.createdAt, { weekday: "short", day: "numeric", month: "short" })}</p> : null}
                <div className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed",
                      m.mine ? "rounded-br-md bg-fg text-bg" : "rounded-bl-md bg-surface-2 text-fg",
                      m.id.startsWith("tmp-") && "opacity-60",
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p className={cn("mt-1 text-[0.6875rem]", m.mine ? "text-bg/60" : "text-muted")}>
                      {formatDate(m.createdAt, { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                {m.flagged ? (
                  <p className={cn("mt-1.5 flex items-center gap-1.5 text-xs text-danger", m.mine ? "justify-end" : "justify-start")}>
                    <ShieldAlert className="size-3.5" /> Paying outside Servhive removes your escrow protection.
                  </p>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <form ref={form} action={submit} className="flex items-end gap-2 border-t border-border p-3">
        <textarea
          name="body"
          rows={1}
          required
          maxLength={2000}
          placeholder="Write a message…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              form.current?.requestSubmit();
            }
          }}
          className="max-h-40 min-h-11 flex-1 resize-none rounded-2xl border border-border bg-bg px-4 py-2.5 text-[0.9375rem] focus:border-fg focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Send"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-transform active:scale-95 disabled:opacity-50"
        >
          <ArrowUp className="size-5" />
        </button>
      </form>
    </div>
  );
}
