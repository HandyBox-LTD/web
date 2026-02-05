'use client'

import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useParams } from 'next/navigation'

import {
  GlassCard,
  LandingFooter,
  LandingHeader,
  TextInput,
  UiButton,
  sampleTasks,
} from '@/components/ui'

const fallbackTask = {
  slug: 'task',
  title: 'Task detail',
  summary: 'Review the requirements and send a clear offer to get started.',
  budget: '£50–£120',
  tags: ['General', 'Repairs', 'London'],
}

function titleFromSlug(slug: string) {
  if (!slug) return fallbackTask.title
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function TaskDetailPage() {
  const params = useParams<{ slug?: string | string[] }>()
  const slugParam = params?.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam ?? ''
  const task =
    sampleTasks.find((item) => item.slug === slug) ??
    ({
      ...fallbackTask,
      slug: slug || fallbackTask.slug,
      title: titleFromSlug(slug),
    } as const)

  return (
    <Box bg="bg" color="fg" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Stack gap={10}>
          <LandingHeader />
          <Stack gap={4}>
            <Link
              as={NextLink}
              href="/tasks"
              fontWeight={600}
              color="linkBlue.700"
              _hover={{ textDecoration: 'none' }}
            >
              ← Back to tasks
            </Link>
            <Stack gap={3}>
              <HStack justify="space-between" flexWrap="wrap" gap={3}>
                <Heading size="lg">{task.title}</Heading>
                <Badge
                  bg="mustard.200"
                  color="black"
                  px={3}
                  py={1}
                  borderRadius="999px"
                  fontSize="sm"
                >
                  {task.budget}
                </Badge>
              </HStack>
              <Text color="muted">{task.summary}</Text>
              <HStack gap={2} flexWrap="wrap">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </HStack>
            </Stack>
          </Stack>

          <GlassCard p={6}>
            <Stack gap={4}>
              <Heading size="md">Task details</Heading>
              <Text color="muted">
                This is a short summary of the job, expected timing, and any
                specific access notes. Share clear details to get accurate
                offers from trades.
              </Text>
              <Stack gap={2} fontSize="sm">
                <Text>
                  <strong>Location:</strong> {task.tags[2] ?? 'London'}
                </Text>
                <Text>
                  <strong>Category:</strong> {task.tags[0] ?? 'General'}
                </Text>
                <Text>
                  <strong>Budget range:</strong> {task.budget}
                </Text>
              </Stack>
            </Stack>
          </GlassCard>

          <GlassCard p={6} id="offer">
            <Stack gap={4}>
              <Heading size="md">Make an offer</Heading>
              <Text color="muted">
                Share your availability and any questions before confirming the
                booking.
              </Text>
              <Stack gap={3}>
                <TextInput placeholder="Offer price (pence)" />
                <TextInput placeholder="Short message to the client" />
              </Stack>
              <UiButton background="linkBlue.600" color="white">
                Submit offer
              </UiButton>
            </Stack>
          </GlassCard>

          <LandingFooter />
        </Stack>
      </Container>
    </Box>
  )
}
