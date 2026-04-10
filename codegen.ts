import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

function trimEnv(value: string | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

function resolveSchema(): CodegenConfig['schema'] {
  const schemaFile = trimEnv(process.env.GRAPHQL_SCHEMA_FILE)
  if (schemaFile) {
    return schemaFile
  }

  const schemaUrlOverride = trimEnv(process.env.GRAPHQL_SCHEMA_URL)
  const base = trimEnv(process.env.NEXT_PUBLIC_GRAPHQL_URL)
  const schemaUrl =
    schemaUrlOverride || (base ? `${base.replace(/\/$/, '')}/schema` : '')

  if (!schemaUrl) {
    throw new Error(
      'GraphQL codegen: set NEXT_PUBLIC_GRAPHQL_URL, or GRAPHQL_SCHEMA_URL (full URL to the schema SDL endpoint), or GRAPHQL_SCHEMA_FILE (local path).',
    )
  }

  const token = trimEnv(process.env.SCHEMA_ACCESS_TOKEN)

  return [
    {
      [schemaUrl]: {
        headers: {
          'X-Schema-Token': token,
        },
        handleAsSDL: true,
      },
    },
  ]
}

const config: CodegenConfig = {
  schema: resolveSchema(),
  documents: ['src/graphql/**/*.ts', 'src/app/**/page.tsx'],
  ignoreNoDocuments: true,
  generates: {
    '.codegen/schema.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        useTypeImports: true,
        skipTypename: true,
      },
    },
  },
}

export default config
