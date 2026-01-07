import { useState, useRef, useEffect } from 'react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filters: { value: TaskFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'pending', label: 'Pending', count: counts.pending },
    { value: 'completed', label: 'Completed', count: counts.completed },
  ];

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setIsSearchFocused(true);
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setIsSearchFocused(false);
        dispatch(setSearchQuery(''));
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, dispatch]);

  return (
    <div className="mb-6">
      {/* ===== MOBILE LAYOUT ===== */}
      
      {/* Mobile: Search expands above when active */}
      {isSearchOpen && (
        <div className="sm:hidden mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              autoFocus
              className="w-full py-3 pl-10 pr-10 text-sm text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl outline-none transition-all duration-150 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 placeholder:text-[var(--muted-foreground)]"
              placeholder="Search tasks..."
            />
            <button
              onClick={() => {
                dispatch(setSearchQuery(''));
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile: Filter row with search button */}
      <div className="flex items-center gap-2 sm:hidden">
        <div className="flex gap-1 p-1 bg-[var(--muted)] rounded-xl flex-1 h-11">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => dispatch(setFilter(filter.value))}
              className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-150 ${
                currentFilter === filter.value 
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm border-l-2 border-[var(--accent)]' 
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <span className="truncate">{filter.label}</span>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded transition-colors max-[385px]:hidden ${
                currentFilter === filter.value 
                  ? 'bg-[var(--muted)] text-[var(--foreground)]' 
                  : 'bg-[var(--background)] text-[var(--muted-foreground)]'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-150 ${
            isSearchOpen || searchQuery
              ? 'bg-[var(--accent)] border-[var(--accent)] text-black'
              : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden sm:flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative group flex-shrink-0">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none transition-colors group-focus-within:text-[var(--accent)]"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`h-10 pl-10 pr-14 text-sm text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 placeholder:text-[var(--muted-foreground)] ${
              isSearchFocused ? 'w-72' : 'w-48'
            }`}
            placeholder="Search tasks..."
          />
          {/* Keyboard shortcut badge */}
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-200 ${
            isSearchFocused ? 'opacity-0' : 'opacity-60'
          }`}>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted-foreground)] bg-[var(--muted)] border border-[var(--border)] rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Filter tabs - compress only when search is focused */}
        <div className={`flex p-1 bg-[var(--muted)] rounded-xl transition-all duration-300 ${
          isSearchFocused ? 'gap-0' : 'gap-0.5'
        }`}>
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => dispatch(setFilter(filter.value))}
              className={`flex items-center gap-2 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-300 whitespace-nowrap ${
                currentFilter === filter.value 
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm border-l-2 border-[var(--accent)]' 
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              } ${isSearchFocused ? 'px-2.5' : 'px-4'}`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded transition-colors ${
                currentFilter === filter.value 
                  ? 'bg-[var(--muted)] text-[var(--foreground)]' 
                  : 'bg-[var(--background)] text-[var(--muted-foreground)]'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
