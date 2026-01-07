export function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl"
        >
          {/* Content skeleton */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-2 h-2 rounded-full skeleton-shimmer shrink-0" />
            <div className="h-5 flex-1 max-w-[60%] rounded skeleton-shimmer" />
            <div className="h-5 w-20 rounded-full skeleton-shimmer shrink-0" />
          </div>
          {/* Actions skeleton - visible on mobile, hidden on desktop until hover */}
          <div className="flex items-center gap-1 sm:hidden">
            <div className="flex-1 h-8 rounded-md skeleton-shimmer" />
            <div className="flex-1 h-8 rounded-md skeleton-shimmer" />
            <div className="flex-1 h-8 rounded-md skeleton-shimmer" />
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <div className="w-8 h-8 rounded-md skeleton-shimmer" />
            <div className="w-8 h-8 rounded-md skeleton-shimmer" />
            <div className="w-8 h-8 rounded-md skeleton-shimmer" />
          </div>
        </div>
      ))}
    </>
  );
}
