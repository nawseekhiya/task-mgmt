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
    <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input flex-1"
        placeholder="What needs to be done?"
        disabled={isSubmitting}
      />
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={!title.trim() || isSubmitting}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="ml-2">Add Task</span>
      </button>
    </form>
  );
}
