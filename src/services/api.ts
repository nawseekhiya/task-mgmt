import type { Task } from '../types';
import { mockTasks } from '../data/mockTasks';

// Simulated network delay (300-500ms)
const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store (simulates backend database)
let tasks: Task[] = [...mockTasks];

// Flag to simulate errors (for testing)
let shouldSimulateError = false;

export const api = {
    // GET /tasks - Fetch all tasks
    async fetchTasks(): Promise<Task[]> {
        await delay();

        if (shouldSimulateError) {
            throw new Error('Failed to fetch tasks');
        }

        return [...tasks];
    },

    // POST /tasks - Create new task
    async createTask(title: string): Promise<Task> {
        await delay(300);

        if (shouldSimulateError) {
            throw new Error('Failed to create task');
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title: title.trim(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        tasks.unshift(newTask);
        return newTask;
    },

    // PUT /tasks/:id - Update task
    async updateTask(id: string, updates: Partial<Pick<Task, 'title' | 'status'>>): Promise<Task> {
        await delay(300);

        if (shouldSimulateError) {
            throw new Error('Failed to update task');
        }

        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        const updatedTask: Task = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        tasks[taskIndex] = updatedTask;
        return updatedTask;
    },

    // DELETE /tasks/:id - Delete task
    async deleteTask(id: string): Promise<void> {
        await delay(300);

        if (shouldSimulateError) {
            throw new Error('Failed to delete task');
        }

        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        tasks.splice(taskIndex, 1);
    },

    // Helper to toggle error simulation (for testing)
    setSimulateError(value: boolean) {
        shouldSimulateError = value;
    },

    // Helper to reset data (for testing)
    resetData() {
        tasks = [...mockTasks];
    },
};
