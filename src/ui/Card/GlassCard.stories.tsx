import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { GlassCard } from './GlassCard'

const meta = {
  title: 'ui/GlassCard',
  component: GlassCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    p: 6,
  },
} satisfies Meta<typeof GlassCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <GlassCard {...args}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Glass Card</div>
      <div style={{ opacity: 0.8 }}>
        Warm, translucent panel with rounded corners.
      </div>
    </GlassCard>
  ),
}
