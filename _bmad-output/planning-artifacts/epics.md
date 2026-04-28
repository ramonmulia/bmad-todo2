---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md"]
---

# todo-app 2 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for todo-app 2, decomposing the requirements from the PRD, Architecture, and UX Design Specification into implementable stories. The current MVP (CRUD, dark theme, basic tests) is already implemented. These epics cover the **growth phase** features.

## Requirements Inventory

### Functional Requirements

FR1: Filter todos by status — all, active, completed (PRD FR-4.1)
FR2: Due dates on todos with visual indicators (PRD FR-4.2)
FR3: Priority levels — low, medium, high — with visual indicators (PRD FR-4.3)
FR4: Bulk mark all todos as complete (PRD FR-4.4)
FR5: Clear all completed todos (PRD FR-4.5)
FR6: Light/dark theme toggle with persistence (PRD FR-4.6)
FR7: Text search across todo items (PRD FR-4.7)

### Non-Functional Requirements

NFR1: Backend test coverage >= 80%
NFR2: Frontend test coverage >= 70%
NFR3: E2E scenarios 100% passing
NFR4: Lighthouse accessibility score >= 90
NFR5: Lighthouse performance score >= 90
NFR6: API response time < 100ms
NFR7: Page load < 2 seconds
NFR8: Zero critical WCAG AA violations
NFR9: Bundle size < 200KB gzipped

### Additional Requirements

- API must support query parameters for filtering: `GET /api/todos?status=active&q=searchterm`
- New todo fields (due_date, priority) must be optional and backward-compatible
- Bulk action endpoints: `POST /api/todos/complete-all`, `DELETE /api/todos/completed`
- Theme preference persisted to localStorage
- CSS variables swap via class on `<html>` for theme toggle

### UX Design Requirements

UX-DR1: Filter bar component — three toggle buttons (All/Active/Completed) between counter and list
UX-DR2: Due date display — right-aligned in todo item, color-coded (overdue=red, today=orange, future=muted)
UX-DR3: Priority indicator — color-coded left border or dot on todo item (high=red, medium=orange, low=gray)
UX-DR4: Light theme — full CSS variable set for light mode, respects prefers-color-scheme
UX-DR5: Theme toggle — small toggle in header area, right-aligned
UX-DR6: Search input — integrated into or near the filter bar area
UX-DR7: Bulk action buttons — "Complete all" and "Clear completed" below the todo list
UX-DR8: `prefers-reduced-motion` support — disable slideIn and spinner animations

### FR Coverage Map

| Requirement | Epic | Stories |
|-------------|------|---------|
| FR1 (Filter by status) | Epic 1 | 1.1, 1.2 |
| FR7 (Text search) | Epic 1 | 1.3 |
| FR4 (Bulk complete all) | Epic 1 | 1.4 |
| FR5 (Clear completed) | Epic 1 | 1.4 |
| FR2 (Due dates) | Epic 2 | 2.1, 2.2 |
| FR3 (Priority levels) | Epic 2 | 2.3, 2.4 |
| DaisyUI migration | Epic 3 | 3.1, 3.2 |
| FR6 (Theme toggle) | Epic 3 | 3.3, 3.4 |
| UX-DR8 (Reduced motion) | Epic 3 | 3.5 |
| NFR1-NFR9 (Quality) | Epic 4 | 4.1, 4.2, 4.3 |

## Epic List

- **Epic 1:** Filtering, Search & Bulk Actions
- **Epic 2:** Task Organization (Due Dates & Priorities)
- **Epic 3:** Theming & Accessibility Polish
- **Epic 4:** Test Coverage & Quality Gates

---

## Epic 1: Filtering, Search & Bulk Actions

**Goal:** Enable users to efficiently manage larger todo lists by filtering, searching, and performing bulk operations.

### Story 1.1: Filter Todos by Status

As a user,
I want to filter my todo list by status (all, active, completed),
So that I can focus on what needs attention.

**Acceptance Criteria:**

**Given** the user has a mix of active and completed todos
**When** the user clicks the "Active" filter button
**Then** only incomplete todos are displayed
**And** the counter updates to reflect the filtered count

**Given** the user has the "Completed" filter active
**When** the user clicks "All"
**Then** all todos are displayed regardless of status

**Given** the user applies a filter
**When** the page is refreshed
**Then** the filter resets to "All" (no persistence needed)

**Implementation Notes:**
- Filter bar sits between counter and todo list (UX-DR1)
- Three toggle buttons: All | Active | Completed
- Active filter highlighted with `--accent` color
- Client-side filtering only — no API changes needed for this story
- Counter text updates: e.g. "3 active · 5 total" vs "3 active (filtered)"

### Story 1.2: API Support for Status Filtering

As a developer,
I want the API to support status filtering via query parameter,
So that filtering can be server-side if the list grows large.

**Acceptance Criteria:**

**Given** the API receives `GET /api/todos?status=active`
**When** the request is processed
**Then** only todos with `completed: false` are returned

**Given** the API receives `GET /api/todos?status=completed`
**When** the request is processed
**Then** only todos with `completed: true` are returned

**Given** the API receives `GET /api/todos` (no status param)
**When** the request is processed
**Then** all todos are returned (backward compatible)

**Given** the API receives `GET /api/todos?status=invalid`
**When** the request is processed
**Then** a 400 error is returned with a descriptive message

**Implementation Notes:**
- Add optional `status` query param to GET /api/todos route
- Validate status values: `all`, `active`, `completed`
- Filter in database.js `getAllTodos()` or in route handler
- Update existing tests, add new filter tests

### Story 1.3: Text Search

As a user,
I want to search my todos by text,
So that I can quickly find a specific task.

**Acceptance Criteria:**

**Given** the user types "grocery" in the search input
**When** the search is applied
**Then** only todos containing "grocery" (case-insensitive) are displayed

**Given** the user clears the search input
**When** the input becomes empty
**Then** all todos are displayed (respecting any active status filter)

**Given** the user searches with no matching results
**When** the search completes
**Then** an empty state message shows "No todos match your search"

**Implementation Notes:**
- Search input near the filter bar (UX-DR6)
- Client-side filtering (search within currently loaded todos)
- Case-insensitive substring match
- Combine with status filter (both apply simultaneously)
- Debounce input by 200ms to avoid excessive re-renders
- API support: `GET /api/todos?q=searchterm` (optional, for future)

### Story 1.4: Bulk Actions

As a user,
I want to mark all todos as complete and clear completed todos in one click,
So that I can manage my list efficiently.

**Acceptance Criteria:**

**Given** the user has active todos in the list
**When** the user clicks "Complete all"
**Then** all todos are marked as completed
**And** the API call `POST /api/todos/complete-all` is made

**Given** the user has completed todos in the list
**When** the user clicks "Clear completed"
**Then** all completed todos are removed
**And** the API call `DELETE /api/todos/completed` is made

**Given** all todos are already completed
**When** the user views the bulk actions
**Then** "Complete all" is disabled or shows as "Uncheck all"

**Given** no completed todos exist
**When** the user views the bulk actions
**Then** "Clear completed" is disabled

**Implementation Notes:**
- Two buttons below the todo list (UX-DR7)
- Backend: new routes `POST /api/todos/complete-all` and `DELETE /api/todos/completed`
- Optimistic UI for both actions
- "Complete all" toggles: if all complete, it uncompletes all

---

## Epic 2: Task Organization (Due Dates & Priorities)

**Goal:** Allow users to add due dates and priority levels to todos for better task planning.

### Story 2.1: Due Date — Backend Support

As a developer,
I want the todo schema to support an optional due date field,
So that the frontend can display and manage due dates.

**Acceptance Criteria:**

**Given** a POST request with `{ text: "Buy milk", due_date: "2026-05-01" }`
**When** the todo is created
**Then** the todo is saved with the `due_date` field

**Given** a POST request with `{ text: "Buy milk" }` (no due_date)
**When** the todo is created
**Then** the todo is saved with `due_date: null` (backward compatible)

**Given** a PATCH request with `{ due_date: "2026-05-15" }`
**When** the todo is updated
**Then** the `due_date` field is updated

**Given** a POST request with `{ text: "Buy milk", due_date: "not-a-date" }`
**When** the request is validated
**Then** a 400 error is returned

**Implementation Notes:**
- Add optional `due_date` field to Todo schema (ISO 8601 date string or null)
- Validate date format in validation middleware
- Existing todos without due_date continue to work (null default)

### Story 2.2: Due Date — Frontend Display & Input

As a user,
I want to set and see due dates on my todos,
So that I can track deadlines.

**Acceptance Criteria:**

**Given** the user creates a new todo
**When** they optionally set a due date via a date picker
**Then** the todo is created with that due date

**Given** a todo has a due date in the past
**When** the user views the todo list
**Then** the due date is displayed in red (`--danger` color)

**Given** a todo has a due date of today
**When** the user views the todo list
**Then** the due date is displayed in orange (`--accent` color)

**Given** a todo has a due date in the future
**When** the user views the todo list
**Then** the due date is displayed in muted gray (`--text-muted`)

**Implementation Notes:**
- Date picker input in the TodoInput form (optional field)
- Due date displayed right-aligned in TodoItem before delete button (UX-DR2)
- Format: relative ("Today", "Tomorrow", "3 days ago") or short date
- Date can be removed (set to null) via edit

### Story 2.3: Priority Levels — Backend Support

As a developer,
I want the todo schema to support an optional priority field,
So that the frontend can display and manage priorities.

**Acceptance Criteria:**

**Given** a POST request with `{ text: "Buy milk", priority: "high" }`
**When** the todo is created
**Then** the todo is saved with `priority: "high"`

**Given** a POST request with `{ text: "Buy milk" }` (no priority)
**When** the todo is created
**Then** the todo is saved with `priority: "medium"` (default)

**Given** a POST request with `{ text: "Buy milk", priority: "invalid" }`
**When** the request is validated
**Then** a 400 error is returned

**Implementation Notes:**
- Add `priority` field: enum of `low`, `medium`, `high` (default: `medium`)
- Validate in validation middleware
- Existing todos get `medium` as default

### Story 2.4: Priority Levels — Frontend Display & Input

As a user,
I want to set and see priority levels on my todos,
So that I can focus on what's most important.

**Acceptance Criteria:**

**Given** the user creates a new todo
**When** they optionally set a priority level
**Then** the todo is created with that priority

**Given** a todo has high priority
**When** the user views the todo list
**Then** the todo has a red left border indicator

**Given** a todo has medium priority
**When** the user views the todo list
**Then** the todo has an orange left border indicator

**Given** a todo has low priority
**When** the user views the todo list
**Then** the todo has a gray left border indicator

**Implementation Notes:**
- Priority selector in TodoInput form (dropdown or segmented control)
- Left border color on TodoItem (UX-DR3): high=`--danger`, medium=`--accent`, low=`--text-muted`
- Default priority: medium

---

## Epic 3: Theming & Accessibility Polish

**Goal:** Migrate to DaisyUI component library, add light/dark theme toggle, and refine accessibility to meet all WCAG AA requirements.

### Story 3.1: Install Tailwind CSS + DaisyUI and Configure Theme

As a developer,
I want Tailwind CSS and DaisyUI installed and configured with matching dark theme,
So that the app uses a component library instead of custom CSS.

**Acceptance Criteria:**

**Given** the frontend project
**When** Tailwind CSS and DaisyUI are installed
**Then** the Vite build pipeline processes Tailwind classes correctly

**Given** the current dark theme palette (bg: #0d0d0d, surface: #1a1a1a, accent: #ff6b35, etc.)
**When** the DaisyUI theme is configured
**Then** the custom theme maps to the closest DaisyUI semantic colors (primary, secondary, accent, neutral, base)

**Given** the app renders with DaisyUI
**When** compared to the current design
**Then** the visual appearance is as close as possible to the existing dark theme

**Given** both Tailwind and DaisyUI are installed
**When** existing CSS custom properties are still needed for transition
**Then** they coexist temporarily until Story 3.2 completes the migration

**Implementation Notes:**
- Install: `npm install -D tailwindcss @tailwindcss/vite` and `npm install daisyui`
- Configure `tailwind.config.js` with DaisyUI plugin and custom theme
- DaisyUI theme mapping:
  - `primary` → `#ff6b35` (current `--accent`)
  - `error` → `#e5484d` (current `--danger`)
  - `success` → `#30a46c` (current `--success`)
  - `base-100` → `#0d0d0d` (current `--bg`)
  - `base-200` → `#1a1a1a` (current `--surface`)
  - `base-300` → `#242424` (current `--surface-hover`)
  - `base-content` → `#e8e6e3` (current `--text`)
- Add Tailwind directives to entry CSS file
- Keep `styles/index.css` functional during transition (both systems work)
- Update `frontend/Dockerfile` if build step changes
- Fonts (DM Sans, Space Mono) must remain — load via `@import` or `<link>` in index.html

### Story 3.2: Migrate All Components to DaisyUI and Remove Custom CSS

As a developer,
I want all components migrated from custom CSS classes to DaisyUI/Tailwind classes,
So that `styles/index.css` can be removed and the app uses a single styling system.

**Acceptance Criteria:**

**Given** every component currently using custom CSS classes
**When** migrated to DaisyUI equivalents
**Then** the visual appearance and UX remain the same (or as close as possible)

**Given** the migration is complete
**When** `styles/index.css` is deleted
**Then** the app renders correctly with no missing styles

**Given** the migrated components
**When** tested on mobile (320px) and desktop (1920px)
**Then** responsive behavior matches the current implementation

**Given** all interactive elements
**When** tested with keyboard and screen reader
**Then** accessibility is preserved (ARIA labels, focus states, role="alert")

**Given** existing component tests
**When** the test suite runs
**Then** all tests pass (update selectors if CSS classes changed)

**Implementation Notes:**
- Component migration mapping:
  - **TodoInput form** → DaisyUI `input` + `btn btn-primary`
  - **TodoItem** → DaisyUI `card` or custom flex with `checkbox` + `btn btn-ghost btn-sm`
  - **TodoItem checkbox** → DaisyUI `checkbox checkbox-success`
  - **Error banner** → DaisyUI `alert alert-error`
  - **Loading spinner** → DaisyUI `loading loading-spinner`
  - **Empty state** → Tailwind utility classes (centered text, opacity)
  - **App header** → Tailwind utility classes (font-mono, flex, gap)
  - **Counter** → Tailwind utility classes (font-mono, text-sm, opacity)
- Preserve: 44x44px touch targets, slide-in animation (via Tailwind `animate-` or custom), hover reveal on delete button
- Preserve: DM Sans + Space Mono fonts (configure in `tailwind.config.js` `fontFamily`)
- Delete `frontend/src/styles/index.css` after all components are migrated
- Update `frontend/src/main.jsx` to remove the CSS import (replace with Tailwind entry)
- Update tests: if tests query by CSS class names, update to new DaisyUI/Tailwind classes
- DaisyUI dark theme is set globally — ensure `data-theme="dark"` on `<html>`

### Story 3.3: Light Theme with DaisyUI

As a user,
I want a light theme option,
So that I can use the app in bright environments.

**Acceptance Criteria:**

**Given** the app loads for the first time
**When** the user's system preference is `prefers-color-scheme: light`
**Then** the app renders in light theme

**Given** the app is in dark theme
**When** the user toggles the theme
**Then** all colors swap to the light palette via DaisyUI theme swap
**And** the theme choice is persisted to localStorage

**Given** the user has previously selected light theme
**When** the app loads
**Then** the stored preference is applied regardless of system setting

**Implementation Notes:**
- Define a second DaisyUI theme (light) in `tailwind.config.js` with matching palette
- Use DaisyUI's `data-theme` attribute on `<html>` for theme switching
- Light palette: white/light gray backgrounds, dark text, same primary/error/success colors
- All contrast ratios must still meet WCAG AA in light mode
- No CSS custom properties needed — DaisyUI handles theme variables

### Story 3.4: Theme Toggle Component

As a user,
I want a toggle button to switch between light and dark themes,
So that I can choose my preferred appearance.

**Acceptance Criteria:**

**Given** the app is in dark mode
**When** the user clicks the theme toggle
**Then** the app switches to light mode with smooth transition
**And** an icon indicates the current/target theme (sun/moon)

**Given** the user toggles the theme
**When** localStorage is checked
**Then** the preference is persisted as `theme: "light"` or `theme: "dark"`

**Implementation Notes:**
- Small toggle in header, right-aligned (UX-DR5)
- DaisyUI `swap` component or `toggle` for sun/moon icon swap
- Toggle sets `data-theme` on `<html>` and persists to localStorage
- Read on mount: localStorage → system preference → dark (fallback)
- DaisyUI handles the color transition automatically

### Story 3.5: Reduced Motion & Accessibility Refinements

As a user with motion sensitivity,
I want animations to be disabled when I prefer reduced motion,
So that the app doesn't cause discomfort.

**Acceptance Criteria:**

**Given** the user has `prefers-reduced-motion: reduce` set
**When** the app loads
**Then** the slideIn animation is disabled
**And** the spinner uses a static indicator instead of rotation
**And** all CSS transitions are instant (0s duration)

**Given** the app is audited with axe-core
**When** the audit runs on all screen states
**Then** zero critical or serious violations are found

**Implementation Notes:**
- Tailwind's `motion-reduce:` variant for disabling animations
- DaisyUI loading spinner respects reduced motion by default — verify
- Audit: run axe-core on empty state, list state, error state, loading state
- Fix any violations found during audit
- Test both light and dark themes for accessibility compliance

---

## Epic 4: Test Coverage & Quality Gates

**Goal:** Achieve the coverage targets defined in the PRD and establish quality gates for CI.

### Story 4.1: Backend Test Coverage to 80%+

As a developer,
I want backend test coverage at 80% or higher,
So that the codebase is reliable and regressions are caught.

**Acceptance Criteria:**

**Given** the backend test suite runs with coverage
**When** `npm run test:coverage` completes
**Then** line coverage is >= 80%
**And** branch coverage is >= 75%

**Given** new features from Epics 1-3 are implemented
**When** tests are written for new routes and validation
**Then** each new endpoint has at least happy path + error path tests

**Implementation Notes:**
- Cover new routes: status filter, search query, bulk actions, due_date/priority validation
- Cover edge cases: invalid query params, empty bulk operations
- Cover database.js: filter logic, new fields

### Story 4.2: Frontend Test Coverage to 70%+

As a developer,
I want frontend test coverage at 70% or higher,
So that component behavior is verified.

**Acceptance Criteria:**

**Given** the frontend test suite runs with coverage
**When** `npm run test:coverage` completes
**Then** line coverage is >= 70%

**Given** new components from Epics 1-3 are implemented
**When** tests are written for new components
**Then** FilterBar, SearchInput, ThemeToggle, BulkActions, and updated TodoItem all have tests

**Implementation Notes:**
- Test new components: FilterBar, SearchInput, ThemeToggle, BulkActions
- Test updated components: TodoItem (due date display, priority indicator)
- Test useTodos hook: filter state, search state, bulk action calls
- Mock API calls in component tests

### Story 4.3: E2E Test Suite Expansion

As a developer,
I want comprehensive E2E tests covering all new features,
So that full user journeys are validated.

**Acceptance Criteria:**

**Given** the E2E test suite runs
**When** all tests complete
**Then** 100% of scenarios pass

**Given** new features exist (filter, search, bulk, due dates, priorities, theme)
**When** E2E scenarios are written
**Then** each feature has at least one complete user journey test

**Given** the accessibility audit runs in E2E
**When** axe-core scans the page
**Then** zero critical violations are found

**Implementation Notes:**
- New E2E scenarios: filter by status, search, bulk complete, bulk clear, add due date, set priority, toggle theme
- Accessibility: add axe-core scan to existing E2E setup
- Test across both themes (light + dark)
