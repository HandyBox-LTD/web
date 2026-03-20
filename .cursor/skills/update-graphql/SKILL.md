---
name: update-graphql
description: Run codegen to fetch the latest schema, analyze the updated .codegen/schema.ts, automatically update queries and mutations in the src/graphql/ directory, and then update any affected frontend components based on the git diff. Use when the user asks to update the GraphQL schema, run codegen, or sync GraphQL files.
---

# Update GraphQL Schema

When requested to update the GraphQL schema or run codegen, follow these steps to keep the frontend GraphQL operations in sync with the backend.

## Workflow

1. **Run Codegen**
   Execute the codegen script to fetch the latest schema from the backend and generate the updated TypeScript definitions:
   ```bash
   bun run codegen
   ```

2. **Analyze the Schema**
   Read the newly generated `.codegen/schema.ts` file. Review the `Mutation` and `Query` types to understand the available operations and their return types.

3. **Update GraphQL Operations**
   Review the files in the `src/graphql/` directory (e.g., `jobs.ts`, `auth.ts`, `users.ts`, `categories.ts`, `reviews.ts`) and update them accordingly:
   - Add any new queries or mutations that exist in the schema but are missing from the `src/graphql/` folder.
   - Update the fields of existing operations if the schema has changed (e.g., added/removed/renamed fields).
   - Ensure the structure strictly follows the generated schema types.

4. **Identify Affected Frontend Components**
   Use `git diff src/graphql/` to spot any changes made to the queries and mutations. 
   Use the search tools to find where the changed queries or mutations are imported and used across the frontend codebase (e.g., `src/app/`, `src/components/`, etc.).

5. **Update Frontend Code**
   Update the affected frontend components to align with the new GraphQL operation signatures, fields, and TypeScript types. Ensure that variables passed to mutations/queries match the new schema requirements.

6. **Verify Changes**
   Run the project's linter and type-checker to verify that your updates did not introduce any errors:
   ```bash
   bun run lint
   ```
