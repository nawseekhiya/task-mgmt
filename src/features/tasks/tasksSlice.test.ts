import { describe, it, expect } from 'vitest';
import tasksReducer, {
    addTask,
    deleteTask,
    toggleTaskStatus,
    selectFilteredTasks,
    selectTaskCounts
} from './tasksSlice';
import type { Task, TaskFilter, TaskStatus as TStatus } from '../../types';

// Properly typed initial state matching TasksState
const createInitialState = () => ({
    items: [] as Task[],
    status: 'idle' as TStatus,
    error: null as string | null,
    filter: 'all' as TaskFilter,
    searchQuery: '',
});

describe('tasksSlice', () => {
    const sampleTask: Task = {
        id: '1',
        title: 'Test Task',
        status: 'pending',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    };

    it('should return initial state', () => {
        const result = tasksReducer(undefined, { type: 'unknown' });
        expect(result).toEqual(createInitialState());
    });

    it('should handle addTask', () => {
        const actual = tasksReducer(createInitialState(), addTask(sampleTask));
        expect(actual.items).toHaveLength(1);
        expect(actual.items[0]).toEqual(sampleTask);
    });

    it('should handle deleteTask', () => {
        const stateWithTask = { ...createInitialState(), items: [sampleTask] };
        const actual = tasksReducer(stateWithTask, deleteTask('1'));
        expect(actual.items).toHaveLength(0);
    });

    it('should handle toggleTaskStatus', () => {
        const stateWithTask = { ...createInitialState(), items: [sampleTask] };
        const actual = tasksReducer(stateWithTask, toggleTaskStatus('1'));
        expect(actual.items[0].status).toBe('completed');

        // Toggle back
        const actual2 = tasksReducer(actual, toggleTaskStatus('1'));
        expect(actual2.items[0].status).toBe('pending');
    });

    describe('Selectors', () => {
        const createTestState = () => ({
            tasks: {
                ...createInitialState(),
                items: [
                    { ...sampleTask, id: '1', title: 'Buy Milk', status: 'pending' as const },
                    { ...sampleTask, id: '2', title: 'Walk Dog', status: 'completed' as const },
                ],
            }
        });

        it('selectFilteredTasks should filter by status', () => {
            const state = createTestState();
            state.tasks.filter = 'pending';
            expect(selectFilteredTasks(state)).toHaveLength(1);
            expect(selectFilteredTasks(state)[0].id).toBe('1');
        });

        it('selectFilteredTasks should filter by search query', () => {
            const state = createTestState();
            state.tasks.searchQuery = 'milk';
            expect(selectFilteredTasks(state)).toHaveLength(1);
            expect(selectFilteredTasks(state)[0].title).toBe('Buy Milk');
        });

        it('selectTaskCounts should return correct counts', () => {
            const state = createTestState();
            const counts = selectTaskCounts(state);
            expect(counts).toEqual({ all: 2, pending: 1, completed: 1 });
        });
    });
});
