import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '../../types';

interface ThemeState {
    mode: ThemeMode;
}

// Initialize from localStorage or system preference
const getInitialTheme = (): ThemeMode => {
    // Check localStorage
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }
    return 'light';
};

const initialState: ThemeState = {
    mode: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.mode);
            }
        },
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.mode);
            }
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;

// Selectors
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;
