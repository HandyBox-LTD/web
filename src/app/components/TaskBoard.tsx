'use client'

import { useQuery } from '@apollo/client/react'
import { HStack, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

import { TASKS_QUERY } from '@/graphql/jobs'
import { Badge } from '@/ui/Badge/Badge'
import { Button } from '@/ui/Button/Button'
import type { TasksQuery } from '@codegen/schema'
import { GlassCard } from '../../ui/Card/GlassCard'

export type TaskBoardProps = {
  title?: string
}

function formatBudget(offers: { pricePence: number }[]) {
  if (offers.length === 0) return 'No offers yet'
  const prices = offers.map((o) => o.pricePence)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return `£${(min / 100).toFixed(0)}`
  return `£${(min / 100).toFixed(0)}–£${(max / 100).toFixed(0)}`
}

export function TaskBoard({ title = 'Latest tasks' }: TaskBoardProps) {
  const { data, loading, error } = useQuery<TasksQuery>(TASKS_QUERY)
  const tasks = data?.tasks ?? []

  return (
    <GlassCard p={6}>
      <Stack gap={6}>
        <HStack justify="space-between" flexWrap="wrap" gap={3}>
          <Heading size="md">{title}</Heading>
          <HStack gap={2} flexWrap="wrap">
            <Badge bg="mustard.200" color="black" px={2}>
              Live
            </Badge>
          </HStack>
        </HStack>

        {loading ? (
          <Text color="muted">Loading tasks…</Text>
        ) : error ? (
          <Text color="red.400" fontSize="sm">
            {error.message}
          </Text>
        ) : tasks.length === 0 ? (
          <Text color="muted">
            No tasks posted yet. Be the first to post one.
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
            {tasks.map((task) => (
              <GlassCard key={task.id} p={5}>
                <Stack gap={3}>
                  <HStack justify="space-between">
                    <Heading size="sm">{task.title}</Heading>
                    <Badge bg="mustard.200" color="black" px={2}>
                      {formatBudget(task.offers)}
                    </Badge>
                  </HStack>
                  <Text color="muted">{task.description}</Text>
                  <HStack gap={2} flexWrap="wrap">
                    {task.location && (
                      <Badge variant="outline">{task.location}</Badge>
                    )}
                    {task.offers.length > 0 && (
                      <Badge variant="outline">
                        {task.offers.length} offer
                        {task.offers.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </HStack>
                  <HStack gap={3}>
                    <Button
                      as={NextLink}
                      href={`/task/${task.id}#offer`}
                      size="sm"
                      background="linkBlue.600"
                      color="white"
                    >
                      Make offer
                    </Button>
                    <Button
                      as={NextLink}
                      href={`/task/${task.id}`}
                      size="sm"
                      variant="outline"
                      borderColor="border"
                    >
                      View
                    </Button>
                  </HStack>
                </Stack>
              </GlassCard>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </GlassCard>
  )
}
