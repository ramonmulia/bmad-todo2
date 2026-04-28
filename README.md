# Todo App

A full-stack todo application built with React and Express.js. Personal portfolio project demonstrating modern web development practices including containerization, testing, and accessibility.

## Tech Stack

- **Frontend:** React 18, Vite, CSS custom properties (dark theme)
- **Backend:** Express.js, JSON file storage
- **Testing:** Vitest, Testing Library, Playwright
- **Infrastructure:** Docker, Docker Compose, nginx

## Quick Start

```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Run both servers
npm start
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)

## Docker

```bash
docker-compose up --build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run backend + frontend concurrently |
| `npm run test:backend` | Run backend tests |
| `npm run test:frontend` | Run frontend tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:all` | Run all tests |

## Project Structure

```
todo-app/
├── backend/          # Express.js REST API
├── frontend/         # React + Vite SPA
├── e2e/              # Playwright E2E tests
├── docker/           # Docker-related configs
├── _bmad/            # BMAD framework tooling
├── _bmad-output/     # Planning & implementation artifacts
├── docker-compose.yml
└── playwright.config.js
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/todos` | List all todos |
| POST | `/api/todos` | Create a todo |
| PATCH | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Backend port |
| `DB_PATH` | `./data/todos.json` | Data file path |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `VITE_API_URL` | `http://localhost:3001` | API URL for Vite proxy |
