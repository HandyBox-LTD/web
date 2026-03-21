import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

import { TaskListPagination } from './TaskListPagination'

const meta = {
  title: 'ui/TaskListPagination',
  component: TaskListPagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    page: 0,
    totalPages: 5,
    onPrevious: () => {},
    onNext: () => {},
    onSelectPage: () => {},
  },
} satisfies Meta<typeof TaskListPagination>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(0)
    const totalPages = 5
    return (
      <TaskListPagination
        page={page}
        totalPages={totalPages}
        onPrevious={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        onSelectPage={setPage}
      />
    )
  },
}
