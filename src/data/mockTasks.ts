import type { Task } from '../types';

// Initial mock data
export const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Review project requirements',
        status: 'completed',
        createdAt: '2026-01-04T10:00:00.000Z',
        updatedAt: '2026-01-04T10:30:00.000Z',
    },
    {
        id: '2',
        title: 'Set up development environment',
        status: 'completed',
        createdAt: '2026-01-04T10:05:00.000Z',
        updatedAt: '2026-01-04T11:00:00.000Z',
    },
    {
        id: '3',
        title: 'Design component architecture',
        status: 'pending',
        createdAt: '2026-01-04T10:10:00.000Z',
        updatedAt: '2026-01-04T10:10:00.000Z',
    },
    {
        id: '4',
        title: 'Implement Redux store',
        status: 'pending',
        createdAt: '2026-01-04T10:15:00.000Z',
        updatedAt: '2026-01-04T10:15:00.000Z',
    },
    {
        id: '5',
        title: 'Build task list component',
        status: 'pending',
        createdAt: '2026-01-04T10:20:00.000Z',
        updatedAt: '2026-01-04T10:20:00.000Z',
    },
];
