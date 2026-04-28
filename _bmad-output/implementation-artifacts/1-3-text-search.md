# Story 1.3: Text Search

Status: review

## Story

As a user,
I want to search my todos by text,
so that I can quickly find a specific task.

## Acceptance Criteria

1. **Given** the user types "grocery" in the search input, **When** the search is applied, **Then** only todos containing "grocery" (case-insensitive) are displayed.

2. **Given** the user clears the search input, **When** the input becomes empty, **Then** all todos are displayed (respecting any active status filter).

3. **Given** the user searches with no matching results, **When** the search completes, **Then** an empty state message shows "No todos match your search".

## Tasks / Subtasks

- [ ] **Task 1: Create SearchInput component**
- [ ] **Task 2: Add search state to useTodos hook**
- [ ] **Task 3: Integrate SearchInput into App.jsx**
- [ ] **Task 4: Add SearchInput CSS**
- [ ] **Task 5: Write tests**

## Dev Notes

### Files to Modify

| File | Action | What Changes |
|------|--------|-------------|
| `frontend/src/components/SearchInput.jsx` | NEW | Search input component |
| `frontend/src/hooks/useTodos.js` | UPDATE | Add search state + combine with filter |
| `frontend/src/App.jsx` | UPDATE | Integrate SearchInput |
| `frontend/src/styles/index.css` | UPDATE | Add search input styles |
| `frontend/tests/components.test.jsx` | UPDATE | Add search tests |

## Dev Agent Record

### Completion Notes List

### File List
