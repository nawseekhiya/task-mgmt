import type { Task } from '../../types';

interface ToastProps {
  visible: boolean;
  message: string;
  onUndo?: () => void;
  onClose: () => void;
}

export function Toast({ visible, message, onUndo, onClose }: ToastProps) {
  return (
    <div className={`toast ${visible ? 'visible' : ''}`}>
      <span className="text-sm">{message}</span>
      <div className="flex gap-2">
        {onUndo && (
          <button 
            onClick={onUndo} 
            className="text-[var(--color-accent)] font-medium text-sm hover:underline"
          >
            Undo
          </button>
        )}
        <button 
          onClick={onClose}
          className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
