# Story Examples

## UI Example

```ts
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './card';

const meta = {
  title: 'ui/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    thumbnail: '/press_release.png',
    link: 'https://example.com',
    title: 'Title',
    excerpt: 'Content',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

## Section Example

```ts
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PressReleasesSection } from './pressReleasesSection';

const meta = {
  title: 'section/PressReleasesSection',
  component: PressReleasesSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    content: {
      sectionTitle: '**Press** Releases',
      buttonText: 'View All',
      buttonLink: '/press-releases',
    },
    blogs: [
      {
        id: 1,
        title: 'The 1st Blog',
        slug: 'the-1st-blog',
        excerpt: 'Example excerpt...',
        status: 'published',
        published_at: 'Oct 1, 2025',
        featured_image: 'https://example.com/image.png',
        featured_image_path: 'blogs/image.png',
      },
    ],
  },
} satisfies Meta<typeof PressReleasesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

## Layout Example

```ts
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Bento, type GridItem } from './bento';

const items: GridItem[] = [
  {
    type: 'image',
    image: 'https://example.com/photo.jpg',
    layout: { x: 0, y: 0, w: 1, h: 1 },
    altText: null,
  },
];

const meta = {
  title: 'layout/Bento',
  component: Bento,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    items,
    config: { cols: 4 },
    rowHeight: 200,
    margin: [16, 16],
    isDraggable: false,
  },
} satisfies Meta<typeof Bento>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```
