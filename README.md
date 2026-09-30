# Data Detective

A learning platform with two separate tracks, chosen on the home screen:

- **Data Engineering**: investigate broken datasets, write SQL against them in the browser, and answer
  questions about what went wrong.
- **Claude Developer**: prepare for the Claude Certified Developer – Foundations exam with a verified
  free resource library, practice questions, a timed mock exam, community tips and personal notes.

Data Detective is an independent project and is not affiliated with or endorsed by Anthropic.

Everything runs locally in the browser. There is no backend, database or account: datasets are
synthetic, SQL runs on [SQLite compiled to WebAssembly](https://github.com/sql-js/sql.js), and
progress is stored in `localStorage`.

## Data Engineering challenges

| # | Challenge | Category | Difficulty | Skill |
|---|-----------|----------|------------|-------|
| 1 | Find the Duplicate Orders | Data Quality | Beginner | Detecting duplicate keys, `GROUP BY ... HAVING` |
| 2 | Missing Customer IDs | Data Quality | Beginner | `NULL` vs empty strings, downstream impact |
| 3 | Unexpected Revenue Drop | Data Investigation | Intermediate | Tracing a metric change to a silent pipeline failure |
| 4 | Orders That Vanish After a Join | SQL Joins | Intermediate | `INNER` vs `LEFT JOIN`, anti-joins |

Each challenge has a problem statement, dataset tables, a summary of the symptoms, a SQL
playground, questions (numbers, multiple choice, and SQL graded by running it), hints, and a
short lesson.

## Getting started

Requires Node.js 22.12 or newer (Vitest needs it; Node 24 is what this was developed on).

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with [Oxlint](https://oxc.rs) |
| `npm run typecheck` | Type-check with `tsc -b` |
| `npm test` | Run the unit tests once ([Vitest](https://vitest.dev)) |
| `npm run test:watch` | Run the tests in watch mode |
| `npm run check` | Lint, type-check and test (what CI and the pre-commit hook run) |

`npm install` also enables the git pre-commit hook in `.githooks/`, which runs `npm run check`
before each commit. Skip it once with `git commit --no-verify`.

## Tech stack

- React 19, TypeScript, Vite
- React Router for navigation
- sql.js (SQLite in WebAssembly) for the in-browser SQL playground and answer grading
- Plain CSS with design tokens (dark and light themes), no UI framework
- Vitest for unit tests, GitHub Actions for CI

## Claude Developer track

| Feature | What it does |
|---------|--------------|
| Dashboard | Verified exam facts, domain overview with official weights, progress, streak, weak areas |
| Resources | 71 free resources, each verified and labelled OFFICIAL or COMMUNITY; filter by type and exam domain |
| Practice | Choose domain, difficulty and count; instant feedback with why each wrong option is wrong |
| Mock exam | Timed, with question navigator, mark-for-review, domain-level results and recommended resources |
| Tips / Notes | Add, upvote, save and report tips; private notes linked to domains, resources or questions |

Honest limits:
- Exam details come from the official **Exam Guide v1.0 (July 2026)** and certification FAQ, checked
  2026-09-30. The exam is currently open only to people at Claude Partner Network organizations.
- Practice questions are **AI-generated study aids** based on the published objectives. They are not real
  exam questions, and scores do not predict exam results.
- Tips, votes, notes and progress live in your browser only. There is no server yet.
- Exam data is in `src/tracks/claude/data/` so it can be updated when the exam changes.

## Project structure

```
frontend/src/
  home/                   Track selection screen
  shared/                 UI and hooks used by both tracks (TrackLayout, Badge, storage, streaks)
  tracks/data-engineering/
    data/ utils/ components/ pages/ progress/     Challenges, SQL playground, progress
  tracks/claude/
    data/                 Exam config, resources, questions (one file per domain), mock exams
    utils/ state/ components/ pages/              Filtering, grading, stats, notes, tips, UI
```

## Adding a Data Engineering challenge

1. Add its synthetic data in `src/tracks/data-engineering/data/` and, if needed, an analysis function with
   a test in `.../utils/`.
2. Create `<Name>Challenge.tsx` and `<Name>LearningSection.tsx` in `.../components/`. Copy an
   existing challenge as a starting point.
3. Add an entry to `.../data/challenges.ts` (set `available: true`).
4. Register the component in `challengeViews` in `.../pages/ChallengeDetailPage.tsx`.

SQL questions are graded by running the learner's query and a reference query on the same data.
Row order and column names are ignored; values and row and column counts must match.

## Updating Claude Developer content

- **Resources:** add to `resources.ts` only after checking the URL loads and who publishes it. Set
  `active: false` to retire a dead link. The integrity test fails if an "official" resource is not hosted
  by Anthropic or the MCP project.
- **Questions:** add to the file for its domain. Explain every wrong option and link real resource ids.
- **Exam changes:** edit `data/exam.ts` (domains, weights, facts) and re-check questions and resources.

## How progress works

In Data Engineering, completing every question in a challenge marks it complete. The streak counts consecutive days
on which you solved something. All of it lives in your browser's `localStorage` (keys starting
with `data-detective-`), so clearing site data resets it, and the Progress page has a reset button.

## Roadmap ideas

- Define challenges as data and render them with one generic component
- Claude track: a simple adaptive study plan, more questions per domain, a full-length mock
- More challenges: join fan-out, late-arriving data, schema drift
- Optional backend for accounts and cross-device progress
