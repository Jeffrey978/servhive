import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The Servhive mark: the "sh" monogram (green s, orange h) with the tick.
 * Full colour on any background, so it doesn't inherit currentColor. Source
 * artwork: public/brand/servhive-mark.png (transparent, 439x512).
 */
export function LogoMark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/servhive-mark.png"
      alt=""
      aria-hidden
      width={439}
      height={512}
      priority={priority}
      className={cn("size-7 object-contain", className)}
    />
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 text-[1.0625rem] font-semibold tracking-[-0.03em]", className)}>
      <LogoMark priority />
      <span>Servhive</span>
    </Link>
  );
}
