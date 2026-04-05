'use client'

import { Stack } from '@chakra-ui/react'

import { GlassCard, Heading, Text } from '@ui'

export default function DashboardMessagesPage() {
  return (
    <Stack gap={8}>
      <Stack gap={1} maxW="3xl">
        <Heading size="xl">Messages</Heading>
        <Text color="muted">
          In-app messaging will appear here when chat is connected to the API.
          For now, use the email and phone details on each task to coordinate
          with customers.
        </Text>
      </Stack>

      <GlassCard p={6}>
        <Text color="muted">
          No conversations yet. This workspace is reserved for tasker–customer
          threads once messaging ships.
        </Text>
      </GlassCard>
    </Stack>
  )
}
