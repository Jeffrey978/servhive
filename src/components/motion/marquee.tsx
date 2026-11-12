import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite CSS marquee. Children are rendered twice; keep them lightweight. Pauses on hover. */
export function Marquee({
  children,
  seconds = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  seconds?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="flex shrink-0 items-center group-hover:[animation-play-state:paused]"
          style={{
            animation: `marquee ${seconds}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
