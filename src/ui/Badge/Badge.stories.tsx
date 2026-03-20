import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Badge } from './Badge'

const meta = {
  title: 'ui/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Verified Pro',
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
