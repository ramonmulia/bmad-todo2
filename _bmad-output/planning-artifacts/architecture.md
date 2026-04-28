# Architecture Document — todo-app 2

**Author:** Ramonmulia
**Date:** 2026-04-27

## System Overview

```
┌─────────────────────┐     HTTP/JSON     ┌─────────────────────┐     File I/O   ┌──────────┐
│   React Frontend    │ ◄──────────────► │  Express Backend    │ ◄──────────► │  JSON    │
│   (Port 3000)       │                   │  (Port 3001)        │              │  (File)  │
└─────────────────────┘                   └─────────────────────┘              └──────────┘
         │                                          │
         │ (Docker)                                  │ (Docker)
         ▼                                          ▼
┌─────────────────────┐                   ┌─────────────────────┐
│  nginx (static +    │                   │  Node.js container  │
│  reverse proxy)     │                   │  + data volume      │
└─────────────────────┘                   └─────────────────────┘
```

## Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Frontend | React 18 + Vite | Latest | Component model, fast HMR, ESM-native |
| Backend | Express.js | Latest | Simple, widely understood, quick to ship |
| Storage | JSON file (`todos.json`) | N/A | Zero config, no native deps, single-user |
| Testing | Vitest + Playwright + Testing Library | Latest | Fast unit tests, reliable E2E, user-centric component tests |
| Container | Docker + Docker Compose + nginx | Latest | Multi-stage builds, reverse proxy, gzip |
| Security | Helmet.js + CORS + input sanitization | Latest | Standard security headers, XSS prevention |

## Frontend Architecture

### Component Tree

```
App
├── TodoInput        — Form with text input + submit button
├── TodoList (inline) — Maps over todos array
│   └── TodoItem     — Individual todo with checkbox + text + delete
├── EmptyState (inline) — Shown when todos.length === 0
├── LoadingSpinner (inline) — Shown during initial fetch
└── ErrorBanner (inline) — Shown on API failure, dismissible
```

### State Management

Single custom hook `useTodos()` manages all state:

- `todos: Todo[]` — the todo list
- `loading: boolean` — initial fetch state
- `error: string | null` — current error message
- Actions: `addTodo`, `toggleTodo`, `removeTodo`, `dismissError`
- Optimistic updates for toggle and delete with rollback on failure

### API Client

`api.js` — thin wrapper around `fetch()`:
- Base URL: `/api` (proxied by Vite in dev, nginx in prod)
- JSON content type on all requests
- Throws on non-OK responses with server error message

### Styling

- Single CSS file: `styles/index.css`
- CSS custom properties (variables) for theming
- Dark theme only (MVP)
- Responsive breakpoint at 480px
- No CSS framework — full control

## Backend Architecture

### Layer Structure

```
src/
├── index.js              — Server entry point (listen on PORT)
├── app.js                — Express app factory (middleware + routes)
├── routes/todos.js       — CRUD route handlers
├── db/database.js        — JSON file persistence layer
└── middleware/validation.js — Input validation + HTML sanitization
```

### Middleware Stack

1. `helmet()` — Security headers (CSP disabled for SPA)
2. `cors()` — Configured for frontend origin
3. `express.json({ limit: '10kb' })` — Body parsing with size limit
4. Route handlers
5. 404 handler
6. Global error handler

### Data Persistence

- JSON file at `DB_PATH` (default: `./data/todos.json`)
- Synchronous read/write via `fs.readFileSync`/`fs.writeFileSync`
- Auto-creates directory and empty file if not exists
- Data structure: `{ todos: Todo[] }`
- Sorted by `created_at` DESC on read

## API Contract

### Endpoints

| Method | Path | Request Body | Response | Status |
|--------|------|-------------|----------|--------|
| GET | `/api/health` | — | `{ status: "ok", timestamp }` | 200 |
| GET | `/api/todos` | — | `Todo[]` | 200 |
| POST | `/api/todos` | `{ text: string }` | `Todo` | 201 |
| PATCH | `/api/todos/:id` | `{ completed?: boolean, text?: string }` | `Todo` | 200 |
| DELETE | `/api/todos/:id` | — | `{ success: true }` | 200 |

### Todo Schema

```json
{
  "id": "string (UUID v4)",
  "text": "string (1-500 chars, HTML-sanitized)",
  "completed": "boolean (default: false)",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

### Error Response Schema

```json
{
  "error": "string (VALIDATION_ERROR | NOT_FOUND | SERVER_ERROR)",
  "message": "string (human-readable)"
}
```

### Validation Rules

- **Create:** `text` required, string, 1-500 chars after trim
- **Update:** `completed` must be boolean if present, `text` must be 1-500 chars if present
- **HTML sanitization:** Applied to all text input (`& < > " '` escaped)

## Infrastructure

### Docker Compose

- **backend:** Node.js container, port 3001, health check via `/api/health`, persistent data volume
- **frontend:** nginx container, port 3000, depends on healthy backend
- **Network:** Bridge network `todo-network`
- **Volume:** `todo-data` for JSON file persistence

### Environment Variables

| Variable | Default | Used By |
|----------|---------|---------|
| `PORT` | `3001` | Backend |
| `DB_PATH` | `./data/todos.json` | Backend |
| `CORS_ORIGIN` | `http://localhost:3000` | Backend |
| `VITE_API_URL` | `http://localhost:3001` | Frontend (Vite proxy) |

## Security Measures

- Helmet.js security headers on all responses
- CORS restricted to frontend origin only
- Input sanitization prevents stored XSS
- Body size limit (10kb) prevents payload attacks
- No authentication (single-user, no PII)
- No SQL injection surface (no SQL database)

## Testing Strategy

| Layer | Tool | Target | Focus |
|-------|------|--------|-------|
| Backend unit/integration | Vitest | 80%+ coverage | API routes, validation, DB ops |
| Frontend components | Vitest + Testing Library | 70%+ coverage | Rendering, interactions |
| E2E | Playwright | All user journeys | Full-stack flows |
| Accessibility | axe-core + Lighthouse | 0 critical violations | WCAG AA |

## Architectural Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|------------------------|-----------|
| Storage | JSON file | SQLite, PostgreSQL | Zero config, no native deps, sufficient for single-user POC |
| State management | Custom hook | Redux, Zustand, Context | Minimal state needs don't justify a library |
| Styling | Custom CSS | Tailwind, CSS Modules, styled-components | Full control, no build overhead, portfolio demonstrates CSS skills |
| Monorepo | Flat structure | npm workspaces, Turborepo | Simple project doesn't need monorepo tooling |
| API proxy | Vite proxy (dev) / nginx (prod) | Express static serving | Clean separation of concerns |

## Extension Points

For planned growth features, the architecture supports:

- **Filtering:** Add query params to `GET /api/todos?status=active`
- **Due dates/priority:** Add fields to Todo schema, new validation rules
- **Theme toggle:** CSS variable swap via class on `<html>`
- **Search:** Add query param `GET /api/todos?q=searchterm`
- **Bulk actions:** New endpoints `POST /api/todos/complete-all`, `DELETE /api/todos/completed`
