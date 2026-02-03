import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '@chakra-ui/react'

const meta: Meta<typeof Button> = {
  title: 'Chakra/Button',
  component: Button,
  args: {
    children: 'Click me',
    colorPalette: 'teal',
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {}
