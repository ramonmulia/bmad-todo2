---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish", "step-12-complete"]
inputDocuments: ["CLAUDE.md", "README.md"]
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 2
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: brownfield
---

# Product Requirements Document - todo-app 2

**Author:** Ramonmulia
**Date:** 2026-04-27

## Executive Summary

A full-stack todo application built as a proof-of-concept to demonstrate engineering quality across the stack. The app serves as a personal productivity tool and portfolio piece, prioritizing comprehensive test coverage, clean UI design, and sound architecture over feature breadth. Built with React 18 and Express.js, it targets a single user managing personal tasks with zero friction.

### What Makes This Special

This is not a tutorial todo app. It is a deliberately scoped POC that showcases testing-first development — unit, integration, and E2E coverage across frontend and backend — paired with a polished dark-themed UI. The value is in the engineering rigor: clean component architecture, proper API design, Docker containerization, and accessibility compliance. It demonstrates the ability to take a simple concept and execute it at production quality.

## Project Classification

- **Project Type:** Web application (React SPA + REST API)
- **Domain:** General / Personal Productivity
- **Complexity:** Low
- **Project Context:** Brownfield — existing working application with planned UI improvements and expanded feature set

## Success Criteria

### User Success

- User can add, view, complete, and delete todos without friction or delay
- All interactions feel instant (optimistic UI updates, < 100ms perceived latency)
- App is usable on any device from 320px to 1920px viewport width
- Keyboard-only navigation works for all actions
- Screen readers can announce all state changes

### Business Success

- Portfolio demonstrates full-stack engineering competence to reviewers
- Codebase is clean and readable enough that a reviewer can understand architecture within 5 minutes
- Test suite passes reliably in CI with zero flaky tests
- Project showcases modern development practices: ESM, Docker, E2E testing, accessibility

### Technical Success

- Backend API response times < 100ms for all endpoints
- Frontend renders at 60fps (< 16ms frames)
- Zero critical or high-severity accessibility violations (axe-core audit)
- Test coverage: 80%+ backend, 70%+ frontend
- Docker Compose brings up the full stack in a single command
- Zero known security vulnerabilities in dependencies

### Measurable Outcomes

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Backend test coverage | >= 80% | `npm run test:coverage` |
| Frontend test coverage | >= 70% | `npm run test:coverage` |
| E2E scenarios passing | 100% | `npx playwright test` |
| Lighthouse accessibility | >= 90 | Lighthouse audit |
| Lighthouse performance | >= 90 | Lighthouse audit |
| API response time | < 100ms | Vitest benchmark or manual check |
| Page load time | < 2s | Lighthouse audit |
| WCAG AA violations | 0 critical | axe-core automated audit |

## Product Scope

### MVP - Current State (Implemented)

- CRUD operations: create, read, update (toggle complete), delete todos
- REST API with proper validation and error responses
- Dark-themed responsive UI with accessibility compliance
- JSON file persistence across refreshes
- Loading, empty, and error states
- Docker containerization with nginx reverse proxy
- Unit tests (18 backend, 14 frontend) and 8 E2E tests

### Growth Features (Post-MVP)

- **UI Enhancement:** Refined visual design, improved animations and transitions, better mobile experience
- **Task Organization:** Due dates, priority levels, categories/tags
- **Filtering & Search:** Filter by status (active/completed/all), text search
- **Bulk Actions:** Mark all complete, clear completed
- **Drag-and-Drop:** Reorder todos manually
- **Theme Support:** Light/dark mode toggle
- **Improved Testing:** Increase coverage targets, add visual regression tests, add performance benchmarks

### Vision (Future)

- Offline support / PWA capabilities
- Recurring tasks
- Keyboard shortcuts for power users
- Data export/import
- Multiple lists or projects

## User Journeys

### Journey 1: Quick Task Capture

**Persona:** Individual user with a task in mind
**Entry:** Opens app in browser

1. App loads and displays existing todos (or empty state)
2. User types task text in input field
3. User presses Enter or clicks Add
4. Todo appears instantly at the top of the list
5. Input clears, ready for next task

**Success:** Task captured in under 3 seconds from page load.

### Journey 2: Task Triage

**Persona:** User reviewing their task list
**Entry:** Opens app to check what needs doing

1. App loads with all todos visible
2. User scans the list, sees active count in counter
3. User marks completed items by clicking checkboxes
4. Completed items get visual distinction (strikethrough, muted)
5. User deletes tasks no longer relevant

**Success:** User can triage 10 tasks in under 30 seconds.

### Journey 3: Mobile Quick Check

**Persona:** User on phone checking todos
**Entry:** Opens app on mobile browser

1. App loads with responsive layout
2. Touch targets are large enough (44x44px minimum)
3. Input stacks vertically for easy thumb typing
4. Delete buttons are always visible (no hover on mobile)
5. User can add/complete/delete with one-handed operation

**Success:** Full functionality on 320px+ screens with no horizontal scroll.

## Functional Requirements

### FR-1: Todo CRUD Operations

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| FR-1.1 | Create todo with text input (1-500 chars) | P0 | Implemented |
| FR-1.2 | List all todos ordered by creation time (newest first) | P0 | Implemented |
| FR-1.3 | Toggle todo completion status | P0 | Implemented |
| FR-1.4 | Delete individual todo | P0 | Implemented |
| FR-1.5 | Input validation (empty text, max length) | P0 | Implemented |
| FR-1.6 | Persist data across page refreshes | P0 | Implemented |

### FR-2: User Interface

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| FR-2.1 | Dark theme with orange accent | P0 | Implemented |
| FR-2.2 | Responsive layout (320px - 1920px) | P0 | Implemented |
| FR-2.3 | Loading spinner during initial fetch | P1 | Implemented |
| FR-2.4 | Empty state when no todos exist | P1 | Implemented |
| FR-2.5 | Error banner with dismiss action | P1 | Implemented |
| FR-2.6 | Active/total counter display | P1 | Implemented |
| FR-2.7 | Completed todo visual distinction (strikethrough + muted) | P0 | Implemented |
| FR-2.8 | Slide-in animation for new todos | P2 | Implemented |

### FR-3: API

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| FR-3.1 | GET /api/todos — list all todos | P0 | Implemented |
| FR-3.2 | POST /api/todos — create todo | P0 | Implemented |
| FR-3.3 | PATCH /api/todos/:id — update todo | P0 | Implemented |
| FR-3.4 | DELETE /api/todos/:id — delete todo | P0 | Implemented |
| FR-3.5 | GET /api/health — health check | P1 | Implemented |
| FR-3.6 | Proper error responses with JSON body | P0 | Implemented |
| FR-3.7 | Input sanitization (XSS prevention) | P0 | Implemented |

### FR-4: Planned Features

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| FR-4.1 | Filter todos by status (all/active/completed) | P1 | Planned |
| FR-4.2 | Due dates on todos | P2 | Planned |
| FR-4.3 | Priority levels (low/medium/high) | P2 | Planned |
| FR-4.4 | Bulk mark all as complete | P2 | Planned |
| FR-4.5 | Clear all completed todos | P2 | Planned |
| FR-4.6 | Light/dark theme toggle | P2 | Planned |
| FR-4.7 | Text search across todos | P2 | Planned |

## Non-Functional Requirements

### Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| API response time | < 100ms | All endpoints under normal load |
| Frontend frame rate | 60fps (< 16ms) | During animations and interactions |
| Page load (cold) | < 2 seconds | Lighthouse performance audit |
| Bundle size | < 200KB gzipped | Vite build output |

### Security

- CORS configured to allow only the frontend origin
- Helmet.js headers on all API responses
- Input sanitization on all user-provided text
- No sensitive data stored (no auth, no PII)
- Dependencies audited for known vulnerabilities

### Accessibility (WCAG AA)

- All interactive elements keyboard navigable
- Screen reader support with proper ARIA labels and roles
- Color contrast ratio >= 4.5:1 for all text
- Touch targets >= 44x44px on mobile
- No information conveyed by color alone
- Focus indicators visible on all interactive elements
- Live region announcements for dynamic content (error banner)

### Reliability

- JSON file persistence with atomic writes
- Graceful error handling — API failures show user-friendly messages
- App does not crash on network failures
- Data integrity maintained across server restarts

### Developer Experience

- ESM modules throughout (`"type": "module"`)
- Hot module replacement via Vite
- Single-command Docker deployment (`docker-compose up --build`)
- Co-located test files in `tests/` directories
- Clear project structure documented in README

## Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Frontend | React | 18 | Component model, ecosystem, portfolio relevance |
| Build | Vite | Latest | Fast HMR, ESM-native, minimal config |
| Backend | Express.js | Latest | Simple, widely understood, quick to ship |
| Storage | JSON file | N/A | Zero config, no native deps, single-user appropriate |
| Unit/Integration | Vitest | Latest | Fast, ESM-native, Jest-compatible API |
| Component Testing | Testing Library | Latest | User-centric testing philosophy |
| E2E | Playwright | Latest | Cross-browser, reliable, good DX |
| Container | Docker + nginx | Latest | Multi-stage builds, reverse proxy, gzip |
| Styling | Custom CSS | N/A | Full control, no framework overhead |

## Constraints & Assumptions

### Constraints

- Single-user application — no authentication required
- JSON file storage — not designed for concurrent access
- Must run via `docker-compose up` as a single command
- WCAG AA compliance required (not AAA)
- No server-side rendering — SPA only

### Assumptions

- Users have a modern browser (last 2 versions of Chrome, Firefox, Safari, Edge)
- Single user accesses the app at a time
- Todo list stays under ~1000 items (JSON file performance limit)
- Network connectivity is available (no offline mode in MVP)

## Out of Scope

- User authentication / multi-user support
- Real-time collaboration or sync
- Push notifications
- Offline/PWA capabilities (vision phase only)
- Native mobile app
- Server-side rendering
- Database migration to SQL/NoSQL (unless JSON file proves insufficient)
