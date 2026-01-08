// Task type definition
export interface Task {
    id: string;
    title: string;
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
}

// State types
export type TaskFilter = 'all' | 'completed' | 'pending';
export type TaskStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type ThemeMode = 'light' | 'dark';
