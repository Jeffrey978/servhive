import { ArrowRight, Search } from "lucide-react";

/** Plain GET form → /artisans?q=…&category=… (works without JS). */
export function HeroSearch({ categories }: { categories: { id: string; name: string }[] }) {
  return (
    <form
      action="/artisans"
      method="get"
      role="search"
      className="flex w-full max-w-3xl flex-col gap-1.5 rounded-[1.75rem] bg-surface p-1.5 text-fg md:flex-row md:items-center md:rounded-full"
    >
      <label className="flex h-12 flex-1 items-center gap-3 rounded-full px-4 md:h-14 md:px-5">
        <Search className="size-[18px] shrink-0 text-muted" aria-hidden />
        <span className="sr-only">What do you need done?</span>
        <input
          name="q"
          type="search"
          placeholder="Generator repair, braids, POP ceiling…"
          className="h-full w-full min-w-0 bg-transparent text-[0.9375rem] placeholder:text-muted focus:outline-none"
        />
      </label>
      <span aria-hidden className="hidden h-7 w-px bg-border md:block" />
      <div className="relative flex h-12 items-center border-t border-border md:h-14 md:w-56 md:border-0">
        <label htmlFor="hero-category" className="sr-only">
          Trade
        </label>
        <select
          id="hero-category"
          name="category"
          defaultValue=""
          className="h-full w-full appearance-none bg-transparent pl-4 pr-10 text-[0.9375rem] focus:outline-none md:pl-5"
        >
          <option value="">All trades</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="pointer-events-none absolute right-4 size-3.5 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </div>
      <button
        type="submit"
        className="group/btn inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[0.9375rem] font-medium text-accent-fg transition-[filter,transform] duration-300 ease-out-expo hover:brightness-105 active:scale-[0.97] md:h-14 md:px-7"
      >
        Find artisans
        <ArrowRight className="size-4 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0.5" />
      </button>
    </form>
  );
}
