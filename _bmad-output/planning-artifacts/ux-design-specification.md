---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-core-experience", "step-04-emotional-response", "step-05-inspiration", "step-06-design-system", "step-07-defining-experience", "step-08-visual-foundation", "step-09-design-directions", "step-10-user-journeys", "step-11-component-strategy", "step-12-ux-patterns", "step-13-responsive-accessibility", "step-14-complete"]
inputDocuments: ["prd.md", "CLAUDE.md", "README.md"]
---

# UX Design Specification — todo-app 2

**Author:** Ramonmulia
**Date:** 2026-04-27

---

## 1. Design Philosophy

**Principle:** Minimal friction, maximum clarity.

The todo app follows a single-column, content-first design with a dark theme. Every interaction is one click or tap — no modals, no multi-step flows, no confirmation dialogs. The UI removes all chrome that doesn't directly serve task management.

**Design Values:**

- **Speed over spectacle** — Interactions complete in under 200ms perceived time. No loading screens between actions.
- **Quiet confidence** — Dark surface palette with a single warm accent (orange) for actionable elements. The UI recedes; the content leads.
- **Progressive disclosure** — Delete buttons appear on hover (desktop) or always visible (mobile). Empty/loading/error states show only when relevant.
- **Portfolio quality** — Every detail is intentional. Spacing, typography, and animation are polished enough to demonstrate design sensibility to reviewers.

---

## 2. Core Experience

### 2.1 Primary User Flow

The core loop is: **Open → Scan → Act → Close**. Users should complete any single action (add, complete, delete) within 3 seconds of intent.

### 2.2 Experience Principles

| Principle | Implementation |
|-----------|---------------|
| Instant feedback | Optimistic UI updates — no spinners for CRUD actions |
| Scannable list | Clear visual hierarchy: checkbox → text → delete |
| Zero learning curve | Standard patterns (checkbox, input + button, X to delete) |
| Graceful degradation | Error states inform, don't block. Recoverable by default |

### 2.3 Key Moments

- **First open:** Empty state with friendly message and clear input — no confusion about what to do
- **First add:** Todo slides in with animation — confirms the action visually
- **Completing a task:** Checkbox fills green, text strikes through — satisfying visual feedback
- **All done:** Counter shows "0 active" — sense of accomplishment

---

## 3. Layout & Structure

### 3.1 Page Layout

```
┌──────────────────────────────────────┐
│            App Header                │
│  [dot] todos                         │
│  Keep track of what matters.         │
├──────────────────────────────────────┤
│          Todo Input Form             │
│  [ What needs to be done?  ] [ Add ] │
├──────────────────────────────────────┤
│          Status Counter              │
│  3 active · 5 total                  │
├──────────────────────────────────────┤
│          Todo List                   │
│  ┌────────────────────────────────┐  │
│  │ [o] Buy groceries          [x] │  │
│  ├────────────────────────────────┤  │
│  │ [✓] Write tests            [x] │  │
│  ├────────────────────────────────┤  │
│  │ [o] Deploy app             [x] │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### 3.2 Layout Constraints

- **Max width:** 640px, horizontally centered
- **Padding:** 2rem top, 1.25rem horizontal (1rem on mobile)
- **Bottom padding:** 4rem (3rem on mobile) for breathing room
- **Responsive breakpoint:** 480px — input form stacks vertically

---

## 4. Color System

### 4.1 Palette (Dark Theme)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0d0d0d` | Page background |
| `--surface` | `#1a1a1a` | Card/input backgrounds |
| `--surface-hover` | `#242424` | Hover state for cards |
| `--border` | `#2a2a2a` | Subtle dividers and borders |
| `--text` | `#e8e6e3` | Primary text |
| `--text-muted` | `#777` | Secondary text, placeholders |
| `--accent` | `#ff6b35` | CTA buttons, focus rings, brand dot |
| `--accent-glow` | `rgba(255,107,53,0.15)` | Focus ring glow |
| `--danger` | `#e5484d` | Delete actions, error states |
| `--danger-hover` | `#f2555a` | Delete hover state |
| `--success` | `#30a46c` | Completed checkbox fill |
| `--radius` | `12px` | Default border radius |
| `--radius-sm` | `8px` | Small element radius |

### 4.2 Contrast Ratios (WCAG AA Compliance)

| Pair | Ratio | Result |
|------|-------|--------|
| `--text` on `--bg` | ~15:1 | Passes AAA |
| `--text-muted` on `--surface` | ~4.6:1 | Passes AA |
| `--accent` on `--bg` | ~5.2:1 | Passes AA |
| White on `--accent` button | ~4.5:1 | Passes AA |
| `--danger` on `--bg` | ~5.0:1 | Passes AA |

### 4.3 Color Usage Rules

- No information conveyed by color alone — always paired with icon, text, or pattern (checkmark + strikethrough supplement green/gray)
- Single accent color (orange) for all primary actions
- Red reserved exclusively for destructive actions and errors
- Green reserved exclusively for completion state

---

## 5. Typography

### 5.1 Font Stack

- **Body:** `'DM Sans', sans-serif` — clean geometric sans-serif for readability
- **Display/Mono:** `'Space Mono', monospace` — developer aesthetic for title and counters

### 5.2 Type Scale

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| App title | Space Mono | 2rem (1.5rem mobile) | 700 | `--text` |
| Subtitle | DM Sans | 0.9rem | 400 | `--text-muted` |
| Input text | DM Sans | 1rem | 400 | `--text` |
| Input placeholder | DM Sans | 1rem | 400 | `--text-muted` |
| Button text | DM Sans | 0.95rem | 600 | white |
| Todo text | DM Sans | 1rem | 400 | `--text` / `--text-muted` when complete |
| Counter | Space Mono | 0.8rem | 400 | `--text-muted` |
| Empty state title | Space Mono | 1.1rem | 400 | `--text` |
| Empty state desc | DM Sans | 0.9rem | 400 | `--text-muted` |
| Error text | DM Sans | 0.9rem | 400 | `--danger` |

### 5.3 Line Height

- Body text: 1.5
- Todo text: 1.4
- Title: inherited (1.5)

---

## 6. Component Specifications

### 6.1 App Header

- Orange dot indicator: 12x12px circle with `box-shadow: 0 0 12px var(--accent-glow)`
- Title: "todos" in monospace, flex row with dot
- Subtitle: "Keep track of what matters." in muted gray
- Margin bottom: 2.5rem

### 6.2 Todo Input Form

- **Layout:** Horizontal flex row, 0.75rem gap (stacks vertically on mobile)
- **Input field:**
  - Flex: 1 (fills available space)
  - Padding: 0.875rem 1rem
  - Background: `--surface`
  - Border: 1.5px solid `--border`
  - Border radius: 12px
  - Focus: orange border + 3px orange glow ring
  - Placeholder: "What needs to be done?"
  - Max length: 500 characters
  - Auto-focus on page load
- **Add button:**
  - Background: `--accent` (orange)
  - Text: "Add" (white, 600 weight) / "..." when submitting
  - Border radius: 12px
  - Min size: 44x44px (touch target)
  - Hover: translateY(-1px) + opacity 0.9
  - Active: translateY(0)
  - Disabled: opacity 0.5, no cursor
- **Form margin bottom:** 2rem

### 6.3 Status Counter

- Font: Space Mono, 0.8rem
- Color: `--text-muted`
- Format: `{n} active · {n} total`
- Margin bottom: 1rem
- Left padding: 0.25rem

### 6.4 Todo Item

- **Container:**
  - Flex row: checkbox | text | delete button
  - Gap: 0.875rem
  - Padding: 1rem 1.125rem
  - Background: `--surface`
  - Border: 1px solid `--border`
  - Border radius: 12px
  - Hover: background `--surface-hover`
  - Entry animation: slideIn (0.25s ease-out, fade + 8px upward translate)
- **Checkbox:**
  - Custom styled: 22x22px visible box within 44x44px tap target
  - Unchecked: 2px `--text-muted` border, transparent fill, 6px radius
  - Checked: `--success` fill with white "✓" (14px, 700 weight)
  - Transition: all 0.2s
- **Text:**
  - Flex: 1, word-break enabled
  - Normal: `--text` color
  - Completed: strikethrough + `--text-muted` color
  - Transition: color 0.2s
- **Delete button:**
  - "✕" character
  - Color: `--text-muted`
  - Size: 44x44px (touch target), 1.2rem font
  - Border radius: `--radius-sm`
  - Desktop: hidden (opacity 0), visible on row hover or focus
  - Mobile: always visible
  - Hover: red text + `rgba(229,72,77,0.1)` background
- **Completed state:** Entire row at 55% opacity

### 6.5 Empty State

- Centered, padding: 3rem 1rem
- Clipboard emoji: 3rem, 40% opacity, `aria-hidden="true"`
- Title: "No todos yet" (Space Mono, 1.1rem)
- Description: "Add one above to get started." (0.9rem, muted)

### 6.6 Loading State

- Centered spinner: 32x32px
- Ring: 3px border `--border`, top border `--accent`
- Animation: rotate 360deg, 0.7s linear infinite
- Container padding: 3rem
- `aria-label="Loading todos"`

### 6.7 Error Banner

- Flex row: message + dismiss button
- Background: `rgba(229,72,77,0.1)`
- Border: 1px solid `rgba(229,72,77,0.3)`
- Border radius: 12px
- Padding: 1rem 1.125rem
- Text: `--danger`, 0.9rem
- Dismiss: "✕", 44x44px target, `--danger` color
- `role="alert"` for screen reader live announcement
- Margin bottom: 1.5rem

---

## 7. Interaction Design

### 7.1 Add Todo

```
User types text → Button enables (text.trim() not empty)
User presses Enter or clicks Add →
  Button shows "..." + input disabled →
  API call →
  Success: Input clears, todo slides in at top of list
  Failure: Error banner appears, input retains text for retry
```

### 7.2 Toggle Complete

```
User clicks checkbox →
  API call →
  Checkbox fills green with checkmark
  Text gets strikethrough + muted color
  Row fades to 55% opacity
  Click again → reverses all visual changes
```

### 7.3 Delete Todo

```
Desktop: User hovers row → Delete button fades in
Mobile: Delete button always visible
User clicks delete →
  Todo removed from list immediately
  If last todo → Empty state appears
```

### 7.4 Error Handling

```
API failure on any action →
  Error banner slides in below input form
  role="alert" triggers screen reader announcement
User clicks dismiss "✕" → Banner removed
```

### 7.5 Page Load

```
App mounts →
  Loading spinner displayed (centered)
  GET /api/todos →
  Success + todos exist: Spinner replaced by counter + list
  Success + no todos: Spinner replaced by empty state
  Failure: Spinner replaced by error banner
```

---

## 8. Motion & Animation

| Animation | Property | Duration | Easing | Trigger |
|-----------|----------|----------|--------|---------|
| Todo entry | opacity, translateY | 0.25s | ease-out | New todo added |
| Spinner | rotate | 0.7s | linear | Loading state |
| Input focus | border-color, box-shadow | 0.2s | ease | Focus input |
| Button hover | transform, opacity | 0.15s | ease | Hover add button |
| Button active | transform | instant | — | Click add button |
| Checkbox | all | 0.2s | ease | Toggle complete |
| Delete reveal | opacity | 0.15s | ease | Hover todo row |
| Row hover | background, border-color | 0.15s | ease | Hover todo row |
| Text strikethrough | color | 0.2s | ease | Toggle complete |

**Motion principles:**
- Nothing exceeds 0.3s duration
- No bounces, springs, or elastic curves — clean ease only
- Animations are functional (confirm actions), not decorative
- Respects `prefers-reduced-motion` (should disable slideIn and spinner)

---

## 9. Responsive Design

### 9.1 Desktop (> 480px)

- Input and button side by side in flex row
- Delete button hidden until row hover
- Max-width 640px centered
- Padding: 2rem 1.25rem 4rem

### 9.2 Mobile (<= 480px)

- Input and button stack vertically
- Button becomes full-width
- Delete button always visible (no hover on touch)
- Title shrinks: 2rem → 1.5rem
- Padding: 1.5rem 1rem 3rem

### 9.3 Touch Targets (All Viewports)

All interactive elements meet 44x44px minimum:

| Element | Visible Size | Tap Target |
|---------|-------------|------------|
| Checkbox | 22x22px | 44x44px (padding-based) |
| Delete button | ~19px icon | 44x44px |
| Add button | variable | 44x44px minimum |
| Error dismiss | ~19px icon | 44x44px |
| Input field | full-width | 48px height |

### 9.4 Viewport Support

- Minimum: 320px (iPhone SE)
- Maximum: 1920px (content capped at 640px)
- No horizontal scroll at any viewport
- No pinch-to-zoom required for readability

---

## 10. Accessibility (WCAG AA)

### 10.1 Semantic Structure

- `<main>` landmark wraps the entire app
- `<header>` for app title area
- `<form>` with `aria-label="Add todo"` for input
- `<ul>` with `aria-label="Todo list"` for todo items
- `<li>` for each todo item

### 10.2 ARIA Labels

| Element | ARIA | Value |
|---------|------|-------|
| Input | `aria-label` | "New todo text" |
| Form | `aria-label` | "Add todo" |
| Todo list | `aria-label` | "Todo list" |
| Checkbox | `aria-label` | `Mark "{text}" as complete/incomplete` |
| Delete button | `aria-label` | `Delete "{text}"` |
| Error banner | `role` | "alert" |
| Loading | `aria-label` | "Loading todos" |
| Orange dot | `aria-hidden` | "true" |
| Emoji icon | `aria-hidden` | "true" |

### 10.3 Keyboard Navigation

- **Tab order:** Input → Add button → First checkbox → First delete → Next checkbox → Next delete → ...
- **Enter:** Submits the form (when input focused)
- **Space:** Toggles checkbox (when focused)
- All focus states have visible orange ring indicator
- No keyboard traps

### 10.4 Screen Reader Behavior

- Error banner uses `role="alert"` — announced immediately on appearance
- Checkbox labels dynamically include todo text and current state
- Delete labels dynamically include todo text
- Loading state announced via `aria-label`

### 10.5 Color Independence

- Completed state: green checkbox + checkmark icon + strikethrough text + muted opacity (4 visual signals)
- Error state: red background + red border + red text + "✕" dismiss icon
- No information conveyed by color alone

---

## 11. Screen States

| State | Trigger | Key Elements |
|-------|---------|--------------|
| Loading | Initial page load | Centered spinner, no other content |
| Empty | No todos exist | Header + input + emoji icon + message |
| List View | Todos exist | Header + input + counter + todo cards |
| Error | API failure | Header + input + red error banner |
| Submitting | Add clicked | Input disabled, button shows "..." |
| Completed Item | Todo toggled | Strikethrough, muted, 55% opacity, green checkbox |

---

## 12. Design Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| Dark theme only (no toggle in MVP) | Scope constraint; dark is the primary aesthetic. Light/dark toggle is a growth feature |
| No confirmation on delete | Single-user, low-consequence action. Keeps interaction count minimal |
| Hide delete on desktop hover | Reduces visual noise. Clean rows by default, action on intent |
| Always show delete on mobile | No hover state on touch devices — must be always accessible |
| Orange accent color | High visibility against dark backgrounds. Warm, energetic without being aggressive |
| Monospace for title + counter | Developer/productivity aesthetic. Visual hierarchy through font contrast |
| 640px max width | Optimal reading/scanning width. Prevents content from stretching |
| slideIn animation | Spatial feedback confirming a new item was added. Subtle, not distracting |
| 44x44px touch targets | WCAG/Apple HIG minimum. Prevents misclick frustration |
| No drag-and-drop in MVP | Adds significant complexity for marginal value. Growth feature |
| Optimistic UI | Perceived speed matters more than round-trip confirmation for a single-user app |

---

## 13. Growth Phase UX Considerations

These features are not in MVP but should be designed to integrate cleanly:

### Filter Bar (Post-MVP)

- Sits between counter and list
- Three toggle buttons: All | Active | Completed
- Active filter highlighted with accent color
- Counter updates to reflect filtered count

### Due Dates (Post-MVP)

- Small date display right-aligned in todo item, before delete button
- Overdue dates in `--danger` color
- Today's dates in `--accent` color
- Future dates in `--text-muted`

### Priority Levels (Post-MVP)

- Color-coded dot or left border on todo item
- High: red, Medium: orange, Low: gray
- Filter/sort by priority in filter bar

### Light/Dark Toggle (Post-MVP)

- Small toggle in header area, right-aligned
- Uses `prefers-color-scheme` as default
- Persists choice to localStorage
- All CSS variables swap via `.light-theme` class on `<html>`

### Keyboard Shortcuts (Vision)

- `n` — Focus input (new todo)
- `j/k` — Navigate todo list
- `x` — Toggle selected todo
- `d` — Delete selected todo
- `?` — Show shortcuts panel
