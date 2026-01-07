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
          <span className="absolute -bottom-1 left-0 w-[100px] h-1 bg-accent rounded-sm" />
        </h1>
        <p className="text-muted-foreground text-sm mt-3">
          Manage your daily tasks efficiently
        </p>
        
        {/* Progress bar */}
        <div className="flex items-center gap-3 mt-4">
          <div className="progress-bar w-40">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-sm font-mono">
            <span className="text-accent font-semibold">{completionPercent}%</span>
            <span className="text-muted-foreground"> complete</span>
          </span>
        </div>
      </div>

      <button 
        onClick={() => dispatch(toggleTheme())}
        className="w-10 h-10 rounded-lg border border-border bg-transparent flex items-center justify-center cursor-pointer text-muted-foreground transition-colors hover:border-accent"
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
