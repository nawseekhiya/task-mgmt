import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskFilter, TaskStatus } from '../../types';
import {
    fetchTasksThunk,
    addTaskThunk,
    updateTaskThunk,
    deleteTaskThunk,
    toggleTaskStatusThunk,
} from './tasksThunks';

// State shape
interface TasksState {
    items: Task[];
    status: TaskStatus;
    error: string | null;
    filter: TaskFilter;
    searchQuery: string;
}

const initialState: TasksState = {
    items: [],
    status: 'idle',
    error: null,
    filter: 'all',
    searchQuery: '',
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Set filter
        setFilter: (state, action: PayloadAction<TaskFilter>) => {
            state.filter = action.payload;
        },

        // Set search query
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },

        // Add task (optimistic)
        addTask: (state, action: PayloadAction<Task>) => {
            state.items.unshift(action.payload);
        },

        // Update task (optimistic)
        updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
            const { id, updates } = action.payload;
            const task = state.items.find(t => t.id === id);
            if (task) {
                Object.assign(task, updates, { updatedAt: new Date().toISOString() });
            }
        },

        // Delete task (optimistic)
        deleteTask: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(t => t.id !== action.payload);
        },

        // Toggle task status
        toggleTaskStatus: (state, action: PayloadAction<string>) => {
            const task = state.items.find(t => t.id === action.payload);
            if (task) {
                task.status = task.status === 'completed' ? 'pending' : 'completed';
                task.updatedAt = new Date().toISOString();
            }
        },

        // Set all tasks (used by async thunks)
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.items = action.payload;
        },

        // Set loading status
        setStatus: (state, action: PayloadAction<TaskStatus>) => {
            state.status = action.payload;
        },

        // Set error
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Restore deleted task (for undo)
        restoreTask: (state, action: PayloadAction<{ task: Task; index: number }>) => {
            const { task, index } = action.payload;
            state.items.splice(index, 0, task);
        },
    },
    extraReducers: (builder) => {
        // Fetch tasks
        builder
            .addCase(fetchTasksThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTasksThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTasksThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Add task
            .addCase(addTaskThunk.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // Update task
            .addCase(updateTaskThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete task
            .addCase(deleteTaskThunk.fulfilled, (state, action) => {
                state.items = state.items.filter(t => t.id !== action.payload);
            })
            // Toggle status
            .addCase(toggleTaskStatusThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export const {
    setFilter,
    setSearchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setTasks,
    setStatus,
    setError,
    restoreTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;

// Selectors
export const selectAllTasks = (state: { tasks: TasksState }) => state.tasks.items;
export const selectTasksStatus = (state: { tasks: TasksState }) => state.tasks.status;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;
export const selectFilter = (state: { tasks: TasksState }) => state.tasks.filter;
export const selectSearchQuery = (state: { tasks: TasksState }) => state.tasks.searchQuery;

// Derived selector: filtered tasks
export const selectFilteredTasks = createSelector(
    [selectAllTasks, selectFilter, selectSearchQuery],
    (items, filter, searchQuery) => {
        return items.filter(task => {
            // Apply status filter
            if (filter === 'pending' && task.status !== 'pending') return false;
            if (filter === 'completed' && task.status !== 'completed') return false;

            // Apply search filter
            if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            return true;
        });
    }
);

// Count selectors
export const selectTaskCounts = createSelector(
    [selectAllTasks],
    (items) => {
        return {
            all: items.length,
            pending: items.filter(t => t.status === 'pending').length,
            completed: items.filter(t => t.status === 'completed').length,
        };
    }
);
