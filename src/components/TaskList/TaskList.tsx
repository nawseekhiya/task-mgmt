import type { Task } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';
import { EmptyState } from '../EmptyState/EmptyState';

interface TaskListProps {
  tasks: Task[];
  onDelete: (task: Task, index: number) => void;
  onEdit: (task: Task) => void;
  onToggleComplete?: (rect: DOMRect) => void;
}

export function TaskList({ tasks, onDelete, onEdit, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
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
