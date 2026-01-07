import { useState, useEffect, useRef } from 'react';
import type { Task } from '../../types';

interface EditModalProps {
  isOpen: boolean;
  task: Task | null;
  onSave: (id: string, newTitle: string) => void;
  onClose: () => void;
}

export function EditModal({ isOpen, task, onSave, onClose }: EditModalProps) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Update title when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
    }
  }, [task]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task && title.trim()) {
      onSave(task.id, title.trim());
      onClose();
    }
  };

  if (!task) return null;

  return (
    <div 
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-title" className="block text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">
              Task Title
            </label>
            <input
              ref={inputRef}
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Enter task title"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim() || title.trim() === task.title}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
