'use client'

import { Box, HStack, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Badge } from '../Badge'
import { Button } from '../Button'
import {
  IconClock,
  IconMapPin,
  IconWrench,
} from '../TaskBrowse/TaskBrowseMetaIcons'
import { Heading, Text } from '../Typography'

export type JobCardBadgeVariant = 'emergency' | 'featured' | 'none'

export type AvailableJobCardProps = {
  title: string
  description: string
  locationLabel: string
  timeLabel: string
  categoryLabel: string
  budgetMain: string
  budgetSub: string
  badgeVariant: JobCardBadgeVariant
  badgeText?: string
  imageFallback?: string
  offerHref: string
  detailsHref: string
  /** Highlights the card when synced with the map selection. */
  isActive?: boolean
  /** Called when the card is clicked (e.g. to sync with map). Buttons still navigate normally. */
  onActivate?: () => void
}

function categoryGradient(category: string): string {
  const key = category.toLowerCase()
  if (key.includes('plumb'))
    return 'linear-gradient(135deg, #1A56DB 0%, #003fb1 100%)'
  if (key.includes('electr'))
    return 'linear-gradient(135deg, #5f88e8 0%, #1A56DB 100%)'
  if (key.includes('carpent') || key.includes('wood'))
    return 'linear-gradient(135deg, #cb7f08 0%, #855300 100%)'
  if (key.includes('hvac') || key.includes('heat'))
    return 'linear-gradient(135deg, #059669 0%, #047857 100%)'
  return 'linear-gradient(135deg, #dfe8f7 0%, #b5ceff 100%)'
}

export function AvailableJobCard({
  title,
  description,
  locationLabel,
  timeLabel,
  categoryLabel,
  budgetMain,
  budgetSub,
  badgeVariant,
  badgeText,
  imageFallback = 'HB',
  offerHref,
  detailsHref,
  isActive = false,
  onActivate,
}: AvailableJobCardProps) {
  const showBadge = badgeVariant !== 'none' && badgeText
  const badgeBg =
    badgeVariant === 'emergency' ? 'secondaryFixed' : 'primary.100'
  const badgeColor =
    badgeVariant === 'emergency' ? 'onSecondaryFixed' : 'primary.700'

  const summary =
    description.length > 220
      ? `${description.slice(0, 217).trim()}…`
      : description

  const card = (
    <HStack
      align="stretch"
      gap={0}
      flexDir={{ base: 'column', sm: 'row' }}
      borderRadius="xl"
      bg="surfaceContainerLowest"
      boxShadow="card"
      overflow="hidden"
      borderWidth="2px"
      borderColor={isActive ? 'primary.500' : 'border'}
      transition="all 180ms ease"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'ambient' }}
    >
      <Box
        position="relative"
        flexShrink={0}
        w={{ base: 'full', sm: '168px' }}
        minH={{ base: '140px', sm: 'auto' }}
        alignSelf={{ base: 'stretch', sm: 'auto' }}
        bg={categoryGradient(categoryLabel)}
      >
        {showBadge ? (
          <Box position="absolute" top={3} left={3} zIndex={1}>
            <Badge
              px={2}
              py={0.5}
              fontSize="10px"
              letterSpacing="0.04em"
              bg={badgeBg}
              color={badgeColor}
              borderRadius="md"
            >
              {badgeText}
            </Badge>
          </Box>
        ) : null}
        <Box
          display="flex"
          w="full"
          h="full"
          minH={{ base: '120px', sm: '168px' }}
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight={800}
          fontSize="xl"
          letterSpacing="0.08em"
          textShadow="0 1px 2px rgba(0,0,0,0.2)"
        >
          {imageFallback.slice(0, 3).toUpperCase()}
        </Box>
      </Box>

      <Stack gap={4} flex={1} p={{ base: 4, sm: 5 }} minW={0}>
        <HStack align="flex-start" justify="space-between" gap={4}>
          <Heading size="md" color="fg" lineHeight="1.25">
            {title}
          </Heading>
          <Stack gap={0} align="flex-end" flexShrink={0} textAlign="right">
            <Text fontWeight={800} fontSize="lg" color="fg">
              {budgetMain}
            </Text>
            <Text fontSize="xs" color="muted">
              {budgetSub}
            </Text>
          </Stack>
        </HStack>

        <HStack gap={4} flexWrap="wrap" rowGap={2}>
          <HStack gap={1.5} minW={0}>
            <IconMapPin />
            <Text fontSize="sm" color="muted" truncate>
              {locationLabel}
            </Text>
          </HStack>
          <HStack gap={1.5}>
            <IconClock />
            <Text fontSize="sm" color="muted">
              {timeLabel}
            </Text>
          </HStack>
          <HStack gap={1.5} minW={0}>
            <IconWrench />
            <Text fontSize="sm" color="muted" truncate>
              {categoryLabel}
            </Text>
          </HStack>
        </HStack>

        <Text fontSize="sm" color="muted" lineHeight="1.55">
          {summary}
        </Text>

        <HStack gap={3} flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
          <Button
            as={NextLink}
            href={offerHref}
            flex={{ base: '1 1 100%', sm: 2 }}
            minW={{ base: 'full', sm: '140px' }}
            size="md"
            onClick={(e) => e.stopPropagation()}
          >
            Make an offer
          </Button>
          <Button
            as={NextLink}
            href={detailsHref}
            variant="subtle"
            bg="surfaceContainerHigh"
            color="fg"
            flex={{ base: '1 1 100%', sm: 1 }}
            minW={{ base: 'full', sm: '100px' }}
            size="md"
            boxShadow="none"
            onClick={(e) => e.stopPropagation()}
          >
            Details
          </Button>
        </HStack>
      </Stack>
    </HStack>
  )

  if (onActivate) {
    return (
      <button
        type="button"
        onClick={onActivate}
        aria-current={isActive ? 'true' : undefined}
        style={{
          border: 'none',
          padding: 0,
          margin: 0,
          width: '100%',
          textAlign: 'left',
          background: 'transparent',
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        {card}
      </button>
    )
  }

  return card
}
