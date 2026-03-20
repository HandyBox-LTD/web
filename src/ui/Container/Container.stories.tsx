import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Container } from './Container'

const meta = {
  title: 'layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Box bg="surfaceContainerLow" py={8}>
      <Container {...args}>
        <Box bg="surfaceContainerLowest" p={4} borderRadius="md">
          Container content
        </Box>
      </Container>
    </Box>
  ),
}
