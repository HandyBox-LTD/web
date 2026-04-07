'use client'

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  IconButton,
} from '@chakra-ui/react'
import type { ReactNode } from 'react'

import { Button } from '../Button'

export type AppDrawerPlacement = 'start' | 'end' | 'top' | 'bottom'

export type AppDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  children: ReactNode
  placement?: AppDrawerPlacement
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Footer button that closes the drawer; optional. */
  primaryActionLabel?: string
  onPrimaryAction?: () => void
}

export function AppDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  placement = 'start',
  size = 'md',
  primaryActionLabel,
  onPrimaryAction,
}: AppDrawerProps) {
  return (
    <DrawerRoot
      open={open}
      onOpenChange={(d: { open: boolean }) => onOpenChange(d.open)}
      placement={placement}
      size={size}
    >
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
            <DrawerCloseTrigger asChild>
              <IconButton aria-label="Close drawer" variant="ghost" size="sm">
                ×
              </IconButton>
            </DrawerCloseTrigger>
          </DrawerHeader>
          <DrawerBody>{children}</DrawerBody>
          {primaryActionLabel ? (
            <DrawerFooter>
              <Button
                variant="solid"
                w="full"
                onClick={() => {
                  onPrimaryAction?.()
                  onOpenChange(false)
                }}
              >
                {primaryActionLabel}
              </Button>
            </DrawerFooter>
          ) : null}
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  )
}
