# Todo App — Docker

Docker configuration for containerized deployment.

## Architecture

```
docker-compose.yml (project root)
├── frontend/Dockerfile    # Multi-stage: build React → serve via nginx
└── backend/Dockerfile     # Node.js Alpine with non-root user
```

## Running

```bash
# From the project root
docker-compose up --build
```

- Frontend (nginx): [http://localhost:3000](http://localhost:3000)
- Backend (Node.js): [http://localhost:3001](http://localhost:3001)

## Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `frontend` | nginx:alpine | 3000 | Serves built React app, proxies `/api/` to backend |
| `backend` | node:20-alpine | 3001 | Express.js API with health check |

## Volumes

- `todo-data` — Persists `todos.json` across container restarts

## Network

- `todo-network` — Bridge network connecting frontend and backend containers
- The frontend nginx config proxies `/api/` requests to `http://backend:3001` using Docker's internal DNS
