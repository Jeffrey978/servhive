"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/client/modal";
import { cn } from "@/lib/utils";

type Photo = { id: string; url: string; caption: string; area: string | null };

/** Asymmetric work-photo grid with a simple lightbox. */
export function WorkGallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const current = index != null ? photos[index] : null;
  const go = (d: number) =>
    setIndex((i) => (i == null ? i : (i + d + photos.length) % photos.length));
  const isOpen = index != null;

  useEffect(() => {
    if (!isOpen || photos.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setIndex((i) => (i == null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft")
        setIndex((i) =>
          i == null ? i : (i - 1 + photos.length) % photos.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, photos.length]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((p, i) => (
          <li
            key={p.id}
            className={cn(i % 5 === 0 && "col-span-2 md:row-span-2")}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-card bg-surface-2"
              aria-label={`Open photo: ${p.caption}`}
            >
              <Image
                src={p.url}
                alt={p.caption}
                fill
                sizes={
                  i % 5 === 0
                    ? "(min-width:768px) 40vw, 90vw"
                    : "(min-width:768px) 20vw, 45vw"
                }
                className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]"
              />
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={current != null}
        onClose={() => setIndex(null)}
        title={current?.caption ?? ""}
        description={current?.area ?? undefined}
        className="sm:max-w-3xl"
      >
        {current ? (
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2">
              <Image
                src={current.url}
                alt={current.caption}
                fill
                sizes="(min-width:640px) 48rem, 100vw"
                className="object-contain"
              />
            </div>
            {photos.length > 1 ? (
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="flex size-11 items-center justify-center rounded-full border border-border-strong hover:border-fg"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <span className="eyebrow">
                  {(index ?? 0) + 1} / {photos.length}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="flex size-11 items-center justify-center rounded-full border border-border-strong hover:border-fg"
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
