export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card p-4 flex items-center gap-4">
          <div className="skeleton w-2 h-2 rounded-full" />
          <div className="skeleton h-4 flex-1 max-w-[60%]" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
