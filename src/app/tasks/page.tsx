'use client'

import { Box, Stack } from '@chakra-ui/react'

import { AvailableJobsBrowse } from '@/app/components'
import { Footer, Header, Section } from '@ui'

export default function TasksPage() {
  return (
    <Box bg="surface" color="fg" minH="100vh">
      <Stack gap={0}>
        <Section id="header" py={{ base: 6, md: 8 }}>
          <Header activeItem="tasks" />
        </Section>
        <Section bg="surfaceContainerLow">
          <AvailableJobsBrowse />
        </Section>
        <Footer />
      </Stack>
    </Box>
  )
}
