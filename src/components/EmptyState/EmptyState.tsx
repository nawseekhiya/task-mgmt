export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="w-16 h-16 flex items-center justify-center bg-[var(--muted)] rounded-2xl mb-4">
        <svg className="w-8 h-8 text-[var(--muted-foreground)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No tasks yet</h3>
      <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
        Add your first task above to get started with your productivity journey.
      </p>
    </div>
  );
}
