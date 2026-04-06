'use client'

import { useQuery } from '@apollo/client/react'
import { Box, Grid, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { TASKS_QUERY } from '@/graphql/tasks'
import type { TaskListItem, TasksQueryData } from '@/graphql/tasks-query.types'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import {
  AvailableJobCard,
  AvailableJobsHeader,
  TaskBrowseFilters,
  TaskListPagination,
  Text,
} from '@ui'
import type { JobCardBadgeVariant, UrgencyFilter } from '@ui'

const PAGE_SIZE = 5

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
] as const

const FILTER_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'HVAC',
] as const

function formatBudget(task: TaskListItem): { main: string; sub: string } {
  const fixed = task.priceOfferPence
  if (fixed != null && fixed > 0) {
    return {
      main: `£${(fixed / 100).toFixed(0)}`,
      sub: 'Fixed price',
    }
  }
  const offers = task.offers
  if (offers.length === 0) {
    return { main: 'Open', sub: 'Estimated budget' }
  }
  const prices = offers.map((o) => o.pricePence)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) {
    return {
      main: `£${(min / 100).toFixed(0)}`,
      sub: 'From offers',
    }
  }
  return {
    main: `£${(min / 100).toFixed(0)} – £${(max / 100).toFixed(0)}`,
    sub: 'Estimated budget',
  }
}

function effectiveBudgetPence(task: TaskListItem): number | null {
  if (task.priceOfferPence != null && task.priceOfferPence > 0) {
    return task.priceOfferPence
  }
  if (task.offers.length === 0) return null
  return Math.min(...task.offers.map((o) => o.pricePence))
}

function taskCreatedTime(task: TaskListItem): number {
  const raw = task.createdAt
  const d =
    typeof raw === 'string' || typeof raw === 'number'
      ? new Date(raw)
      : raw instanceof Date
        ? raw
        : null
  if (!d || Number.isNaN(d.getTime())) return 0
  return d.getTime()
}

function inferBadge(task: TaskListItem): {
  variant: JobCardBadgeVariant
  text?: string
} {
  const t = `${task.title} ${task.description}`.toLowerCase()
  if (t.includes('emergency') || t.includes('urgent') || t.includes('burst')) {
    return { variant: 'emergency', text: 'EMERGENCY' }
  }
  if (
    task.description.length > 280 ||
    (task.priceOfferPence != null && task.priceOfferPence >= 50_000)
  ) {
    return { variant: 'featured', text: 'BIG PROJECT' }
  }
  return { variant: 'none' }
}

function matchesUrgency(task: TaskListItem, urgency: UrgencyFilter): boolean {
  if (urgency === 'any') return true
  const t = `${task.title} ${task.description}`.toLowerCase()
  if (urgency === 'emergency') {
    return (
      t.includes('emergency') ||
      t.includes('urgent') ||
      t.includes('asap') ||
      t.includes('burst')
    )
  }
  const ms = taskCreatedTime(task)
  if (!ms) return true
  const age = Date.now() - ms
  const day = 86_400_000
  if (urgency === 'today') return age <= day
  if (urgency === 'week') return age <= 7 * day
  return true
}

function TasksMapPanel({ tasks }: { tasks: TaskListItem[] }) {
  return (
    <Box
      borderRadius="xl"
      position={{ lg: 'sticky' }}
      top={{ lg: 6 }}
      h={{ base: '280px', lg: 'min(70vh, 560px)' }}
      bg="linear-gradient(165deg, #dbe5f7 0%, #c5d9f5 40%, #e8eef8 100%)"
      boxShadow="ghostBorder"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border"
    >
      <Box
        position="relative"
        w="full"
        h="full"
        role="img"
        aria-label="Illustrative map of open tasks on this page"
      >
        <Text
          position="absolute"
          top={4}
          left={4}
          fontSize="xs"
          fontWeight={700}
          color="muted"
        >
          Map preview
        </Text>
        <Text
          position="absolute"
          bottom={4}
          left={4}
          right={4}
          fontSize="xs"
          color="muted"
        >
          Pins match the current page of results. Real geocoding will replace
          this layout when locations include coordinates.
        </Text>
        {tasks.map((task, i) => {
          const left = 12 + ((i * 17) % 76)
          const top = 18 + ((i * 23) % 62)
          return (
            <Link
              key={task.id}
              as={NextLink}
              href={`/task/${task.id}`}
              position="absolute"
              left={`${left}%`}
              top={`${top}%`}
              w={3}
              h={3}
              borderRadius="full"
              bg="primary.500"
              borderWidth="2px"
              borderColor="white"
              boxShadow="sm"
              title={task.title}
              aria-label={`Open task: ${task.title}`}
              _hover={{ textDecoration: 'none', opacity: 0.9 }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export type AvailableJobsBrowseProps = {
  layout?: 'default' | 'mapSplit'
  headerTitle?: string
  headerSubtitle?: string
}

export function AvailableJobsBrowse({
  layout = 'default',
  headerTitle = 'Find work near you',
  headerSubtitle,
}: AvailableJobsBrowseProps = {}) {
  const [sort, setSort] = useState<string>('newest')
  const [page, setPage] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(FILTER_CATEGORIES),
  )
  const [radiusMiles, setRadiusMiles] = useState(15)
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [urgency, setUrgency] = useState<UrgencyFilter>('any')

  const { data, loading, error } = useQuery<TasksQueryData>(TASKS_QUERY, {
    notifyOnNetworkStatusChange: true,
  })

  const filteredSorted = useMemo(() => {
    const items = data?.tasks.items ?? []
    const minP =
      minBudget.trim() === '' ? null : Number.parseFloat(minBudget) * 100
    const maxP =
      maxBudget.trim() === '' ? null : Number.parseFloat(maxBudget) * 100

    let next = items.filter((task) => {
      if (selectedCategories.size > 0) {
        const cat = (task.category ?? '').trim()
        if (cat && !selectedCategories.has(cat)) return false
      }
      const budget = effectiveBudgetPence(task)
      if (minP != null && Number.isFinite(minP)) {
        if (budget == null || budget < minP) return false
      }
      if (maxP != null && Number.isFinite(maxP)) {
        if (budget == null || budget > maxP) return false
      }
      if (!matchesUrgency(task, urgency)) return false
      return true
    })

    next = [...next].sort((a, b) => {
      const ta = taskCreatedTime(a)
      const tb = taskCreatedTime(b)
      return sort === 'oldest' ? ta - tb : tb - ta
    })
    return next
  }, [data, selectedCategories, minBudget, maxBudget, urgency, sort])

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE))

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)))
  }, [totalPages])

  const safePage = Math.min(page, totalPages - 1)
  const sliceStart = safePage * PAGE_SIZE
  const pageItems = filteredSorted.slice(sliceStart, sliceStart + PAGE_SIZE)

  const toggleCategory = (category: string, checked: boolean) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (checked) next.add(category)
      else next.delete(category)
      return next
    })
    setPage(0)
  }

  const subtitle =
    headerSubtitle ??
    `Browse ${filteredSorted.length} open tasks. Details are read-only until you sign in to quote.`

  const filterBlock = (
    <Box position={{ lg: 'sticky' }} top={{ lg: 6 }}>
      <TaskBrowseFilters
        categories={FILTER_CATEGORIES}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        radiusMiles={radiusMiles}
        onRadiusChange={setRadiusMiles}
        minBudgetPounds={minBudget}
        maxBudgetPounds={maxBudget}
        onMinBudgetChange={(v) => {
          setMinBudget(v)
          setPage(0)
        }}
        onMaxBudgetChange={(v) => {
          setMaxBudget(v)
          setPage(0)
        }}
        urgency={urgency}
        onUrgencyChange={(u) => {
          setUrgency(u)
          setPage(0)
        }}
        mapHref="/map"
        showMapPromo={layout !== 'mapSplit'}
      />
    </Box>
  )

  const listBlock = (
    <Stack gap={5}>
      {loading && !data ? (
        <Text color="muted">Loading tasks…</Text>
      ) : error ? (
        <Text color="red.400" fontSize="sm">
          {error.message}
        </Text>
      ) : pageItems.length === 0 ? (
        <Text color="muted">
          No tasks match your filters. Try widening category or budget.
        </Text>
      ) : (
        pageItems.map((task) => {
          const { main, sub } = formatBudget(task)
          const badge = inferBadge(task)
          const loc = task.location?.trim() || 'Location on request'
          const cat = task.category?.trim() || 'General'
          return (
            <AvailableJobCard
              key={task.id}
              title={task.title}
              description={task.description}
              locationLabel={loc}
              timeLabel={formatRelativeTime(task.createdAt)}
              categoryLabel={cat}
              budgetMain={main}
              budgetSub={sub}
              badgeVariant={badge.variant}
              badgeText={badge.text}
              imageFallback={cat.slice(0, 2)}
              offerHref={`/task/${task.id}#offer`}
              detailsHref={`/task/${task.id}`}
            />
          )
        })
      )}

      {!error && filteredSorted.length > 0 ? (
        <TaskListPagination
          page={safePage}
          totalPages={totalPages}
          onPrevious={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          onSelectPage={setPage}
        />
      ) : null}
    </Stack>
  )

  return (
    <Stack gap={{ base: 8, md: 10 }}>
      <AvailableJobsHeader
        title={headerTitle}
        subtitle={subtitle}
        sortValue={sort}
        sortOptions={SORT_OPTIONS}
        onSortChange={(v) => {
          setSort(v)
          setPage(0)
        }}
      />

      {layout === 'mapSplit' ? (
        <Grid
          templateColumns={{
            base: '1fr',
            lg: 'minmax(260px,320px) minmax(0,1fr) minmax(280px,1fr)',
          }}
          gap={{ base: 8, lg: 10 }}
          alignItems="start"
        >
          {filterBlock}
          {listBlock}
          <TasksMapPanel tasks={pageItems} />
        </Grid>
      ) : (
        <Grid
          templateColumns={{ base: '1fr', lg: 'minmax(260px,320px) 1fr' }}
          gap={{ base: 8, lg: 10 }}
          alignItems="start"
        >
          {filterBlock}
          {listBlock}
        </Grid>
      )}
    </Stack>
  )
}
