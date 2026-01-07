import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectFilter, selectSearchQuery, setFilter, setSearchQuery } from '../../features/tasks/tasksSlice';
import type { TaskFilter } from '../../types';

interface FilterBarProps {
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export function FilterBar({ counts }: FilterBarProps) {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector(selectFilter);
  const searchQuery = useAppSelector(selectSearchQuery);

  const filters: { value: TaskFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'pending', label: 'Pending', count: counts.pending },
    { value: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 max-w-64">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-full h-10 pl-10 pr-4 text-sm text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] rounded-lg outline-none transition-all duration-150 focus:border-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)]/10 placeholder:text-[var(--muted-foreground)]"
          placeholder="Search tasks..."
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-[var(--muted)] rounded-lg">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => dispatch(setFilter(filter.value))}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-150 ${
              currentFilter === filter.value 
                ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm border-l-2 border-[var(--accent)]' 
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {filter.label}
            <span className="text-xs font-mono opacity-60 px-1.5 py-0.5 bg-[var(--muted)] rounded">
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
