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
        <h1 className="text-3xl font-bold mb-1 relative inline-block">
          Task Dashboard
          <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-[var(--color-accent)] rounded-full" />
        </h1>
        <p className="text-[var(--color-muted-foreground)] text-sm mt-2">
          Manage your daily tasks efficiently
        </p>
        
        {/* Progress bar */}
        <div className="progress-bar w-48 mt-4">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1 font-mono">
          <span className="text-[var(--color-accent)] font-semibold">{completionPercent}%</span> complete
        </p>
      </div>

      <button 
        onClick={() => dispatch(toggleTheme())}
        className="btn-icon hover:rotate-12 transition-transform"
        aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
      >
        {themeMode === 'light' ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
      </button>
    </header>
  );
}
