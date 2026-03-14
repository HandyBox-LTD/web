import type { CodegenConfig } from '@graphql-codegen/cli'

const schemaSource = process.env.CODEGEN_SCHEMA_URL || 'schema.graphql'

const config: CodegenConfig = {
  schema: schemaSource,
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
