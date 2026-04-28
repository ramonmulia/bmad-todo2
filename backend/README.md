# Todo App — Backend

Express.js REST API with JSON file persistence.

## Tech Stack

- **Express.js** — HTTP framework
- **Helmet.js** — Security headers
- **CORS** — Cross-origin request handling
- **UUID** — Todo ID generation
- **Vitest + Supertest** — Testing

## Getting Started

```bash
npm install
npm run dev
```

The server runs on [http://localhost:3001](http://localhost:3001).

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with watch mode |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
src/
├── index.js              # Server entry point
├── app.js                # Express app factory (middleware + routes)
├── routes/
│   └── todos.js          # CRUD route handlers
├── db/
│   └── database.js       # JSON file persistence layer
└── middleware/
    └── validation.js     # Input validation + HTML sanitization

tests/
└── api.test.js           # API integration tests
```

## API

All endpoints are prefixed with `/api`.

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/health` | — | `{ status: "ok", timestamp }` |
| GET | `/todos` | — | `Todo[]` |
| POST | `/todos` | `{ text }` | `Todo` |
| PATCH | `/todos/:id` | `{ completed?, text? }` | `Todo` |
| DELETE | `/todos/:id` | — | `{ success: true }` |

### Todo Schema

```json
{
  "id": "uuid",
  "text": "string (1-500 chars)",
  "completed": false,
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `DB_PATH` | `./data/todos.json` | JSON storage file path |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
