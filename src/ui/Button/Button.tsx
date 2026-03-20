'use client'

import { type ButtonProps, Button as ChakraButton } from '@chakra-ui/react'

export type UiButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?: ButtonProps['variant'] | 'tool'
  href?: string
}

export function Button(props: UiButtonProps) {
  const { variant, ...restProps } = props
  const isToolButton = variant === 'tool'
  const resolvedVariant = isToolButton ? 'solid' : variant
  const usePrimaryGradient =
    (!resolvedVariant || resolvedVariant === 'solid') && !isToolButton
  const visualProps = isToolButton
    ? {
        bg: 'secondaryContainer',
        color: 'onSecondaryFixed',
        boxShadow: 'ambient',
      }
    : usePrimaryGradient
      ? {
          bg: 'linear-gradient(95deg, #003fb1 0%, #1a56db 100%)',
          color: 'white',
          boxShadow: 'ambient',
        }
      : {}

  return (
    <ChakraButton
      variant={resolvedVariant as ButtonProps['variant']}
      borderRadius="full"
      fontWeight={600}
      transition="all 160ms ease"
      px={5}
      {...visualProps}
      _hover={{ transform: 'translateY(-1px)', opacity: 0.95 }}
      _active={{ transform: 'translateY(0px)', opacity: 0.92 }}
      _focusVisible={{
        boxShadow: '0 0 0 3px rgba(0, 63, 177, 0.2)',
      }}
      {...restProps}
    />
  )
}
