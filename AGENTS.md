# AGENTS.md

## Cursor Cloud specific instructions

**HandyBox** is a Next.js 16 (App Router) frontend for a UK handyman marketplace. It talks to an external GraphQL API (not in this repo).

### Quick reference

| Action | Command |
|---|---|
| Install deps | `bun install --ignore-scripts` |
| Dev server | `bun run dev` (port 3000) |
| Storybook | `bun run storybook` (port 6006) |
| Lint / format | `bun run lint` |
| Tests (Vitest + Playwright) | `npx vitest run` |
| Codegen (GraphQL types) | `bun run codegen` |

### Non-obvious caveats

- **`bun install` must use `--ignore-scripts`** in the cloud environment because the `prepare` script runs `lefthook install`, which conflicts with Cursor's `core.hooksPath` setting. Dependencies install fine without lifecycle scripts.
- **Playwright browsers** must be installed before running Vitest (`npx playwright install chromium`). Tests use `@vitest/browser-playwright` to run Storybook component tests in headless Chromium.
- **GraphQL codegen** reads the checked-in SDL in `schema.graphql` (see `codegen.ts`). It does not call the live API; production Apollo disables introspection anyway. Output goes to `.codegen/schema.ts`, which is **gitignored** — only `schema.graphql` is committed. After updating the schema or operations, run `bun run codegen` and **fix failures from GraphQL validation** (e.g. `GraphQL Document Validation failed`, unknown fields, or document load errors from `noSilentErrors`) — do not rely on diffing generated output. Then fix any remaining TypeScript errors. `bun run build` runs codegen via `prebuild`; for local dev/type-checking, run `bun run codegen` after schema or query changes.
- The `LandingPage.stories.tsx` test (`Default`) fails because the story renders components that call `useMutation` without an `ApolloProvider` wrapper. This is a pre-existing issue, not an environment problem.

## Current FE-11 delivery notes (page-by-page redesign)

- Implement the Stitch redesign incrementally, **page by page**, starting with the homepage.
- Treat Stitch as the design source and align visuals to the exported HTML and image references.
- Build reusable UI in `src/ui` and make app pages consume those primitives from `@ui`.
- Keep Chakra UI as the base implementation layer for all custom UI primitives.
- Add/maintain Storybook stories for UI primitives introduced during the redesign.
