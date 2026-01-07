interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="w-16 h-16 flex items-center justify-center bg-[var(--destructive-light)] rounded-2xl mb-4">
        <svg className="w-8 h-8 text-[var(--destructive)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Failed to load tasks</h3>
      <p className="text-sm text-[var(--muted-foreground)] mb-4">{message}</p>
      <button 
        onClick={onRetry} 
        className="h-10 px-4 text-sm font-medium text-white bg-[var(--foreground)] rounded-lg hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}
