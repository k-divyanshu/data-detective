# Data Detective

An interactive learning app for data engineers. Instead of reading about data problems, you
investigate them: inspect a broken dataset, write SQL against it in the browser, and answer
questions about what went wrong.

Everything runs locally in the browser. There is no backend, database or account: datasets are
synthetic, SQL runs on [SQLite compiled to WebAssembly](https://github.com/sql-js/sql.js), and
progress is stored in `localStorage`.

## Challenges

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

## Project structure

```
frontend/src/
  data/         Synthetic datasets and the challenge list
  utils/        Pure logic: duplicate/missing-ID/join/revenue analysis, streaks,
                the SQL engine and result comparison (most have .test.ts files)
  components/   Reusable UI (DataTable, SqlRunner, AnswerForm, ...) and one
                component per challenge plus its lesson
  pages/        One file per route
  progress/     Progress state saved to localStorage (completions, streak)
  types.ts      Shared TypeScript types
```

## Adding a challenge

1. Add its synthetic data in `src/data/` and, if needed, an analysis function with a test in
   `src/utils/`.
2. Create `<Name>Challenge.tsx` and `<Name>LearningSection.tsx` in `src/components/`. Copy an
   existing challenge as a starting point.
3. Add an entry to `src/data/challenges.ts` (set `available: true`).
4. Register the component in `challengeViews` in `src/pages/ChallengeDetailPage.tsx`.

SQL questions are graded by running the learner's query and a reference query on the same data.
Row order and column names are ignored; values and row and column counts must match.

## How progress works

Completing every question in a challenge marks it complete. The streak counts consecutive days
on which you solved something. All of it lives in your browser's `localStorage` (keys starting
with `data-detective-`), so clearing site data resets it, and the Progress page has a reset button.

## Roadmap ideas

- Define challenges as data and render them with one generic component
- More challenges: join fan-out, late-arriving data, schema drift
- Optional backend for accounts and cross-device progress
