interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-4 text-[var(--color-destructive)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Failed to load tasks</h3>
      <p className="text-[var(--color-muted-foreground)] text-sm mb-4">
        {message}
      </p>
      <button onClick={onRetry} className="btn btn-primary">
        Try Again
      </button>
    </div>
  );
}
