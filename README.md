# Task Management Dashboard

A modern, feature-rich task management application built with React, Redux Toolkit, and Tailwind CSS. Features a polished UI with animations, dark/light theme support, and comprehensive test coverage.

<!-- Badges -->
![Status](https://img.shields.io/badge/Status-Active-success?)
![Last Commit](https://img.shields.io/github/last-commit/nawseekhiya/task-mgmt?&color=blue)
![Repo Size](https://img.shields.io/github/repo-size/nawseekhiya/task-mgmt?&color=orange)
![Stars](https://img.shields.io/github/stars/nawseekhiya/task-mgmt?)
![Forks](https://img.shields.io/github/forks/nawseekhiya/task-mgmt?)
![License](https://img.shields.io/badge/License-Custom-red?)
![Vercel](https://vercelbadge.vercel.app/api/nawseekhiya/task-mgmt)

![React](https://img.shields.io/badge/React-18-61DAFB?&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?&logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?&logo=vitest)

---

## ✨ Features

- **CRUD Operations** - Create, read, update, and delete tasks
- **Filter & Search** - Filter by status (All/Pending/Completed) with real-time search
- **Dark/Light Theme** - Toggle with localStorage persistence
- **Animations** - Confetti on task completion, staggered card entrances, progress bar effects
- **Responsive Design** - Optimized layouts for mobile, tablet, and desktop
- **Keyboard Shortcuts** - `Ctrl/Cmd+K` to focus search, `Escape` to close modals
- **Undo Delete** - Toast notification with undo action
- **Accessibility** - ARIA labels, focus management, keyboard navigation

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nawseekhiya/task-mgmt.git
cd task-mgmt

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Confetti/        # Canvas-based confetti animation
│   ├── EditModal/       # Task editing modal
│   ├── EmptyState/      # Empty list placeholder
│   ├── ErrorState/      # Error display with retry
│   ├── FilterBar/       # Search + filter tabs
│   ├── Header/          # App header with progress bar
│   ├── LoadingSkeleton/ # Loading placeholders
│   ├── TaskCard/        # Individual task display
│   ├── TaskForm/        # New task input
│   ├── TaskList/        # Task list container
│   └── Toast/           # Notification toast
├── data/
│   └── mockTasks.ts     # Initial seed data
├── features/
│   ├── tasks/           # Tasks Redux slice & thunks
│   └── theme/           # Theme Redux slice
├── pages/
│   └── Dashboard.tsx    # Main dashboard page
├── services/
│   └── api.ts           # Mock API with localStorage
├── store/
│   ├── index.ts         # Redux store configuration
│   └── hooks.ts         # Typed dispatch/selector hooks
├── test/
│   └── setup.ts         # Test configuration
├── types/
│   └── index.ts         # TypeScript interfaces
├── App.tsx              # Root component
├── main.tsx             # React entry point
└── index.css            # Tailwind + design tokens
```

---

## 🏗️ Architecture & Design Decisions

### State Management
- **Redux Toolkit** for global state with `createSlice` and `createAsyncThunk`
- **Memoized selectors** using `createSelector` to prevent unnecessary re-renders
- **Optimistic updates** for immediate UI feedback

### Styling
- **Tailwind CSS v4** with utility classes
- **CSS custom properties** for design tokens (colors, spacing, etc.)
- **Dark mode** using class-based toggle on `<html>` element

### Data Persistence
- **localStorage** for both tasks and theme preference
- **Mock API layer** simulating network delays (ready for real backend integration)

### Testing
- **Vitest** for fast unit and component testing
- **React Testing Library** for component behavior testing
- **18 tests** covering Redux logic and key components

### Performance
- **Code splitting** via Vite's dynamic imports
- **Memoization** of expensive computations
- **Ref patterns** to avoid circular dependencies in effects

---

## 🧪 Testing

```bash
# Run all tests
pnpm test:run

# Watch mode
pnpm test

# With coverage (if configured)
pnpm test:run --coverage
```

### Test Coverage

| File | Tests |
|------|-------|
| `tasksSlice.test.ts` | 7 tests (reducers + selectors) |
| `TaskCard.test.tsx` | 4 tests |
| `TaskForm.test.tsx` | 3 tests |
| `FilterBar.test.tsx` | 3 tests |
| `App.test.tsx` | 1 test (health check) |

---

## 📄 License

This project is **open-sourced with restrictions**.

- All rights are reserved by the core team.
- You are free to use or adapt the code, but **must credit the original authors**.
- Contributions are welcome and will be **acknowledged**, but do not grant ownership or redistribution rights.
- Redistribution or commercial use without explicit permission is **not allowed**.
- You may not use the code in any way that could be considered **derivative** or **commercial** without explicit permission from **Abhishek Mohanty**.  
  Read more at [LICENSE.md](./LICENSE.md).
