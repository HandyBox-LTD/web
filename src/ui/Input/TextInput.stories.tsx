import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { TextInput } from './TextInput'

const meta = {
  title: 'form/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    placeholder: 'Email address',
  },
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Password' },
}
