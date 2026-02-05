'use client'

import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react'

import { LandingFooter, LandingHeader, TaskBoard } from '@/components/ui'

export default function TasksPage() {
  return (
    <Box bg="bg" color="fg" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Stack gap={10}>
          <LandingHeader />
          <Stack gap={3}>
            <Heading size="lg">Open tasks</Heading>
            <Text color="muted">
              Browse the latest jobs posted by local homeowners and businesses.
            </Text>
          </Stack>
          <TaskBoard title="Latest tasks" />
          <LandingFooter />
        </Stack>
      </Container>
    </Box>
  )
}
