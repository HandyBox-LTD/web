import { Stack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Heading } from './Heading'
import { Text } from './Text'

function TypographyStory() {
  return (
    <Stack gap={3}>
      <Heading size="2xl">Master Craftsman</Heading>
      <Heading size="lg">Architectural Layering</Heading>
      <Text fontSize="lg" color="muted">
        HandyBox blends precision and warmth for every workflow.
      </Text>
      <Text fontSize="sm">Metadata and utility copy.</Text>
    </Stack>
  )
}

const meta = {
  title: 'ui/Typography',
  component: TypographyStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TypographyStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
