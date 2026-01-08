import type { Task, TaskFilter } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';
import { EmptyState } from '../EmptyState/EmptyState';

interface TaskListProps {
  tasks: Task[];
  onDelete: (task: Task, index: number) => void;
  onEdit: (task: Task) => void;
  onToggleComplete?: (rect: DOMRect) => void;
  searchQuery?: string;
  filter?: TaskFilter;
}

export function TaskList({ tasks, onDelete, onEdit, onToggleComplete, searchQuery, filter }: TaskListProps) {
  if (tasks.length === 0) {
    // Priority: Search > Filter > Default empty
    
    // No search results
    if (searchQuery && searchQuery.trim()) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 flex items-center justify-center bg-[var(--muted)] rounded-2xl mb-4">
            <svg className="w-8 h-8 text-[var(--muted-foreground)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M8 8l6 6M14 8l-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No results found</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
            No tasks match "<span className="font-medium">{searchQuery}</span>". Try a different search term.
          </p>
        </div>
      );
    }
    
    // No tasks in filter view
    if (filter === 'pending') {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 flex items-center justify-center bg-[var(--warning-light)] rounded-2xl mb-4">
            <svg className="w-8 h-8 text-[var(--warning)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No pending tasks</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
            All caught up! You have no pending tasks. Add a new task or check your completed ones.
          </p>
        </div>
      );
    }
    
    if (filter === 'completed') {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 flex items-center justify-center bg-[var(--success-light)] rounded-2xl mb-4">
            <svg className="w-8 h-8 text-[var(--success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No completed tasks</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
            You haven't completed any tasks yet. Mark tasks as done to see them here.
          </p>
        </div>
      );
    }
    
    // Default: No tasks at all
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
