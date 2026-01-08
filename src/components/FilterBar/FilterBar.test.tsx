import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FilterBar } from './FilterBar';
import tasksReducer from '../../features/tasks/tasksSlice';

describe('FilterBar', () => {
    const counts = { all: 10, pending: 6, completed: 4 };

    const renderWithStore = () => {
        const store = configureStore({
            reducer: { tasks: tasksReducer }
        });
        const utils = render(
            <Provider store={store}>
                <FilterBar counts={counts} />
            </Provider>
        );
        return { store, ...utils };
    };

    it('should render filter tabs and counts', () => {
        renderWithStore();
        // Use getAllByText since mobile+desktop both render the same text
        expect(screen.getAllByText('All').length).toBeGreaterThan(0);
        expect(screen.getAllByText('10').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
        expect(screen.getAllByText('6').length).toBeGreaterThan(0);
    });

    it('should update filter in store when tab clicked', () => {
        const { store } = renderWithStore();
        
        // Click the first "Pending" button found
        fireEvent.click(screen.getAllByText('Pending')[0]);
        expect(store.getState().tasks.filter).toBe('pending');
        
        fireEvent.click(screen.getAllByText('Completed')[0]);
        expect(store.getState().tasks.filter).toBe('completed');
    });

    it('should update search query in store when input changes', () => {
        const { store } = renderWithStore();
        
        const input = screen.getByPlaceholderText(/search tasks/i);
        fireEvent.change(input, { target: { value: 'Buy Milk' } });
        
        expect(store.getState().tasks.searchQuery).toBe('Buy Milk');
    });
});
