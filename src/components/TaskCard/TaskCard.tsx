import { useRef } from 'react';
import type { Task } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { toggleTaskStatusThunk, deleteTaskThunk } from '../../features/tasks/tasksThunks';
import { deleteTask } from '../../features/tasks/tasksSlice';

interface TaskCardProps {
  task: Task;
  onDelete: (task: Task, index: number) => void;
  onEdit: (task: Task) => void;
  onToggleComplete?: (rect: DOMRect) => void;
  index: number;
}

export function TaskCard({ task, onDelete, onEdit, onToggleComplete, index }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (task.status === 'pending' && onToggleComplete && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onToggleComplete(rect);
    }
    dispatch(toggleTaskStatusThunk({ id: task.id, currentStatus: task.status }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    dispatch(deleteTaskThunk(task.id));
    onDelete(task, index);
  };

  return (
    <div 
      ref={cardRef}
      className="task-animate flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/15 sm:hover:translate-x-1 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top row on mobile / Left side on desktop: Status dot + Title + Badge */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div 
          className={`w-2 h-2 rounded-full shrink-0 ${
            task.status === 'completed' ? 'bg-[var(--success)]' : 'bg-[var(--warning)]'
          }`} 
        />
        <span 
          className={`text-sm font-medium flex-1 ${
            task.status === 'completed' 
              ? 'line-through text-[var(--muted-foreground)]' 
              : 'text-[var(--foreground)]'
          }`}
        >
          {task.title}
        </span>
        <span 
          className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${
            task.status === 'completed' 
              ? 'text-emerald-600 bg-[var(--success-light)]' 
              : 'text-amber-600 bg-[var(--warning-light)]'
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* Bottom row on mobile / Right side on desktop: Action buttons */}
      <div className="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={handleToggle}
          className="flex-1 sm:flex-none sm:w-8 h-8 flex items-center justify-center gap-2 text-[var(--muted-foreground)] rounded-md transition-all duration-150 hover:text-[var(--foreground)] hover:bg-[var(--muted)] text-xs sm:text-base"
          aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as complete'}
        >
          {task.status === 'completed' ? (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span className="sm:hidden">Undo</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="sm:hidden">Done</span>
            </>
          )}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="flex-1 sm:flex-none sm:w-8 h-8 flex items-center justify-center gap-2 text-[var(--muted-foreground)] rounded-md transition-all duration-150 hover:text-[var(--foreground)] hover:bg-[var(--muted)] text-xs sm:text-base"
          aria-label="Edit task"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span className="sm:hidden">Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 sm:flex-none sm:w-8 h-8 flex items-center justify-center gap-2 text-[var(--muted-foreground)] rounded-md transition-all duration-150 hover:text-[var(--destructive)] hover:bg-[var(--destructive-light)] text-xs sm:text-base"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span className="sm:hidden">Delete</span>
        </button>
      </div>
    </div>
  );
}
