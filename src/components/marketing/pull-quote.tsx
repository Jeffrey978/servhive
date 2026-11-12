import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import type { FeaturedReview } from "./data";

/**
 * Big serif-italic pull quote. Uses a real five-star review when one exists;
 * otherwise falls back to a plain statement of the promise (never an invented testimonial).
 */
export function PullQuote({ review }: { review: FeaturedReview | null }) {
  return (
    <figure className="mx-auto max-w-5xl text-center">
      <p aria-hidden className="font-serif text-[clamp(5rem,12vw,9rem)] leading-[0.5] text-accent">
        &ldquo;
      </p>
      <SplitHeading
        as="blockquote"
        className="mt-6 font-serif text-[clamp(2rem,4.6vw,4.25rem)] italic leading-[1.05] tracking-[-0.02em]"
      >
        {review ? review.text : "Nobody in this city should have to pay for the same job twice."}
      </SplitHeading>
      <Reveal as="figcaption" delay={0.3} className="eyebrow mt-10">
        {review ? (
          <>
            {review.authorName}
            {review.area ? ` · ${review.area}` : ""} · hired for {review.trade}
          </>
        ) : (
          "Why Servhive exists"
        )}
      </Reveal>
    </figure>
  );
}
