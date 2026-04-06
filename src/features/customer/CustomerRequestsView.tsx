'use client'

import { Box, Grid, HStack, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'

import { useCustomerAccount } from '@/features/customer/CustomerAccountContext'
import {
  formatRelativePosted,
  getCategoryVisual,
  getOfferRange,
} from '@/features/dashboard/dashboardHelpers'
import { Badge, Button, GlassCard, Heading, Text } from '@ui'

function OfferAvatarStack({ count }: { count: number }) {
  const shown = Math.min(count, 3)
  const extra = count - shown
  const letters = ['A', 'B', 'C'] as const

  return (
    <HStack gap={0}>
      {letters.slice(0, shown).map((letter, index) => (
        <Box
          key={letter}
          w={8}
          h={8}
          borderRadius="full"
          bg="primary.200"
          color="primary.800"
          fontSize="10px"
          fontWeight={800}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth="2px"
          borderColor="surfaceContainerLowest"
          ml={index > 0 ? -2 : 0}
          zIndex={shown - index}
        >
          {letter}
        </Box>
      ))}
      {extra > 0 ? (
        <Box
          w={8}
          h={8}
          borderRadius="full"
          bg="surfaceContainerHigh"
          color="muted"
          fontSize="xs"
          fontWeight={700}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth="2px"
          borderColor="surfaceContainerLowest"
          ml={-2}
        >
          +{extra}
        </Box>
      ) : null}
    </HStack>
  )
}

export function CustomerRequestsView() {
  const {
    tasksLoading,
    tasksErrorMessage,
    myPostedTasks,
    activePostedTasks,
    refetchCustomerAccount,
  } = useCustomerAccount()

  const offerCountOnMyTasks = myPostedTasks.reduce(
    (n, t) => n + t.offers.length,
    0,
  )

  const customerBookings = activePostedTasks.filter(
    (task) => task.offers.length > 0,
  )

  const isLoading = tasksLoading

  return (
    <Stack gap={8}>
      <Stack gap={2}>
        <HStack justify="space-between" gap={4} flexWrap="wrap">
          <Stack gap={1} maxW="3xl">
            <Heading size="xl">My requests</Heading>
            <Text color="muted">
              Jobs you have posted, quote activity, and status—your customer
              view of work you need done.
            </Text>
          </Stack>
          <Button as={NextLink} href="/tasks/create">
            + Post a task
          </Button>
        </HStack>
      </Stack>

      <Grid
        templateColumns={{ base: '1fr', xl: '1fr 320px' }}
        gap={6}
        alignItems="start"
      >
        <Stack gap={4}>
          <HStack gap={3} flexWrap="wrap" align="center">
            <Heading size="md">Posted tasks</Heading>
            <Badge bg="primary.50" color="primary.700">
              {activePostedTasks.length} active
            </Badge>
            <Button size="sm" variant="subtle" onClick={refetchCustomerAccount}>
              Refresh
            </Button>
          </HStack>

          {isLoading ? <Text color="muted">Loading tasks…</Text> : null}
          {tasksErrorMessage ? (
            <Text color="red.400" fontSize="sm">
              {tasksErrorMessage}
            </Text>
          ) : null}

          {!isLoading && !tasksErrorMessage ? (
            activePostedTasks.length === 0 ? (
              <GlassCard p={6}>
                <Stack gap={3}>
                  <Heading size="sm">No active requests</Heading>
                  <Text color="muted">
                    Post a task to receive quotes from local taskers. Completed
                    or closed tasks stay in your history on the task detail
                    page.
                  </Text>
                  <Button
                    as={NextLink}
                    href="/tasks/create"
                    alignSelf="flex-start"
                  >
                    Post a task
                  </Button>
                </Stack>
              </GlassCard>
            ) : (
              <Stack gap={4}>
                {activePostedTasks.map((task) => {
                  const visual = getCategoryVisual(task.category)
                  const offerCount = task.offers.length

                  return (
                    <GlassCard key={task.id} p={5}>
                      <Stack gap={4}>
                        <HStack align="flex-start" gap={4} flexWrap="wrap">
                          <Box
                            w={14}
                            h={14}
                            borderRadius="lg"
                            bg={visual.bg}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="xl"
                            flexShrink={0}
                          >
                            {visual.glyph}
                          </Box>
                          <Stack gap={1} flex="1" minW="220px">
                            <Heading size="sm">{task.title}</Heading>
                            <HStack gap={2} flexWrap="wrap">
                              <Text fontSize="sm" color="muted">
                                {task.location ?? 'Location TBC'}
                              </Text>
                              <Text fontSize="sm" color="muted">
                                {formatRelativePosted(task.createdAt)}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="muted">
                              {task.description}
                            </Text>
                          </Stack>
                          <Stack
                            gap={3}
                            align={{ base: 'flex-start', md: 'flex-end' }}
                          >
                            <HStack gap={2} flexWrap="wrap">
                              <Badge
                                bg={
                                  offerCount > 0
                                    ? 'secondaryFixed'
                                    : 'surfaceContainerHigh'
                                }
                                color={
                                  offerCount > 0 ? 'onSecondaryFixed' : 'fg'
                                }
                              >
                                {offerCount > 0
                                  ? `${offerCount} quote${offerCount === 1 ? '' : 's'}`
                                  : 'Awaiting quotes'}
                              </Badge>
                              {offerCount > 0 ? (
                                <OfferAvatarStack count={offerCount} />
                              ) : null}
                            </HStack>
                            <Button
                              as={NextLink}
                              href={`/task/${task.id}`}
                              size="sm"
                            >
                              {offerCount > 0 ? 'Review quotes' : 'View task'}
                            </Button>
                          </Stack>
                        </HStack>

                        {getOfferRange(task.offers) ? (
                          <Text fontSize="xs" color="muted">
                            Quote range: {getOfferRange(task.offers)}
                          </Text>
                        ) : (
                          <Text fontSize="xs" color="muted">
                            No quotes yet. Refine your brief to attract taskers
                            faster.
                          </Text>
                        )}
                      </Stack>
                    </GlassCard>
                  )
                })}
              </Stack>
            )
          ) : null}
        </Stack>

        <Stack gap={4} position={{ xl: 'sticky' }} top={{ xl: 4 }}>
          <GlassCard
            p={5}
            bg="linear-gradient(160deg, #03225a 0%, #012b73 55%, #00358f 100%)"
            color="white"
          >
            <Stack gap={4}>
              <Stack gap={1}>
                <Text fontSize="sm" opacity={0.85}>
                  Jobs with quote activity
                </Text>
                <Heading size="lg" color="white">
                  {customerBookings.length}
                </Heading>
              </Stack>
              <Stack gap={1}>
                <Text fontSize="sm" opacity={0.85}>
                  Quotes received (all requests)
                </Text>
                <Heading size="md" color="white">
                  {offerCountOnMyTasks}
                </Heading>
              </Stack>
              <Text fontSize="sm" opacity={0.9}>
                Open a task to compare offers, message taskers, and accept a
                quote when you are ready.
              </Text>
            </Stack>
          </GlassCard>

          <GlassCard p={5} bg="surfaceContainerLow">
            <Stack gap={4}>
              <Heading size="sm">Needs attention</Heading>
              {customerBookings.length === 0 ? (
                <Text fontSize="sm" color="muted">
                  When quotes arrive, active tasks with responses appear here.
                </Text>
              ) : (
                <Stack gap={3}>
                  {customerBookings.slice(0, 4).map((task) => (
                    <GlassCard
                      key={task.id}
                      p={4}
                      bg="surfaceContainerLowest"
                      borderWidth="1px"
                      borderColor="border"
                    >
                      <Stack gap={1}>
                        <Heading size="sm">{task.title}</Heading>
                        <Text fontSize="sm" color="muted">
                          {task.offers.length} quotes ·{' '}
                          {task.location ?? 'Location TBC'}
                        </Text>
                        <Link
                          as={NextLink}
                          href={`/task/${task.id}`}
                          fontSize="sm"
                          fontWeight={700}
                          color="primary.600"
                          _hover={{ color: 'primary.700' }}
                        >
                          Open task
                        </Link>
                      </Stack>
                    </GlassCard>
                  ))}
                </Stack>
              )}
            </Stack>
          </GlassCard>
        </Stack>
      </Grid>
    </Stack>
  )
}
