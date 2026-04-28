# BMAD Output

Generated artifacts from the BMAD (Build Measure Analyze Deploy) workflow.

## Structure

```
_bmad-output/
├── planning-artifacts/          # Project planning documents
│   ├── prd.md                   # Product Requirements Document
│   ├── architecture.md          # Architecture Document
│   ├── ux-design-specification.md  # UX Design Specification
│   └── epics.md                 # Epics & Stories breakdown
└── implementation-artifacts/    # Development tracking
    ├── sprint-status.yaml       # Sprint status tracker
    └── 1-1-*.md                 # Individual story files
```

## Workflow

1. **PRD** — Define product requirements and success criteria
2. **Architecture** — Document technical decisions and system design
3. **UX Design** — Specify visual design, components, and accessibility
4. **Epics & Stories** — Break work into epics and user stories
5. **Sprint Planning** — Track story status in `sprint-status.yaml`
6. **Dev Story** — Implement stories following the story files
