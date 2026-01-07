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

  useEffect(() => {
    if (task) {
      setTitle(task.title);
    }
  }, [task]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-200 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl transition-transform duration-200 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--foreground)]">Edit Task</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center text-[var(--muted-foreground)] rounded-md hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6">
            <label htmlFor="edit-title" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Task Title
            </label>
            <input
              ref={inputRef}
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-4 text-sm text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] rounded-lg outline-none transition-all duration-150 focus:border-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)]/10 placeholder:text-[var(--muted-foreground)]"
              placeholder="Enter task title"
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 pb-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="h-10 px-4 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors sm:w-auto w-full rounded-lg border border-[var(--border)] sm:border-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-4 text-sm font-medium text-white bg-[var(--foreground)] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full"
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
