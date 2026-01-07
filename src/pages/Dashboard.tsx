import { useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  selectFilteredTasks, 
  selectTaskCounts, 
  selectTasksStatus,
  selectTasksError,
  selectSearchQuery,
  selectFilter,
  restoreTask,
} from '../features/tasks/tasksSlice';
import { fetchTasksThunk, updateTaskThunk } from '../features/tasks/tasksThunks';
import type { Task } from '../types';

import { 
  Header, 
  FilterBar, 
  TaskForm, 
  TaskList, 
  LoadingSkeleton, 
  ErrorState,
  Toast,
  EditModal,
  Confetti,
} from '../components';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const counts = useAppSelector(selectTaskCounts);
  const status = useAppSelector(selectTasksStatus);
  const error = useAppSelector(selectTasksError);
  const searchQuery = useAppSelector(selectSearchQuery);
  const currentFilter = useAppSelector(selectFilter);
  
  const [deletedTaskInfo, setDeletedTaskInfo] = useState<{ task: Task; index: number } | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [confettiRect, setConfettiRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    dispatch(fetchTasksThunk());
  }, [dispatch]);

  useEffect(() => {
    if (deletedTaskInfo) {
      const timeout = setTimeout(() => setDeletedTaskInfo(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [deletedTaskInfo]);

  const handleDelete = useCallback((task: Task, index: number) => {
    setDeletedTaskInfo({ task, index });
  }, []);

  const handleUndo = useCallback(() => {
    if (deletedTaskInfo) {
      dispatch(restoreTask(deletedTaskInfo));
      setDeletedTaskInfo(null);
    }
  }, [deletedTaskInfo, dispatch]);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleSaveEdit = useCallback((id: string, newTitle: string) => {
    dispatch(updateTaskThunk({ id, updates: { title: newTitle } }));
  }, [dispatch]);

  const handleToggleComplete = useCallback((rect: DOMRect) => {
    setConfettiRect(rect);
    setConfettiTrigger(true);
  }, []);

  const handleConfettiComplete = useCallback(() => {
    setConfettiTrigger(false);
  }, []);

  const completionPercent = counts.all > 0 
    ? Math.round((counts.completed / counts.all) * 100) 
    : 0;

  return (
    <div className="max-w-[42rem] mx-auto px-4 pt-10 pb-6 sm:pt-12 sm:pb-8">
      <Header completionPercent={completionPercent} />
      
      {/* Task Form comes before Filter Bar on mobile for better UX */}
      <TaskForm />
      <FilterBar counts={counts} />

      <div className="flex flex-col gap-2 sm:gap-2">
        {status === 'loading' && <LoadingSkeleton />}
        
        {status === 'failed' && error && (
          <ErrorState 
            message={error} 
            onRetry={() => dispatch(fetchTasksThunk())} 
          />
        )}
        
        {status === 'succeeded' && (
          <TaskList 
            tasks={filteredTasks} 
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleComplete={handleToggleComplete}
            searchQuery={searchQuery}
            filter={currentFilter}
          />
        )}
      </div>

      <Toast
        visible={!!deletedTaskInfo}
        message="Task deleted"
        onUndo={handleUndo}
        onClose={() => setDeletedTaskInfo(null)}
      />

      <EditModal
        isOpen={!!editingTask}
        task={editingTask}
        onSave={handleSaveEdit}
        onClose={() => setEditingTask(null)}
      />

      <Confetti
        trigger={confettiTrigger}
        cardRect={confettiRect || undefined}
        onComplete={handleConfettiComplete}
      />
    </div>
  );
}
