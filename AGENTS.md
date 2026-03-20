# AGENTS.md

## Cursor Cloud specific instructions

**HandyBox** is a Next.js 16 (App Router) frontend for a UK handyman marketplace. It talks to an external GraphQL API (not in this repo).

### Stitch (design source)

- **Default Stitch design project** (this repo’s redesign): ID and MCP resource name live in [`.cursor/stitch-project.json`](.cursor/stitch-project.json).
- **Web UI:** [Stitch project](https://stitch.withgoogle.com/projects/9864829734034313388?pli=1).
- **MCP usage:** Use `designProjectId` from `stitch-project.json`. Typical mapping: `get_project` → `name` = `mcpResourceName` (e.g. `projects/9864829734034313388`); `list_screens` → `projectId` = the numeric id only.
- **Cursor config:** [`.cursor/mcp.json`](.cursor/mcp.json) points at Google’s Stitch MCP endpoint; auth is separate from this project id. If MCP calls fail with OAuth/dynamic-registration errors, use Cursor’s MCP troubleshooting or the [community `stitch-mcp` npm server](https://www.npmjs.com/package/stitch-mcp) with `gcloud` + `GOOGLE_CLOUD_PROJECT` per its README.

### Quick reference

| Action | Command |
|---|---|
| Install deps | `bun install --ignore-scripts` |
| Dev server | `bun run dev` (port 3000) |
| Storybook | `bun run storybook` (port 6006) |
| Storybook static build | `bun run build-storybook` → `storybook-static/` |
| Lint / format | `bun run lint` |
| Tests (Vitest + Playwright) | `npx vitest run` |
| Codegen (GraphQL types) | `bun run codegen` |

### Non-obvious caveats

- **`bun install` must use `--ignore-scripts`** in the cloud environment because the `prepare` script runs `lefthook install`, which conflicts with Cursor's `core.hooksPath` setting. Dependencies install fine without lifecycle scripts.
- **Playwright browsers** must be installed before running Vitest (`npx playwright install chromium`). Without this, `npx vitest run` fails when launching Chromium for the Storybook test project. Tests use `@vitest/browser-playwright` to run stories in headless Chromium.
- **GraphQL codegen** introspects the remote API schema. The URL is baked into `codegen.ts`. If the remote API is unreachable, codegen will fail, but the dev server can still start (the generated types in `.codegen/schema.ts` are only needed at build time or for type-checking).

## Current FE-11 delivery notes (page-by-page redesign)

- Implement the Stitch redesign incrementally, **page by page**, starting with the homepage.
- Treat Stitch as the design source and align visuals to the exported HTML and image references.
- Build reusable UI in `src/ui` and make app pages consume those primitives from `@ui`.
- Keep Chakra UI as the base implementation layer for all custom UI primitives.
- Add/maintain Storybook stories for UI primitives introduced during the redesign.
