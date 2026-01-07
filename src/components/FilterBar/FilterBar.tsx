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

  const filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  const getCount = (filter: TaskFilter) => {
    if (filter === 'all') return counts.all;
    if (filter === 'pending') return counts.pending;
    return counts.completed;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" 
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
          className="input pl-10"
          placeholder="Search tasks..."
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-muted)] rounded-full">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => dispatch(setFilter(filter.value))}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentFilter === filter.value
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            {filter.label}
            <span className="ml-1.5 opacity-70">{getCount(filter.value)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
