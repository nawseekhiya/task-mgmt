import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import type { Task } from '../../types';

// Fetch all tasks
export const fetchTasksThunk = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const tasks = await api.fetchTasks();
            return tasks;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks');
        }
    }
);

// Create new task
export const addTaskThunk = createAsyncThunk(
    'tasks/addTask',
    async (title: string, { rejectWithValue }) => {
        try {
            const task = await api.createTask(title);
            return task;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to create task');
        }
    }
);

// Update task (title or status)
export const updateTaskThunk = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, updates }: { id: string; updates: Partial<Pick<Task, 'title' | 'status'>> }, { rejectWithValue }) => {
        try {
            const task = await api.updateTask(id, updates);
            return task;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
        }
    }
);

// Delete task
export const deleteTaskThunk = createAsyncThunk(
    'tasks/deleteTask',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.deleteTask(id);
            return id;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
        }
    }
);

// Toggle task status (convenience thunk)
export const toggleTaskStatusThunk = createAsyncThunk(
    'tasks/toggleStatus',
    async ({ id, currentStatus }: { id: string; currentStatus: 'pending' | 'completed' }, { rejectWithValue }) => {
        try {
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            const task = await api.updateTask(id, { status: newStatus });
            return task;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle task status');
        }
    }
);
