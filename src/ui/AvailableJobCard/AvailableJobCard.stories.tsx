import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AvailableJobCard } from './AvailableJobCard'

const meta = {
  title: 'ui/AvailableJobCard',
  component: AvailableJobCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'Burst kitchen pipe – immediate repair needed',
    description:
      'Water leaking under the sink; shutoff valve stuck. Need a qualified plumber today if possible.',
    locationLabel: 'Lincoln Park, Chicago',
    timeLabel: 'Posted 14m ago',
    categoryLabel: 'Plumbing',
    budgetMain: '£350 – £500',
    budgetSub: 'Estimated budget',
    badgeVariant: 'emergency' as const,
    badgeText: 'EMERGENCY',
    imageFallback: 'Pl',
    offerHref: '#offer',
    detailsHref: '#details',
  },
} satisfies Meta<typeof AvailableJobCard>

export default meta

type Story = StoryObj<typeof meta>

export const Emergency: Story = {}

export const BigProject: Story = {
  args: {
    badgeVariant: 'featured',
    badgeText: 'BIG PROJECT',
    title: 'Full deck rebuild and stain',
    budgetMain: '£4,200',
    budgetSub: 'Fixed price',
    categoryLabel: 'Carpentry',
    imageFallback: 'Ca',
  },
}

export const NoBadge: Story = {
  args: {
    badgeVariant: 'none',
    badgeText: undefined,
    title: 'Replace ceiling fan',
    budgetMain: '£180',
    budgetSub: 'Fixed price',
    categoryLabel: 'Electrical',
    imageFallback: 'El',
  },
}
