# Data Detective

[![CI](https://github.com/k-divyanshu/data-detective/actions/workflows/ci.yml/badge.svg)](https://github.com/k-divyanshu/data-detective/actions/workflows/ci.yml)

**Live demo: https://peaceful-chimera-357349.netlify.app**

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
| Resources | 77 free resources, each verified and labelled OFFICIAL or COMMUNITY; filter by type and exam domain |
| Study plan | A day-by-day schedule built from the exam weights, your accuracy and weak areas, and the time you have |
| Practice | 139 questions; choose domain, difficulty and count; instant feedback with why each wrong option is wrong |
| Mock exams | 10-question, 25-question and full 53-question (120 min) mocks, drawn fresh each time in proportion to the exam weights; navigator, mark-for-review, domain-level results |
| Tips / Notes | Add, upvote, save and report tips; private notes linked to domains, resources or questions |

Honest limits:
- Exam details come from the official **Exam Guide v1.0 (July 2026)** and certification FAQ, checked
  2026-09-30. The exam is currently open only to people at Claude Partner Network organizations.
- Practice questions are **AI-generated study aids** based on the published objectives and checked against
  the official documentation. They are not real exam questions, and scores do not predict exam results.
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

A challenge is a plain data object (`ChallengeDefinition`), rendered by one generic `ChallengeView`:

1. Add its synthetic data in `src/tracks/data-engineering/data/` and, if you need a computed result,
   an analysis function with a test in `.../utils/`.
2. Create `src/tracks/data-engineering/challenges/<name>.tsx` exporting a `ChallengeDefinition`: title,
   category, difficulty, the problem text, summary statistics, tables (`defineTable`), SQL playground tables
   and suggested queries, questions, and the lesson (headings, paragraphs, lists, code blocks). Text fields
   accept `` `code` `` and `*emphasis*`. Copy an existing definition as a starting point.
3. Add it to the list in `src/tracks/data-engineering/challenges/index.ts`. The challenge list, routing,
   progress tracking and cards pick it up automatically.

`challenges.test.ts` checks every definition and actually runs each suggested query and reference answer
in SQLite.

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

## Deployment

The app is a static site hosted on Netlify, which redeploys on every push to `main`. `netlify.toml`
sets the build (`npm run build` in `frontend/`, publish `dist`), and `frontend/public/_redirects`
makes deep links such as `/claude/practice` survive a page refresh. Any static host works with the
same two settings: build command `npm run build` and output folder `frontend/dist`.

## Roadmap ideas

- Claude track: more questions per domain, tick-off progress on the study plan
- More challenges: join fan-out, late-arriving data, schema drift
- Optional backend for accounts and cross-device progress
