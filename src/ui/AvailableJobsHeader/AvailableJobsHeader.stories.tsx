import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

import { AvailableJobsHeader } from './AvailableJobsHeader'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
] as const

const meta = {
  title: 'ui/AvailableJobsHeader',
  component: AvailableJobsHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'Available jobs',
    subtitle: 'Browse 124 local service requests needing your expertise today.',
    sortOptions: SORT_OPTIONS,
  },
} satisfies Meta<typeof AvailableJobsHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [sort, setSort] = useState('newest')
    return (
      <AvailableJobsHeader {...args} sortValue={sort} onSortChange={setSort} />
    )
  },
}
