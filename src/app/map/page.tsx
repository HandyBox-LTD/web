'use client'

import { Box } from '@chakra-ui/react'

import { AvailableJobsBrowse } from '@/app/components'
import { Container, Footer, Header } from '@ui'

export default function MapBrowsePage() {
  return (
    <Box
      bg="surface"
      color="fg"
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <Box
        as="header"
        id="header"
        py={{ base: 4, md: 6 }}
        px={{ base: 4, md: 6 }}
        bg="surface"
        borderBottomWidth="1px"
        borderColor="border"
        flexShrink={0}
      >
        <Container>
          <Header />
        </Container>
      </Box>
      <Box position="relative" w="full" flex="1" minH={0}>
        <AvailableJobsBrowse
          layout="mapHero"
          headerTitle="Tasks on the map"
          headerSubtitle="List and map stay in sync with your filters."
        />
      </Box>
      <Box flexShrink={0}>
        <Footer />
      </Box>
    </Box>
  )
}
