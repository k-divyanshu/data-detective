# Data Detective

Learning app for data engineers: investigate synthetic datasets, run SQL in the browser, answer
questions. Client-only React app in `frontend/`. The owner is a data engineer new to web dev, so
keep code simple and readable, and briefly explain non-obvious decisions.

## Commands (run from `frontend/`)
- `npm run dev`: dev server at http://localhost:5173
- `npm run check`: lint + type-check + tests. **Run before saying work is done.**
- `npm run build`: type-check + production build (CI also runs this)
- `npm test` / `npm run test:watch`: Vitest (node environment, `src/**/*.test.ts` only)

## Architecture
- `src/data/` synthetic datasets and `challenges.ts` (the challenge list)
- `src/utils/` pure logic (analysis, streaks, SQL engine + result comparison). Tested.
- `src/components/` reusable UI, plus one `<Name>Challenge.tsx` + `<Name>LearningSection.tsx` per challenge
- `src/pages/` one file per route; `src/progress/` progress state in localStorage
- Adding a challenge: follow "Adding a challenge" in `README.md`. Also register it in `challengeViews`
  in `pages/ChallengeDetailPage.tsx`, or it renders as "Coming soon".

## Code conventions
- Strict TypeScript. No `enum` (`erasableSyntaxOnly`); use `import type` for types (`verbatimModuleSyntax`).
- No unused variables or parameters (`noUnusedLocals/Parameters` fail the build).
- Plain CSS with variables in `src/index.css`. No CSS framework or UI library.
- Keep data out of components where practical; put analysis logic in `utils/` with a `.test.ts`.
- Comments only where the reason is non-obvious.

## Gotchas
- `SqlRunner` and SQL questions need a **stable** `tables` array (define it at module level),
  otherwise the in-memory database reloads on every render.
- SQL answers are graded by running the learner's query and `expectedSql` on fresh data.
  Row order and column names are ignored; values and row/column counts must match. Hints tell
  learners to "return only column X", so keep expected queries consistent with that.
- Progress and query history live in localStorage (`data-detective-*` keys). Changing their
  stored shape needs a version bump (`-v1`) and tolerant loading.
- Dates in progress logic use the local calendar day, not UTC.

## Scope and boundaries
- No backend, database, auth, cloud services or AI API yet. Datasets stay synthetic.
- Do not add a dependency without a clear need; say why when you do.
- Do not commit, push or amend unless asked. Commit messages: short imperative subject + body.
- Ask before editing `.githooks/` or `.github/` (pre-commit hook and CI run `npm run check`).
- Never bypass hooks with `--no-verify`.
