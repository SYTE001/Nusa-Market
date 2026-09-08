/** Layout-matched skeletons: they follow the shape of the real content. */

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      <div className="aspect-[4/5] w-full animate-pulse bg-stone-100" />
      <div className="mt-2.5 flex flex-col gap-1.5">
        <div className="h-2.5 w-1/4 animate-pulse bg-stone-100" />
        <div className="h-3 w-3/4 animate-pulse bg-stone-100" />
        <div className="h-3 w-1/3 animate-pulse bg-stone-100" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="flex flex-col-reverse gap-4 sm:flex-row lg:col-span-7">
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 w-18 animate-pulse bg-stone-100" />
            ))}
          </div>
          <div className="aspect-[3/4] flex-1 animate-pulse bg-stone-100" />
        </div>
        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="h-3 w-1/3 animate-pulse bg-stone-100" />
          <div className="h-9 w-4/5 animate-pulse bg-stone-100" />
          <div className="h-7 w-1/3 animate-pulse bg-stone-100" />
          <div className="h-3 w-full animate-pulse bg-stone-100" />
          <div className="h-3 w-2/3 animate-pulse bg-stone-100" />
          <div className="mt-4 h-12 w-full animate-pulse bg-stone-100" />
        </div>
      </div>
    </div>
  );
}
