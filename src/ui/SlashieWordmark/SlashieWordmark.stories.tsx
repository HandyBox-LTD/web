import { Stack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SlashieWordmark } from './SlashieWordmark'

const meta = {
  title: 'ui/SlashieWordmark',
  component: SlashieWordmark,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SlashieWordmark>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <Stack gap={6} align="flex-start">
      <SlashieWordmark size="md" />
      <SlashieWordmark size="lg" />
    </Stack>
  ),
}
