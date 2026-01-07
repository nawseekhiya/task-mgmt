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
    <div className="flex items-center gap-6 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
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
          className="input pl-11 w-full"
          placeholder="Search tasks..."
        />
      </div>

      {/* Filter tabs */}
      <div className="flex bg-muted rounded-full p-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => dispatch(setFilter(filter.value))}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border-none cursor-pointer transition-all duration-200 ${
              currentFilter === filter.value 
                ? 'bg-accent text-white' 
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {filter.label}
            <span className="ml-1.5 opacity-75">{getCount(filter.value)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
