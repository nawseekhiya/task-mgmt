import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { selectThemeMode, toggleTheme } from './features/theme/themeSlice';
import { 
  selectFilteredTasks, 
  selectTaskCounts, 
  selectFilter,
  setFilter,
  addTask,
  toggleTaskStatus,
  deleteTask,
} from './features/tasks/tasksSlice';
import type { Task, TaskFilter } from './types';

function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const counts = useAppSelector(selectTaskCounts);
  const currentFilter = useAppSelector(selectFilter);

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  // Test: Add sample task
  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: `New Task ${counts.all + 1}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addTask(newTask));
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

        {/* Add Task Button */}
        <button onClick={handleAddTask} className="btn btn-primary mb-6">
          + Add Task
        </button>

        {/* Task List */}
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
                    onClick={() => dispatch(toggleTaskStatus(task.id))}
                    className="btn-icon"
                    aria-label={task.status === 'completed' ? 'Mark pending' : 'Mark complete'}
                  >
                    {task.status === 'completed' ? '↩️' : '✓'}
                  </button>
                  <button
                    onClick={() => dispatch(deleteTask(task.id))}
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

        {/* Stats */}
        <div className="mt-8 text-sm text-[var(--color-muted-foreground)]">
          Total: {counts.all} | Pending: {counts.pending} | Completed: {counts.completed}
        </div>
      </div>
    </div>
  );
}

export default App;
