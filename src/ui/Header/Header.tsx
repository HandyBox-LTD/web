'use client'

import { Box, type BoxProps, HStack, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

import { clearAuthToken, getAuthToken } from '@/utils/auth'
import { Button } from '../Button'
import { Container } from '../Container'
import { Heading } from '../Typography'

export type HeaderActiveItem =
  | 'home'
  | 'tasks'
  | 'my-tasks'
  | 'post-task'
  | 'profile'
  | 'none'

export type HeaderProps = {
  /** When omitted and `children` is omitted, renders the default site navigation. */
  activeItem?: HeaderActiveItem
  children?: React.ReactNode
} & Omit<BoxProps, 'children'>

function SiteNavigation() {
  const router = useRouter()
  const isLoggedIn = Boolean(getAuthToken())
  const taskerHref = isLoggedIn
    ? '/dashboard'
    : `/login?next=${encodeURIComponent('/dashboard')}`

  return (
    <HStack
      justify="space-between"
      align="center"
      gap={4}
      py={2}
      flexWrap="wrap"
    >
      <Heading size="md">
        <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
          HandyBox
        </Link>
      </Heading>

      <HStack gap={{ base: 2, md: 3 }} flexWrap="wrap" justify="flex-end">
        {isLoggedIn ? (
          <>
            <Link
              as={NextLink}
              href="/quotes"
              fontSize="sm"
              fontWeight={600}
              color="muted"
              _hover={{ textDecoration: 'none', color: 'primary.700' }}
            >
              Quotes
            </Link>
            <Link
              as={NextLink}
              href="/requests"
              fontSize="sm"
              fontWeight={600}
              color="muted"
              _hover={{ textDecoration: 'none', color: 'primary.700' }}
            >
              Requests
            </Link>
            <Link
              as={NextLink}
              href="/profile"
              fontSize="sm"
              fontWeight={600}
              color="muted"
              _hover={{ textDecoration: 'none', color: 'primary.700' }}
            >
              Profile
            </Link>
            <Button
              size="sm"
              variant="subtle"
              onClick={() => {
                clearAuthToken()
                router.push('/')
              }}
            >
              Log out
            </Button>
          </>
        ) : null}
        <Button as={NextLink} href="/tasks/create" size="sm" variant="outline">
          Post a task
        </Button>
        <Button as={NextLink} href={taskerHref} size="sm">
          Become a tasker
        </Button>
      </HStack>
    </HStack>
  )
}

export function Header({
  activeItem: _activeItem = 'none',
  children,
  ...props
}: HeaderProps) {
  return (
    <Box
      as="header"
      bg="surfaceBright"
      borderRadius="xl"
      backdropFilter="blur(20px)"
      boxShadow="ambient"
      px={{ base: 2, md: 0 }}
      py={1}
      {...props}
    >
      <Container>{children ?? <SiteNavigation />}</Container>
    </Box>
  )
}
