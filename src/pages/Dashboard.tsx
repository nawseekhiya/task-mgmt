import { useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  selectFilteredTasks, 
  selectTaskCounts, 
  selectTasksStatus,
  selectTasksError,
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
  
  // Delete/undo state
  const [deletedTaskInfo, setDeletedTaskInfo] = useState<{ task: Task; index: number } | null>(null);
  
  // Edit modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Confetti state
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0, y: 0 });

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchTasksThunk());
  }, [dispatch]);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (deletedTaskInfo) {
      const timeout = setTimeout(() => setDeletedTaskInfo(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [deletedTaskInfo]);

  // Handlers
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
    setConfettiOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setConfettiTrigger(true);
  }, []);

  const handleConfettiComplete = useCallback(() => {
    setConfettiTrigger(false);
  }, []);

  // Computed values
  const completionPercent = counts.all > 0 
    ? Math.round((counts.completed / counts.all) * 100) 
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header Section */}
      <Header completionPercent={completionPercent} />
      
      {/* Toolbar Section */}
      <section className="mb-8">
        <FilterBar counts={counts} />
      </section>
      
      {/* Add Task Section */}
      <section className="mb-8">
        <TaskForm />
      </section>

      {/* Task List Section */}
      <section>
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
          />
        )}
      </section>

      {/* Toast notification */}
      <Toast
        visible={!!deletedTaskInfo}
        message="Task deleted"
        onUndo={handleUndo}
        onClose={() => setDeletedTaskInfo(null)}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editingTask}
        task={editingTask}
        onSave={handleSaveEdit}
        onClose={() => setEditingTask(null)}
      />

      {/* Confetti celebration */}
      <Confetti
        trigger={confettiTrigger}
        originX={confettiOrigin.x}
        originY={confettiOrigin.y}
        onComplete={handleConfettiComplete}
      />
    </div>
  );
}
