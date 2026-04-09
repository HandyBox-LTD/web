import { HStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '../Button'
import { Heading } from '../Typography'
import { Header } from './Header'

function HeaderCustomChildrenStory() {
  return (
    <Header>
      <HStack justify="space-between" py={2}>
        <Heading size="md">Slashie</Heading>
        <HStack gap={2}>
          <Button size="sm" variant="subtle" bg="surfaceContainerLow">
            Log in
          </Button>
          <Button size="sm">Post a task</Button>
        </HStack>
      </HStack>
    </Header>
  )
}

const meta = {
  title: 'layout/Header',
  component: HeaderCustomChildrenStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeaderCustomChildrenStory>

export default meta

type Story = StoryObj<typeof meta>

export const CustomChildren: Story = {}

export const SiteNavigation: Story = {
  render: () => <Header activeItem="home" />,
}
