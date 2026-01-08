interface ToastProps {
  visible: boolean;
  message: string;
  onUndo?: () => void;
  onClose: () => void;
}

export function Toast({ visible, message, onUndo, onClose }: ToastProps) {
  return (
    <div 
      className={`fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-sm flex items-center justify-between gap-4 px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg z-50 transition-all duration-300 ${
        visible 
          ? 'opacity-100 translate-y-0 visible' 
          : 'opacity-0 translate-y-24 invisible'
      }`}
    >
      <span className="text-sm text-[var(--foreground)]">{message}</span>
      <div className="flex items-center gap-3">
        {onUndo && (
          <button 
            onClick={onUndo} 
            className="text-xs font-semibold text-[var(--accent)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 px-3 py-1.5 rounded-md transition-colors"
          >
            Undo
          </button>
        )}
        <button 
          onClick={onClose} 
          className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
