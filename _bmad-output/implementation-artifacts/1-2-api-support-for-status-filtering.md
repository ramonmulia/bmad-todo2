# Story 1.2: API Support for Status Filtering

Status: done

## Story

As a developer,
I want the API to support status filtering via query parameter,
so that filtering can be server-side if the list grows large.

## Acceptance Criteria

1. **Given** the API receives `GET /api/todos?status=active`, **When** the request is processed, **Then** only todos with `completed: false` are returned.

2. **Given** the API receives `GET /api/todos?status=completed`, **When** the request is processed, **Then** only todos with `completed: true` are returned.

3. **Given** the API receives `GET /api/todos` (no status param), **When** the request is processed, **Then** all todos are returned (backward compatible).

4. **Given** the API receives `GET /api/todos?status=invalid`, **When** the request is processed, **Then** a 400 error is returned with a descriptive message.

## Tasks / Subtasks

- [ ] **Task 1: Add status query param support to GET /api/todos route**
- [ ] **Task 2: Validate status query param values**
- [ ] **Task 3: Write backend tests for status filtering**

## Dev Notes

### Files to Modify

| File | Action | What Changes |
|------|--------|-------------|
| `backend/src/routes/todos.js` | UPDATE | Add status query param handling |
| `backend/tests/api.test.js` | UPDATE | Add filter tests |

## Dev Agent Record

### Completion Notes List

### File List
