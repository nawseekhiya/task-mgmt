import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { 
  selectFilteredTasks, 
  selectTaskCounts, 
  selectTasksStatus,
  selectTasksError,
  restoreTask,
} from './features/tasks/tasksSlice';
import { fetchTasksThunk, updateTaskThunk } from './features/tasks/tasksThunks';
import { selectThemeMode } from './features/theme/themeSlice';
import type { Task } from './types';

import { 
  Header, 
  FilterBar, 
  TaskForm, 
  TaskList, 
  LoadingSkeleton, 
  ErrorState,
  Toast,
  EditModal,
} from './components';

function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const counts = useAppSelector(selectTaskCounts);
  const status = useAppSelector(selectTasksStatus);
  const error = useAppSelector(selectTasksError);
  
  const [deletedTaskInfo, setDeletedTaskInfo] = useState<{ task: Task; index: number } | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

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

  // Handle delete with undo capability
  const handleDelete = (task: Task, index: number) => {
    setDeletedTaskInfo({ task, index });
  };

  // Handle undo delete
  const handleUndo = () => {
    if (deletedTaskInfo) {
      dispatch(restoreTask(deletedTaskInfo));
      setDeletedTaskInfo(null);
    }
  };

  // Handle edit
  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  // Handle save edit
  const handleSaveEdit = (id: string, newTitle: string) => {
    dispatch(updateTaskThunk({ id, updates: { title: newTitle } }));
  };

  // Calculate completion percentage
  const completionPercent = counts.all > 0 
    ? Math.round((counts.completed / counts.all) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <Header completionPercent={completionPercent} />
        
        {/* Toolbar Section - Search & Filters */}
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
      </div>
    </div>
  );
}

export default App;
