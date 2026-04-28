# BMAD Commands Guide — Todo App

## What's installed in your project

Your project now has a `_bmad/` folder with the full BMad Method framework.
This is what the official `npx bmad-method install` creates — we built it
from the GitHub repo directly.

```
todo-app/
├── _bmad/                          ← The BMAD framework lives here
│   ├── config.toml                 ← Global config (your name, language)
│   ├── _config/
│   │   └── bmad-help.csv           ← Master catalog of all skills + phases
│   ├── core/                       ← Core skills (help, brainstorming, review)
│   │   ├── bmad-help/              ← "What do I do next?"
│   │   ├── bmad-brainstorming/     ← Guided ideation
│   │   ├── bmad-review-*/          ← Adversarial review tools
│   │   └── ...
│   ├── bmm/                        ← BMad Method module (the main workflow)
│   │   ├── config.yaml             ← Module config (project name, output paths)
│   │   ├── 2-plan-workflows/       ← Phase 2: Planning agents + skills
│   │   │   ├── bmad-agent-pm/      ← "John" the Product Manager
│   │   │   ├── bmad-create-prd/    ← PRD creation workflow
│   │   │   └── ...
│   │   ├── 3-solutioning/          ← Phase 3: Architecture + stories
│   │   │   ├── bmad-agent-architect/ ← "Winston" the Architect
│   │   │   ├── bmad-create-architecture/
│   │   │   ├── bmad-create-epics-and-stories/
│   │   │   └── ...
│   │   └── 4-implementation/       ← Phase 4: Build it
│   │       ├── bmad-agent-dev/     ← "Amelia" the Developer
│   │       ├── bmad-sprint-planning/
│   │       ├── bmad-dev-story/
│   │       └── ...
│   ├── scripts/                    ← Shared Python scripts
│   └── custom/                     ← Your customizations (empty for now)
├── _bmad-output/                   ← Where BMAD saves its artifacts
│   ├── planning-artifacts/         ← PRD, architecture, epics go here
│   └── implementation-artifacts/   ← Sprint plans, stories go here
└── ... (your app code)
```

---

## The 6 Named Agents

Each agent has a personality and a specific job:

| Agent | Name | Icon | What they do |
|-------|------|------|-------------|
| `bmad-agent-analyst` | Mary | 📊 | Research and analysis |
| `bmad-agent-pm` | John | 📋 | Creates PRDs and requirements |
| `bmad-agent-ux-designer` | Sally | 🎨 | UX design and wireframes |
| `bmad-agent-architect` | Winston | 🏗️ | Technical architecture decisions |
| `bmad-agent-dev` | Amelia | 💻 | Writes and tests code |
| `bmad-agent-tech-writer` | Paige | 📚 | Documentation and diagrams |

---

## Commands to run (in order)

Open your project folder in Claude Code, Cursor, or any AI IDE.
Run each command in a **fresh chat** (don't mix them in one conversation).

### Step 0: Get oriented
```
bmad-help
```
This scans your project and tells you what to do first.

### Step 1: Analysis (optional but helpful)
```
bmad-brainstorming
```
Guided brainstorming session about your product idea.

```
bmad-product-brief
```
Creates a structured product brief from your idea.

### Step 2: Planning (required)
```
bmad-agent-pm
```
This activates John (PM). He'll show you a menu. Pick "Create PRD" or say:
```
hey John, let's write the PRD
```
He'll interview you about your product and produce a `PRD.md` file
in `_bmad-output/planning-artifacts/`.

After the PRD, optionally:
```
bmad-validate-prd
```
Checks your PRD for gaps and inconsistencies.

```
bmad-create-ux-design
```
If your app has a UI, Sally will design the UX.

### Step 3: Solutioning (required)
```
bmad-agent-architect
```
This activates Winston (Architect). He'll ask about tech stack, API design,
database choices, etc. and produce an architecture document.

Or go directly:
```
bmad-create-architecture
```

Then:
```
bmad-create-epics-and-stories
```
John (PM) breaks the PRD + architecture into epics and user stories.

Then:
```
bmad-check-implementation-readiness
```
Verifies everything is aligned before you start coding.

### Step 4: Implementation
```
bmad-sprint-planning
```
Creates a sprint plan with stories in order.

```
bmad-create-story
```
Prepares the first story with full implementation context.

```
bmad-dev-story
```
Amelia (Developer) implements the story — writes code + tests.

```
bmad-code-review
```
Reviews the implemented code. If issues, goes back to dev-story.
If approved, moves to the next story.

```
bmad-qa-generate-e2e-tests
```
Generates E2E tests for what's been built.

```
bmad-retrospective
```
At the end of an epic — reviews what went well and what didn't.

### Anytime commands
```
bmad-help              → "what should I do next?"
bmad-sprint-status     → "where are we in the sprint?"
bmad-correct-course    → "we need to change direction"
bmad-quick-dev         → skip the full process, just build something fast
```

---

## The workflow at a glance

```
bmad-help  →  "start with bmad-create-prd"
                    ↓
            bmad-create-prd  (John writes PRD)
                    ↓
         bmad-create-architecture  (Winston designs system)
                    ↓
       bmad-create-epics-and-stories  (John breaks into stories)
                    ↓
      bmad-check-implementation-readiness  (sanity check)
                    ↓
           bmad-sprint-planning  (plan the sprint)
                    ↓
         ┌─→ bmad-create-story  (prepare story)
         │          ↓
         │   bmad-dev-story  (Amelia codes it)
         │          ↓
         │   bmad-code-review  (review code)
         │          ↓
         └── next story... or bmad-retrospective
```

Each step saves its output to `_bmad-output/`. The next step reads
those files as context, so each agent knows what the previous one decided.

---

## How to use this with Claude Code (recommended)

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. `cd todo-app`
3. `claude` (starts Claude Code)
4. Type: `bmad-help`
5. Follow the guidance from there

Claude Code reads the `_bmad/` folder automatically and understands
the skill files. Each `bmad-*` command loads the right agent with
the right instructions.
