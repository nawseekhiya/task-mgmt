import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { selectThemeMode, toggleTheme } from './features/theme/themeSlice';
import { 
  selectFilteredTasks, 
  selectTaskCounts, 
  selectFilter,
  selectTasksStatus,
  selectTasksError,
  setFilter,
  deleteTask,
  restoreTask,
} from './features/tasks/tasksSlice';
import { 
  fetchTasksThunk, 
  addTaskThunk, 
  toggleTaskStatusThunk,
  deleteTaskThunk,
} from './features/tasks/tasksThunks';
import type { TaskFilter } from './types';
import { useState } from 'react';

function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const counts = useAppSelector(selectTaskCounts);
  const currentFilter = useAppSelector(selectFilter);
  const status = useAppSelector(selectTasksStatus);
  const error = useAppSelector(selectTasksError);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [deletedTaskInfo, setDeletedTaskInfo] = useState<{ task: any; index: number } | null>(null);

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchTasksThunk());
  }, [dispatch]);

  // Handle add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      dispatch(addTaskThunk(newTaskTitle.trim()));
      setNewTaskTitle('');
    }
  };

  // Handle delete with undo
  const handleDelete = (taskId: string) => {
    const taskIndex = filteredTasks.findIndex(t => t.id === taskId);
    const task = filteredTasks[taskIndex];
    if (task) {
      setDeletedTaskInfo({ task, index: taskIndex });
      dispatch(deleteTask(taskId)); // Optimistic delete
      dispatch(deleteTaskThunk(taskId)); // API call
      
      // Auto-hide after 5 seconds
      setTimeout(() => setDeletedTaskInfo(null), 5000);
    }
  };

  // Handle undo delete
  const handleUndo = () => {
    if (deletedTaskInfo) {
      dispatch(restoreTask(deletedTaskInfo));
      setDeletedTaskInfo(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] p-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Task Dashboard</h1>
            <p className="text-[var(--color-muted-foreground)]">
              Manage your daily tasks efficiently
            </p>
            {/* Progress bar */}
            <div className="progress-bar w-48 mt-3">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${counts.all > 0 ? (counts.completed / counts.all) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
              {counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0}% complete
            </p>
          </div>
          <button 
            onClick={() => dispatch(toggleTheme())}
            className="btn-icon"
            aria-label="Toggle theme"
          >
            {themeMode === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'completed'] as TaskFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => dispatch(setFilter(filter))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentFilter === filter
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}{' '}
              <span className="ml-1 opacity-70">
                {filter === 'all' ? counts.all : filter === 'pending' ? counts.pending : counts.completed}
              </span>
            </button>
          ))}
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="input flex-1"
            placeholder="What needs to be done?"
          />
          <button type="submit" className="btn btn-primary">
            + Add Task
          </button>
        </form>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="text-center py-12">
            <p className="text-[var(--color-destructive)] mb-4">{error}</p>
            <button onClick={() => dispatch(fetchTasksThunk())} className="btn btn-primary">
              Retry
            </button>
          </div>
        )}

        {/* Task List */}
        {status === 'succeeded' && (
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-muted-foreground)]">
                <p>No tasks yet. Add one above!</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`badge badge-${task.status}`}>{task.status}</span>
                    <span className={task.status === 'completed' ? 'line-through opacity-60' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => dispatch(toggleTaskStatusThunk({ id: task.id, currentStatus: task.status }))}
                      className="btn-icon"
                      aria-label={task.status === 'completed' ? 'Mark pending' : 'Mark complete'}
                    >
                      {task.status === 'completed' ? '↩️' : '✓'}
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn-icon destructive"
                      aria-label="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Toast for Undo */}
        {deletedTaskInfo && (
          <div className="toast visible">
            <span>Task deleted</span>
            <button onClick={handleUndo} className="text-[var(--color-accent)] font-medium">
              Undo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
