export function ThreadListItemSkeleton() {
  return (
    <article className="relative w-full py-3">
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--od-divider-strong)_50%,transparent),transparent)]" />

      <div className="flex items-start gap-3 md:gap-5">
        <div className="w-16 shrink-0 md:w-54 lg:w-58">
          <div className="h-20 animate-shimmer rounded-xl bg-linear-to-r from-(--od-bg-tertiary) via-(--od-border-strong) to-(--od-bg-tertiary) bg-size-[200%_100%] md:h-43 md:rounded-2xl" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded-full bg-(--od-bg-tertiary) md:h-7 md:w-7" />
            <div className="h-3 w-20 animate-shimmer rounded bg-linear-to-r from-(--od-bg-tertiary) via-(--od-border-strong) to-(--od-bg-tertiary) bg-size-[200%_100%]" />
            <div className="h-3 w-12 animate-pulse rounded bg-(--od-bg-tertiary)" />
          </div>

          <div className="mb-2 space-y-1.5 md:mb-3 md:space-y-2">
            <div className="h-4 w-4/5 animate-shimmer rounded bg-linear-to-r from-(--od-bg-tertiary) via-(--od-border-strong) to-(--od-bg-tertiary) bg-size-[200%_100%] md:h-5" />
            <div className="h-4 w-3/5 animate-shimmer rounded bg-linear-to-r from-(--od-bg-tertiary) via-(--od-border-strong) to-(--od-bg-tertiary) bg-size-[200%_100%] md:h-5" />
          </div>

          <div className="hidden space-y-2 md:block md:mb-3">
            <div className="h-3.5 w-full animate-shimmer rounded bg-linear-to-r from-(--od-bg-tertiary) via-(--od-border-strong) to-(--od-bg-tertiary) bg-size-[200%_100%]" />
            <div className="h-3.5 w-11/12 animate-shimmer rounded bg-linear-to-r from-(--od-bg-tertiary) via-(--od-border-strong) to-(--od-bg-tertiary) bg-size-[200%_100%]" />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex flex-wrap gap-2">
              <div className="h-3 w-10 animate-pulse rounded bg-(--od-bg-tertiary)" />
              <div className="h-3 w-12 animate-pulse rounded bg-(--od-bg-tertiary)" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-8 animate-pulse rounded bg-(--od-bg-tertiary)" />
              <div className="h-3 w-8 animate-pulse rounded bg-(--od-bg-tertiary)" />
              <div className="h-3 w-8 animate-pulse rounded bg-(--od-bg-tertiary)" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
