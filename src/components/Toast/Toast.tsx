interface ToastProps {
  visible: boolean;
  message: string;
  onUndo?: () => void;
  onClose: () => void;
}

export function Toast({ visible, message, onUndo, onClose }: ToastProps) {
  return (
    <div className={`toast ${visible ? 'visible' : ''}`}>
      <span className="text-sm flex-1">{message}</span>
      <div className="flex gap-2 flex-shrink-0">
        {onUndo && (
          <button 
            onClick={onUndo} 
            className="text-[var(--color-accent)] font-medium text-sm hover:underline px-2 py-1"
          >
            Undo
          </button>
        )}
        <button 
          onClick={onClose}
          className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] text-sm px-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
