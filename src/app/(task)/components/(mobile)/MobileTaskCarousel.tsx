'use client'

import { taskPublicLocationLabel } from '@/utils/taskLocationDisplay'
import { Box, HStack } from '@chakra-ui/react'
import useEmblaCarousel from 'embla-carousel-react'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import { motion } from 'motion/react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Text } from '@ui'
import { TaskBrowseListItem } from '../(web)/TaskBrowseListItem'
import { useTaskBrowseData } from '../../context/TaskBrowseProvider'
import { formatBudget, inferBadge } from '../../helpers/taskBrowseHelpers'

export function MobileTaskCarousel() {
  const { pageItems, selectedTaskId, setSelectedTaskId } = useTaskBrowseData()
  const tasks = useMemo(
    () =>
      pageItems.map((task) => {
        const { main } = formatBudget(task)
        const badge = inferBadge(task)
        return {
          id: task.id,
          title: task.title,
          description: task.description,
          location:
            taskPublicLocationLabel(task).trim() || 'Location on request',
          priceLabel: main,
          badgeText: badge.text,
          thumbnailSrc: task.images?.[0] ?? undefined,
        }
      }),
    [pageItems],
  )
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'center',
      /** Allow first/last slide to reach true center with symmetric track padding. */
      containScroll: false,
      dragFree: false,
    },
    [WheelGesturesPlugin()],
  )

  const viewportElRef = useRef<HTMLDivElement | null>(null)
  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewportElRef.current = node
      emblaRef(node)
    },
    [emblaRef],
  )

  /** Half of leftover width so first/last slides can sit in the viewport centre (matches slide flex-basis). */
  const [centeringPadPx, setCenteringPadPx] = useState(0)

  useLayoutEffect(() => {
    const el = viewportElRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const slideW = Math.min(420, Math.max(0, w - 52))
      setCenteringPadPx(Math.max(0, Math.round((w - slideW) / 2)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    void centeringPadPx
    emblaApi.reInit()
  }, [emblaApi, centeringPadPx])

  useEffect(() => {
    if (!emblaApi || !selectedTaskId) return
    void centeringPadPx
    const selectedIndex = tasks.findIndex((task) => task.id === selectedTaskId)
    if (selectedIndex < 0) return
    emblaApi.scrollTo(selectedIndex)
  }, [emblaApi, selectedTaskId, tasks, centeringPadPx])

  const handleSelectTask = (taskId: string) => {
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null)
      requestAnimationFrame(() => {
        setSelectedTaskId(taskId)
      })
      return
    }
    setSelectedTaskId(taskId)
  }

  if (tasks.length === 0) {
    return (
      <Box
        bg="surfaceContainerLowest/96"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="border"
        maxWidth="420px"
        mx="auto"
        w="full"
        boxShadow="0 8px 24px rgba(15,23,42,0.2)"
        px={4}
        py={3}
      >
        <Text fontSize="sm" color="muted">
          No tasks match current filters.
        </Text>
      </Box>
    )
  }

  return (
    <Box
      ref={setViewportRef}
      pointerEvents="auto"
      overflow="hidden"
      px={3}
      mb={1}
      style={{
        maskImage:
          'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 24px, rgba(0,0,0,1) calc(100% - 24px), rgba(0,0,0,0) 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 24px, rgba(0,0,0,1) calc(100% - 24px), rgba(0,0,0,0) 100%)',
      }}
    >
      <HStack
        gap={3}
        align="stretch"
        justify="flex-start"
        pl={`${centeringPadPx}px`}
        pr={`${centeringPadPx}px`}
        css={{
          touchAction: 'pan-y pinch-zoom',
        }}
      >
        {tasks.map((task) => {
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: '0 0 min(420px, 100%)',
                maxWidth: '420px',
                minWidth: '0',
              }}
            >
              <TaskBrowseListItem
                task={task}
                isActive={selectedTaskId === task.id}
                onActivate={() => handleSelectTask(task.id)}
              />
            </motion.div>
          )
        })}
      </HStack>
    </Box>
  )
}
