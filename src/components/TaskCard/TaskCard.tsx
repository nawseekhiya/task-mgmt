import type { Task } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { toggleTaskStatusThunk, deleteTaskThunk } from '../../features/tasks/tasksThunks';
import { deleteTask } from '../../features/tasks/tasksSlice';

interface TaskCardProps {
  task: Task;
  onDelete: (task: Task, index: number) => void;
  onEdit: (task: Task) => void;
  index: number;
}

export function TaskCard({ task, onDelete, onEdit, index }: TaskCardProps) {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleTaskStatusThunk({ id: task.id, currentStatus: task.status }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id)); // Optimistic
    dispatch(deleteTaskThunk(task.id)); // API
    onDelete(task, index);
  };

  return (
    <div 
      className="card p-4 flex items-center justify-between animate-slide-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          task.status === 'completed' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-accent)]'
        }`} />
        <span className={`truncate ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
          {task.title}
        </span>
        <span className={`badge badge-${task.status} flex-shrink-0`}>
          {task.status}
        </span>
      </div>
      <div className="flex gap-1 flex-shrink-0 ml-3">
        <button
          onClick={handleToggle}
          className="btn-icon"
          aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as complete'}
        >
          {task.status === 'completed' ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="btn-icon"
          aria-label="Edit task"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="btn-icon destructive"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
