# Data Detective

Learning platform with two independent tracks: **Data Engineering** (investigate synthetic datasets,
run SQL in the browser) and **Claude Developer** (study tool for the Claude Certified Developer –
Foundations exam). Client-only React app in `frontend/`. The owner is a data engineer new to web dev,
so keep code simple and readable, and briefly explain non-obvious decisions.

## Commands (run from `frontend/`)
- `npm run dev`: dev server at http://localhost:5173
- `npm run check`: lint + type-check + tests. **Run before saying work is done.**
- `npm run build`: type-check + production build (CI also runs this)
- `npm test` / `npm run test:watch`: Vitest (node environment, `src/**/*.test.ts` only)

## Architecture
- Routes: `/` track selection, `/data-engineering/*`, `/claude/*`. Each track has its own layout,
  progress state and localStorage keys. Never import from one track into the other.
- `src/shared/` generic UI and hooks used by both tracks (Badge, StatCard, TrackLayout, storage helpers)
- `src/tracks/data-engineering/` `data/` datasets, `challenges/` one `ChallengeDefinition` data file per
  challenge (rendered by the generic `ChallengeView`), `utils/` tested logic, `components/`, `pages/`, `progress/`
- `src/tracks/claude/` `data/` (exam config, resources, questions per domain, mock exams),
  `utils/` tested logic, `state/` progress/notes/tips hooks, `components/`, `pages/`
- Adding a DE challenge: write a definition in `tracks/data-engineering/challenges/` and list it in that
  folder's `index.ts` (see "Adding a Data Engineering challenge" in `README.md`). Nothing else to register.

## Code conventions
- Strict TypeScript. No `enum` (`erasableSyntaxOnly`); use `import type` for types (`verbatimModuleSyntax`).
- No unused variables or parameters (`noUnusedLocals/Parameters` fail the build).
- Plain CSS with variables in `src/index.css`; the track accent comes from `data-track` on `<html>`.
  No CSS framework or UI library.
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

## Claude Developer track rules
- Exam facts (domains, weights, format) come only from the official Exam Guide, recorded in
  `tracks/claude/data/exam.ts`. Never invent or guess them; mark anything unverified as such.
- Provenance is always shown: resources are `official` or `community` (integrity test checks the host),
  questions are `original`, `ai-generated` or `community-inspired`. Never label anything official that
  Anthropic did not publish. Questions we write are `ai-generated`.
- Never add real or leaked exam questions. Do not import questions from third-party sites.
- Any URL added to `resources.ts` must be checked (HTTP 200) and given today's `lastVerified`.
- New questions: explain every wrong option in `whyIncorrect`, link `resourceIds`, and avoid brittle
  facts (prices, model names). `data/dataIntegrity.test.ts` enforces the structure.
- Authored questions list the right answer first; anything shown to learners must go through
  `withShuffledOptions`. Keep option lengths comparable (a test fails if the correct option is usually the
  longest), and include some multiple-response and advanced questions.
- Mocks are assembled per attempt by `assembleMock` from the exam weights; they hold a size and a time
  limit, not fixed question lists.

## Scope and boundaries
- No backend, database, auth, cloud services or AI API yet. Datasets stay synthetic.
- Do not add a dependency without a clear need; say why when you do.
- Do not commit, push or amend unless asked. Commit messages: short imperative subject + body.
- Ask before editing `.githooks/` or `.github/` (pre-commit hook and CI run `npm run check`).
- Never bypass hooks with `--no-verify`.
