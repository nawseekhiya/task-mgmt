import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectThemeMode, toggleTheme } from '../../features/theme/themeSlice';

interface HeaderProps {
  completionPercent: number;
}

export function Header({ completionPercent }: HeaderProps) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);

  return (
    <header className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] relative inline-block pb-1">
          Task Dashboard
          <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-[var(--accent)] rounded-sm" />
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-2">
          Manage your daily tasks efficiently
        </p>
        
        {/* Progress bar */}
        <div className="w-[200px] h-1.5 bg-[var(--muted)] rounded-full overflow-hidden mt-4">
          <div 
            className="h-full rounded-full progress-shimmer transition-[width] duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-xs font-mono text-[var(--muted-foreground)] mt-2">
          <span className="font-semibold text-[var(--accent)]">{completionPercent}%</span> complete
        </p>
      </div>

      <button 
        onClick={() => dispatch(toggleTheme())}
        className="w-10 h-10 flex items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:rotate-[15deg] group"
        aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
      >
        {themeMode === 'light' ? (
          <svg className="w-[18px] h-[18px] text-[var(--muted-foreground)] group-hover:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg className="w-[18px] h-[18px] text-[var(--muted-foreground)] group-hover:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
      </button>
    </header>
  );
}
