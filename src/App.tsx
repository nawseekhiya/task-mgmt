import { useEffect } from 'react';
import { useAppSelector } from './store/hooks';
import { selectThemeMode } from './features/theme/themeSlice';
import { Dashboard } from './pages';

function App() {
  const themeMode = useAppSelector(selectThemeMode);

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors">
      <Dashboard />
    </div>
  );
}

export default App;
