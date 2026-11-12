import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  // Hexagon "hive" cell with an S-cut — single colour, inherits currentColor.
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <path d="M16 1.5 29 9v14L16 30.5 3 23V9z" fill="currentColor" />
      <path
        d="M20.5 11.2c-.9-1-2.4-1.7-4.4-1.7-2.7 0-4.6 1.4-4.6 3.5 0 4.4 8.9 2.7 8.9 6.3 0 1.4-1.5 2.4-3.8 2.4-2 0-3.6-.8-4.6-2"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 text-[1.0625rem] font-semibold tracking-[-0.03em]", className)}>
      <LogoMark />
      <span>Servhive</span>
    </Link>
  );
}
