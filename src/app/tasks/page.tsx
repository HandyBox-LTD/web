'use client'

import { Box, Stack } from '@chakra-ui/react'

import { TaskBoard } from '@/app/components'
import { Footer, Header, Heading, Section, Text } from '@ui'

export default function TasksPage() {
  return (
    <Box bg="surface" color="fg" minH="100vh">
      <Stack gap={0}>
        <Section id="header" py={{ base: 6, md: 8 }}>
          <Header activeItem="tasks" />
        </Section>
        <Section bg="surfaceContainerLow">
          <Stack gap={10}>
            <Stack gap={3}>
              <Heading size="xl" letterSpacing="-0.02em">
                Browse local jobs
              </Heading>
              <Text color="muted">
                Browse the latest jobs posted by local homeowners and
                businesses.
              </Text>
            </Stack>
            <TaskBoard title="Latest tasks" />
          </Stack>
        </Section>
        <Footer />
      </Stack>
    </Box>
  )
}
