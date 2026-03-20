# codegen

When the user types `/codegen`, you must execute the `update-graphql` skill.

## Steps:
1. Run `bun run codegen` in the terminal to fetch the latest schema and generate `.codegen/schema.ts`.
2. Analyze `.codegen/schema.ts` to identify new or changed queries and mutations.
3. Automatically update the corresponding files in `src/graphql/` to match the latest schema.
4. Run `bun run lint` to verify your changes.