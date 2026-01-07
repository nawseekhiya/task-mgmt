import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addTaskThunk } from '../../features/tasks/tasksThunks';

export function TaskForm() {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dispatch(addTaskThunk(title.trim())).unwrap();
      setTitle('');
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col sm:flex-row gap-3 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl mb-6"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 py-3 px-4 text-sm text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] rounded-lg outline-none transition-all duration-150 focus:border-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)]/10 placeholder:text-[var(--muted-foreground)]"
        placeholder="What needs to be done?"
        disabled={isSubmitting}
      />
      <button 
        type="submit" 
        className="flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-black bg-[var(--accent)] rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        disabled={!title.trim() || isSubmitting}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Add Task</span>
      </button>
    </form>
  );
}
