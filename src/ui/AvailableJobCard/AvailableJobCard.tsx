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

  const compact = Boolean(onActivate && !isActive)

  const summaryMax = compact ? 100 : 220
  const summary =
    description.length > summaryMax
      ? `${description.slice(0, summaryMax - 1).trim()}…`
      : description

  const card = (
    <HStack
      align="stretch"
      gap={0}
      flexDir={{ base: 'column', sm: 'row' }}
      borderRadius={compact ? 'lg' : 'xl'}
      bg="surfaceContainerLowest"
      boxShadow={compact ? 'sm' : 'card'}
      overflow="hidden"
      borderWidth={compact ? '1px' : '2px'}
      borderColor={isActive ? 'primary.500' : 'border'}
      transition="all 180ms ease"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'ambient' }}
    >
      <Box
        position="relative"
        flexShrink={0}
        w={{ base: 'full', sm: compact ? '88px' : '168px' }}
        minH={
          compact ? { base: '72px', sm: 'auto' } : { base: '140px', sm: 'auto' }
        }
        alignSelf={{ base: 'stretch', sm: 'auto' }}
        bg={categoryGradient(categoryLabel)}
      >
        {showBadge ? (
          <Box
            position="absolute"
            top={compact ? 2 : 3}
            left={compact ? 2 : 3}
            zIndex={1}
          >
            <Badge
              px={compact ? 1.5 : 2}
              py={0.5}
              fontSize="9px"
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
          minH={
            compact
              ? { base: '64px', sm: '88px' }
              : { base: '120px', sm: '168px' }
          }
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight={800}
          fontSize={compact ? 'md' : 'xl'}
          letterSpacing="0.08em"
          textShadow="0 1px 2px rgba(0,0,0,0.2)"
        >
          {imageFallback.slice(0, 3).toUpperCase()}
        </Box>
      </Box>

      <Stack
        gap={compact ? 2 : 4}
        flex={1}
        p={compact ? { base: 2.5, sm: 3 } : { base: 4, sm: 5 }}
        minW={0}
      >
        <HStack align="flex-start" justify="space-between" gap={3}>
          <Heading
            size={compact ? 'sm' : 'md'}
            color="fg"
            lineHeight="1.25"
            css={
              compact
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
                : undefined
            }
          >
            {title}
          </Heading>
          <Stack gap={0} align="flex-end" flexShrink={0} textAlign="right">
            <Text fontWeight={800} fontSize={compact ? 'md' : 'lg'} color="fg">
              {budgetMain}
            </Text>
            <Text fontSize="2xs" color="muted">
              {budgetSub}
            </Text>
          </Stack>
        </HStack>

        <HStack gap={compact ? 2 : 4} flexWrap="wrap" rowGap={1}>
          <HStack gap={1} minW={0}>
            <Box flexShrink={0} transform={compact ? 'scale(0.85)' : undefined}>
              <IconMapPin />
            </Box>
            <Text fontSize={compact ? 'xs' : 'sm'} color="muted" truncate>
              {locationLabel}
            </Text>
          </HStack>
          <HStack gap={1}>
            <Box flexShrink={0} transform={compact ? 'scale(0.85)' : undefined}>
              <IconClock />
            </Box>
            <Text fontSize={compact ? 'xs' : 'sm'} color="muted">
              {timeLabel}
            </Text>
          </HStack>
          <HStack gap={1} minW={0}>
            <Box flexShrink={0} transform={compact ? 'scale(0.85)' : undefined}>
              <IconWrench />
            </Box>
            <Text fontSize={compact ? 'xs' : 'sm'} color="muted" truncate>
              {categoryLabel}
            </Text>
          </HStack>
        </HStack>

        <Text
          fontSize={compact ? 'xs' : 'sm'}
          color="muted"
          lineHeight="1.5"
          css={
            compact
              ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }
              : undefined
          }
        >
          {summary}
        </Text>

        <HStack gap={compact ? 2 : 3} flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
          <Button
            as={NextLink}
            href={offerHref}
            flex={{ base: '1 1 100%', sm: 2 }}
            minW={{ base: 'full', sm: compact ? '100px' : '140px' }}
            size={compact ? 'sm' : 'md'}
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
            minW={{ base: 'full', sm: compact ? '72px' : '100px' }}
            size={compact ? 'sm' : 'md'}
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
