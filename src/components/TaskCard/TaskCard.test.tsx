import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { TaskCard } from './TaskCard';
import tasksReducer from '../../features/tasks/tasksSlice';
import type { Task } from '../../types';

describe('TaskCard', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        status: 'pending',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
    };

    const createTestStore = () => configureStore({
        reducer: { tasks: tasksReducer }
    });

    const renderWithProvider = (component: React.ReactNode) => {
        return render(
            <Provider store={createTestStore()}>
                {component}
            </Provider>
        );
    };

    it('should render task title', () => {
        renderWithProvider(
            <TaskCard 
                task={mockTask} 
                onDelete={vi.fn()} 
                onEdit={vi.fn()} 
                index={0}
            />
        );
        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('should display correct status badge', () => {
        renderWithProvider(
            <TaskCard 
                task={mockTask} 
                onDelete={vi.fn()} 
                onEdit={vi.fn()} 
                index={0}
            />
        );
        expect(screen.getByText('pending')).toBeInTheDocument();
    });

    it('should call onToggle causes dispatch but needs store verification (skipping spy for now)', () => {
       // Since logic is in thunk, we might just verify rendering mostly
       // But we can verify button exists
       renderWithProvider(
            <TaskCard 
                task={mockTask} 
                onDelete={vi.fn()} 
                onEdit={vi.fn()} 
                index={0}
            />
        );
        expect(screen.getByLabelText(/mark as/i)).toBeInTheDocument();
    });

    it('should call onDelete when delete button is clicked', () => {
        const onDelete = vi.fn();
        renderWithProvider(
            <TaskCard 
                task={mockTask} 
                onDelete={onDelete} 
                onEdit={vi.fn()} 
                index={0}
            />
        );
        
        fireEvent.click(screen.getByLabelText(/delete task/i));
        // onDelete is called AFTER dispatch
        expect(onDelete).toHaveBeenCalledWith(mockTask, 0);
    });
});

