# Todo App

Full-stack todo application with React frontend and Express backend.

## Project Structure

- `frontend/` — React + Vite (port 3000)
- `backend/` — Express.js API (port 3001)
- `e2e/` — Playwright E2E tests
- `docs/` — BMAD project artifacts

## Tech Stack

- **Frontend:** React 18, Vite, CSS (dark theme)
- **Backend:** Express.js, JSON file storage, ESM modules
- **Testing:** Vitest (unit/integration), Playwright (E2E), Testing Library (components)
- **Containerization:** Docker + docker-compose + nginx

## Commands

```bash
# Backend
cd backend && npm install
cd backend && npm run dev          # dev server with watch (port 3001)
cd backend && npm test             # run vitest tests
cd backend && npm run test:coverage

# Frontend
cd frontend && npm install
cd frontend && npm run dev         # vite dev server (port 3000)
cd frontend && npm test            # run vitest tests
cd frontend && npm run test:coverage

# E2E
npx playwright test                # requires both servers running

# All tests
npm run test:all

# Docker
docker-compose up --build
```

## API

REST API at `/api/`:
- `GET /api/health` — health check
- `GET /api/todos` — list todos
- `POST /api/todos` — create todo
- `PATCH /api/todos/:id` — update todo
- `DELETE /api/todos/:id` — delete todo

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Backend port |
| `DB_PATH` | `./data/todos.json` | Data file path |
| `CORS_ORIGIN` | `http://localhost:3000` | CORS origin |
| `VITE_API_URL` | `http://localhost:3001` | API URL for Vite proxy |

## Code Conventions

- ESM modules (`"type": "module"` in package.json)
- `.jsx` extension for React components
- Tests co-located in `tests/` directories
- Vitest for all unit/integration tests
