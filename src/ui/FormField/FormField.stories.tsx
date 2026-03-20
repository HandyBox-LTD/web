import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { TextInput } from '../Input/TextInput'
import { FormField } from './FormField'

const meta = {
  title: 'form/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Email',
    children: null,
  },
} satisfies Meta<typeof FormField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <FormField label="Email" helperText="We’ll never share your email.">
      <TextInput placeholder="you@example.com" />
    </FormField>
  ),
}

export const WithError: Story = {
  render: () => (
    <FormField label="Password" errorText="Password is too short">
      <TextInput type="password" placeholder="••••••••" />
    </FormField>
  ),
}
