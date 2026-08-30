type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-stone-200/70 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton className="aspect-[4/5] w-full" />
      {/* Three bars, matching the real card's brand row, name and price - a
          taller skeleton would make the grid jump as products arrive. */}
      <div className="flex flex-col gap-1 pt-0.5">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          <div className="hidden sm:flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-20 w-16" />
            ))}
          </div>
          <Skeleton className="flex-1 aspect-[3/4]" />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-5 pt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
