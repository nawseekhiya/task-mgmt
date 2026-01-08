import { describe, it, expect } from 'vitest';
import tasksReducer, {
    addTask,
    deleteTask,
    toggleTaskStatus,
    setFilter,
    setSearchQuery,
    selectFilteredTasks,
    selectTaskCounts
} from './tasksSlice';
import type { Task } from '../../types';

describe('tasksSlice', () => {
    const initialState = {
        items: [],
        status: 'idle',
        error: null,
        filter: 'all',
        searchQuery: '',
    };

    const sampleTask: Task = {
        id: '1',
        title: 'Test Task',
        status: 'pending',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    };

    it('should return initial state', () => {
        // @ts-ignore
        expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addTask', () => {
        const actual = tasksReducer(initialState, addTask(sampleTask));
        expect(actual.items).toHaveLength(1);
        expect(actual.items[0]).toEqual(sampleTask);
    });

    it('should handle deleteTask', () => {
        const stateWithTask = { ...initialState, items: [sampleTask] };
        const actual = tasksReducer(stateWithTask, deleteTask('1'));
        expect(actual.items).toHaveLength(0);
    });

    it('should handle toggleTaskStatus', () => {
        const stateWithTask = { ...initialState, items: [sampleTask] };
        const actual = tasksReducer(stateWithTask, toggleTaskStatus('1'));
        expect(actual.items[0].status).toBe('completed');

        // Toggle back
        const actual2 = tasksReducer(actual, toggleTaskStatus('1'));
        expect(actual2.items[0].status).toBe('pending');
    });

    describe('Selectors', () => {
        const state = {
            tasks: {
                ...initialState,
                items: [
                    { ...sampleTask, id: '1', title: 'Buy Milk', status: 'pending' },
                    { ...sampleTask, id: '2', title: 'Walk Dog', status: 'completed' },
                ],
                filter: 'all',
                searchQuery: '',
            }
        };

        it('selectFilteredTasks should filter by status', () => {
            // @ts-ignore
            const statePending = { tasks: { ...state.tasks, filter: 'pending' } };
            // @ts-ignore
            expect(selectFilteredTasks(statePending)).toHaveLength(1);
            // @ts-ignore
            expect(selectFilteredTasks(statePending)[0].id).toBe('1');
        });

        it('selectFilteredTasks should filter by search query', () => {
            // @ts-ignore
            const stateSearch = { tasks: { ...state.tasks, searchQuery: 'milk' } };
            // @ts-ignore
            expect(selectFilteredTasks(stateSearch)).toHaveLength(1);
            // @ts-ignore
            expect(selectFilteredTasks(stateSearch)[0].title).toBe('Buy Milk');
        });

        it('selectTaskCounts should return correct counts', () => {
            // @ts-ignore
            const counts = selectTaskCounts(state);
            expect(counts).toEqual({ all: 2, pending: 1, completed: 1 });
        });
    });
});
