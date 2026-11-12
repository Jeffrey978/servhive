import { Marquee } from "@/components/motion/marquee";
import { AREAS } from "@/lib/constants";

/** Slow ribbon of the neighbourhoods we cover, set between hairlines. */
export function AreaMarquee() {
  return (
    <div className="border-y border-border py-5 md:py-7">
      <p className="sr-only">Areas covered: {AREAS.join(", ")}</p>
      <Marquee seconds={60}>
        {AREAS.map((a) => (
          <span key={a} aria-hidden className="flex items-center whitespace-nowrap text-h3 font-medium">
            <span className="px-6 md:px-10">{a}</span>
            <span className="size-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
