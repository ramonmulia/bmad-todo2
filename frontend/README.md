# Todo App — Frontend

React 18 + Vite single-page application for managing todos.

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool and dev server
- **CSS Custom Properties** — Dark theme styling
- **Vitest + Testing Library** — Unit and component tests

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000) and proxies API requests to the backend at port 3001.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
src/
├── App.jsx                  # Root component
├── api.js                   # API client (fetch wrapper)
├── main.jsx                 # Entry point
├── components/
│   ├── FilterBar.jsx        # Status filter (All/Active/Completed)
│   ├── TodoInput.jsx        # New todo form
│   └── TodoItem.jsx         # Individual todo with checkbox + delete
├── hooks/
│   └── useTodos.js          # Todo state management + filtering
└── styles/
    └── index.css            # Global styles (dark theme, CSS variables)

tests/
├── components.test.jsx      # Component + integration tests
└── setup.js                 # Test setup (jest-dom matchers)
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | Backend API URL for Vite proxy |
