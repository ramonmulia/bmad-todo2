# Story 1.1: Filter Todos by Status

Status: done

## Story

As a user,
I want to filter my todo list by status (all, active, completed),
so that I can focus on what needs attention.

## Acceptance Criteria

1. **Given** the user has a mix of active and completed todos, **When** the user clicks the "Active" filter button, **Then** only incomplete todos are displayed **And** the counter updates to reflect the filtered count.

2. **Given** the user has the "Completed" filter active, **When** the user clicks "All", **Then** all todos are displayed regardless of status.

3. **Given** the user applies a filter, **When** the page is refreshed, **Then** the filter resets to "All" (no persistence needed).

4. **Given** the user applies a filter, **When** the filtered result is empty, **Then** a contextual empty message is shown (e.g. "No active todos" or "No completed todos").

5. **Given** the filter bar is rendered, **When** the user navigates via keyboard, **Then** each filter button is focusable and activatable via Enter/Space.

## Tasks / Subtasks

- [ ] **Task 1: Create FilterBar component** (AC: 1, 2, 5)
  - [ ] Create `frontend/src/components/FilterBar.jsx`
  - [ ] Three buttons: "All", "Active", "Completed"
  - [ ] Accept `currentFilter` and `onFilterChange` props
  - [ ] Highlight active filter with `--accent` color
  - [ ] Ensure keyboard accessibility (buttons are natively focusable)
  - [ ] Add `aria-pressed` attribute to indicate active filter

- [ ] **Task 2: Add filter state to useTodos hook** (AC: 1, 2, 3)
  - [ ] Add `filter` state (`'all' | 'active' | 'completed'`) with default `'all'`
  - [ ] Add `setFilter` function
  - [ ] Add `filteredTodos` computed value that applies filter to `todos`
  - [ ] Export `filter`, `setFilter`, and `filteredTodos`

- [ ] **Task 3: Integrate FilterBar into App.jsx** (AC: 1, 2, 4)
  - [ ] Import and render `FilterBar` between counter and todo list
  - [ ] Pass `filter` and `setFilter` from `useTodos`
  - [ ] Change `TodoList` to render `filteredTodos` instead of `todos`
  - [ ] Update counter to show filtered context (e.g. "3 active · 5 total")
  - [ ] Handle filtered empty state with contextual message

- [ ] **Task 4: Add FilterBar CSS** (AC: 1, 2)
  - [ ] Add styles to `frontend/src/styles/index.css`
  - [ ] Filter bar layout: horizontal flex, gap between buttons
  - [ ] Button styles: muted by default, `--accent` when active
  - [ ] Consistent with existing design tokens (radius, spacing, font)
  - [ ] Responsive: buttons remain horizontal on mobile (they're small enough)

- [ ] **Task 5: Write tests** (AC: 1, 2, 3, 4, 5)
  - [ ] Unit test `FilterBar` component: renders 3 buttons, calls onFilterChange, highlights active
  - [ ] Unit test `useTodos` filter logic: all/active/completed filtering
  - [ ] Integration test: FilterBar + App renders filtered list correctly
  - [ ] Test empty filtered state shows contextual message
  - [ ] Test keyboard accessibility of filter buttons

## Dev Notes

### Architecture Compliance

- **Component pattern:** Follow existing pattern — named export function component in `frontend/src/components/`
- **Hook pattern:** Extend `useTodos` in `frontend/src/hooks/useTodos.js` — all state lives here
- **Styling:** Append to existing `frontend/src/styles/index.css` — use CSS custom properties
- **No API changes:** This is client-side filtering only. Story 1.2 adds API filtering later.

### Files to Modify

| File | Action | What Changes |
|------|--------|-------------|
| `frontend/src/components/FilterBar.jsx` | NEW | Filter bar component |
| `frontend/src/hooks/useTodos.js` | UPDATE | Add filter state + filteredTodos |
| `frontend/src/App.jsx` | UPDATE | Add FilterBar, use filteredTodos, update empty state |
| `frontend/src/styles/index.css` | UPDATE | Add .filter-bar, .filter-btn styles |
| `frontend/tests/components.test.jsx` | UPDATE | Add FilterBar + filter integration tests |

### Existing Code Context

**`useTodos.js` current state:**
- Manages `todos`, `loading`, `error` state
- Exports: `addTodo`, `toggleTodo`, `removeTodo`, `dismissError`
- `todos` is the raw array from API — filtering is new
- Optimistic updates for toggle/delete with rollback

**`App.jsx` current state:**
- Uses `todos` directly from `useTodos()` for rendering
- Counter: `{activeCount} active · {todos.length} total`
- Empty state when `todos.length === 0`
- Must preserve: loading state, error banner, empty state for zero todos vs filtered empty

**Key distinction — two types of "empty":**
1. No todos at all → existing empty state with clipboard emoji
2. Todos exist but filter matches none → new contextual message (no emoji, simpler)

### UX Specifications [Source: ux-design-specification.md#13]

- Filter bar sits between counter and todo list
- Three toggle buttons: All | Active | Completed
- Active filter highlighted with `--accent` color
- Counter updates to reflect filtered count
- 44x44px minimum touch targets on filter buttons

### Testing Standards

- Use Vitest + Testing Library (matches existing setup)
- Test file: `frontend/tests/components.test.jsx` (co-located)
- Mock API with `vi.mock('../src/api.js')`
- Use `render`, `screen`, `fireEvent` from `@testing-library/react`
- Follow existing test patterns in the file

### Anti-Patterns to Avoid

- Do NOT add API query params in this story — that's Story 1.2
- Do NOT persist filter to localStorage — filter resets on refresh per AC
- Do NOT modify `todos` array — compute `filteredTodos` separately
- Do NOT break existing empty state — differentiate "no todos" from "no matches"
- Do NOT use a separate context/provider — keep state in `useTodos` hook

### References

- [Source: epics.md#Story 1.1] — Requirements and acceptance criteria
- [Source: ux-design-specification.md#13] — Growth Phase: Filter Bar spec
- [Source: architecture.md#Frontend Architecture] — Component tree and state management
- [Source: prd.md#FR-4.1] — Filter by status requirement

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
