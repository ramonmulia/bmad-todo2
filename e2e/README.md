# Todo App — E2E Tests

End-to-end tests using Playwright, covering all core user journeys.

## Tech Stack

- **Playwright** — Browser automation
- **Chromium** — Default test browser

## Running Tests

```bash
# From the project root (starts both servers automatically)
npx playwright test

# With UI mode
npx playwright test --ui

# Run a specific test
npx playwright test -g "Create a new todo"
```

Playwright is configured to automatically start the backend and frontend dev servers before running tests (see `playwright.config.js` in the project root).

## Test Coverage

| # | Test | What it verifies |
|---|------|-----------------|
| 1 | Page loads and shows app title | Initial render |
| 2 | Shows empty state | Empty todo list display |
| 3 | Create a new todo | Add todo flow + input clearing |
| 4 | Complete and uncomplete a todo | Toggle + persistence after refresh |
| 5 | Delete a todo | Remove todo + persistence after refresh |
| 6 | Prevents adding empty todos | Validation (disabled button) |
| 7 | Multiple todos with counter | List rendering + active counter |
| 8 | Keyboard navigation | Tab focus order |

## Configuration

Test configuration lives in `playwright.config.js` at the project root:
- Base URL: `http://localhost:3000`
- Headless by default
- Screenshots on failure
- 1 retry on failure
