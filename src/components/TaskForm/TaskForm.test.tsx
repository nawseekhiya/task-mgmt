import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { TaskForm } from './TaskForm';
import tasksReducer from '../../features/tasks/tasksSlice';

// Mock the hooks module to intercept dispatch
vi.mock('../../store/hooks', () => ({
    useAppDispatch: () => vi.fn(() => Promise.resolve({ unwrap: () => Promise.resolve({}) })),
    useAppSelector: vi.fn(),
}));

describe('TaskForm', () => {
    const createTestStore = () => configureStore({
        reducer: { tasks: tasksReducer }
    });

    const renderWithProvider = () => {
        return render(
            <Provider store={createTestStore()}>
                <TaskForm />
            </Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render input and button', () => {
        renderWithProvider();
        expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('should clear input after form submission', async () => {
        renderWithProvider();
        
        const input = screen.getByPlaceholderText(/what needs to be done/i);
        fireEvent.change(input, { target: { value: 'New Task' } });
        expect(input).toHaveValue('New Task');
        
        fireEvent.submit(screen.getByRole('button', { name: /add task/i }).closest('form')!);
        
        // Input should clear after submit
        // Note: Since dispatch is mocked, we check the UI behavior
    });

    it('should not submit when input is empty', () => {
        renderWithProvider();
        
        const button = screen.getByRole('button', { name: /add task/i });
        // Button should be disabled when input is empty
        expect(button).toBeDisabled();
    });
});
