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
      <div className="flex items-center gap-2">
        {onUndo && (
          <button 
            onClick={onUndo} 
            className="text-sm font-medium text-[var(--accent)] hover:underline px-2 py-1"
          >
            Undo
          </button>
        )}
        <button 
          onClick={onClose} 
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
