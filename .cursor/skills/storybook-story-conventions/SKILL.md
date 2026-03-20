---
name: storybook-story-conventions
description: Create and update Storybook stories using this repository's required conventions for @storybook/nextjs-vite, colocated story files, title/layout patterns, args shape, and provider usage. Use when adding or editing .stories.tsx files or when the user asks for Storybook stories.
---

# Storybook Story Conventions

Apply these rules whenever creating or updating stories.

## Repo-specific stack

- Framework: `@storybook/nextjs-vite`
- Story discovery: `../components/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Static assets: `public/` via `.storybook/main.ts` `staticDirs`
- Global decorator: `.storybook/preview.tsx` already wraps stories with app provider

## File placement rules

Create stories beside components:

- `components/ui/<name>.stories.tsx`
- `components/section/<name>.stories.tsx`
- `components/layout/<name>.stories.tsx`
- `components/form/<name>.stories.tsx`

Do not create stories outside `components/**` unless explicitly requested.

## Required story skeleton

```ts
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComponentName } from './componentName';

const meta = {
  title: 'group/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded' | 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

## Title convention

Use lowercase group + PascalCase component:

- `ui/Card`
- `section/PressReleasesSection`
- `layout/Bento`
- `form/ContactUsForm`

## Layout convention

- Use `fullscreen` for section-like/full-width/page-like components
- Use `padded` for contained widgets
- If unsure: inspect sibling stories and match the dominant pattern

## Args convention

- Prefer `meta.args` for default args
- Use realistic defaults that render without runtime errors
- Use existing static assets (for example `/press_release.png`)
- Provide minimally complete object/array shapes for required props
- Keep values production-like (ids, slug, dates, URLs)

## Provider rule

Do not add extra provider wrappers in story files unless explicitly requested.

## Quality checklist

- Story file is colocated with the component
- Import type is from `@storybook/nextjs-vite`
- Title follows `group/ComponentName`
- `tags: ['autodocs']` exists
- `parameters.layout` is set
- Args satisfy required component props
- No linter/type errors in the story file

## Prompt template

Use this prompt for story generation:

```md
Create/Update Storybook story for `<component-path>`.

Follow repo conventions:
1. Use `import type { Meta, StoryObj } from '@storybook/nextjs-vite'`.
2. Place story next to component as `<name>.stories.tsx`.
3. Use title format `group/ComponentName` (`ui`, `section`, `layout`, or `form`).
4. Include `tags: ['autodocs']`.
5. Set `parameters.layout` (`fullscreen` for section/full-width, `padded` for contained widgets).
6. Add realistic default args with complete mock object shapes.
7. Export `meta`, `type Story = StoryObj<typeof meta>`, and `Default`.
8. Do not add extra providers; Storybook preview already wraps with app Provider.
```

## Examples

See [references/EXAMPLE.md](references/EXAMPLE.md).
