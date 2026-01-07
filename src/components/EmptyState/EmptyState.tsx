export function EmptyState() {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-4 text-[var(--color-muted-foreground)] opacity-50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
      <p className="text-[var(--color-muted-foreground)] text-sm">
        Add your first task above to get started with your productivity journey.
      </p>
    </div>
  );
}
