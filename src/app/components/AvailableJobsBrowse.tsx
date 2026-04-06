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
  { value: 'nearest', label: 'Nearest' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
] as const

const LONDON_LAT = 51.5074
const LONDON_LNG = -0.1278

function startOfLocalDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function endOfLocalDay(d = new Date()) {
  const x = startOfLocalDay(d)
  x.setHours(23, 59, 59, 999)
  return x
}

function mapTasksToPreviewPositions(
  tasks: TaskListItem[],
): Map<string, { leftPct: number; topPct: number }> {
  const withCoords = tasks.filter(
    (t) =>
      t.locationLat != null &&
      t.locationLng != null &&
      Number.isFinite(t.locationLat) &&
      Number.isFinite(t.locationLng),
  )
  const map = new Map<string, { leftPct: number; topPct: number }>()
  if (withCoords.length === 0) return map

  let minLat = withCoords[0].locationLat as number
  let maxLat = minLat
  let minLng = withCoords[0].locationLng as number
  let maxLng = minLng
  for (const t of withCoords) {
    const la = t.locationLat as number
    const ln = t.locationLng as number
    minLat = Math.min(minLat, la)
    maxLat = Math.max(maxLat, la)
    minLng = Math.min(minLng, ln)
    maxLng = Math.max(maxLng, ln)
  }
  const latPad = Math.max((maxLat - minLat) * 0.08, 0.002)
  const lngPad = Math.max((maxLng - minLng) * 0.08, 0.002)
  minLat -= latPad
  maxLat += latPad
  minLng -= lngPad
  maxLng += lngPad
  const latSpan = maxLat - minLat || 1
  const lngSpan = maxLng - minLng || 1

  for (const t of withCoords) {
    const la = t.locationLat as number
    const ln = t.locationLng as number
    const leftPct = 10 + ((ln - minLng) / lngSpan) * 80
    const topPct = 15 + (1 - (la - minLat) / latSpan) * 70
    map.set(t.id, { leftPct, topPct })
  }
  return map
}

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

function TasksMapPanel({
  tasks,
  positions,
}: {
  tasks: TaskListItem[]
  positions: Map<string, { leftPct: number; topPct: number }>
}) {
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
        aria-label="Map preview of open tasks with coordinates"
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
          Pins use task coordinates when available; search uses London as the
          default centre with your chosen radius.
        </Text>
        {tasks.map((task, i) => {
          const pos = positions.get(task.id)
          const left = pos?.leftPct ?? 12 + ((i * 17) % 76)
          const top = pos?.topPct ?? 18 + ((i * 23) % 62)
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
  const [sort, setSort] = useState<string>('nearest')
  const [page, setPage] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(FILTER_CATEGORIES),
  )
  const [radiusMiles, setRadiusMiles] = useState(10)
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [urgency, setUrgency] = useState<UrgencyFilter>('any')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      300,
    )
    return () => window.clearTimeout(t)
  }, [searchInput])

  const queryVariables = useMemo(() => {
    const minStr = minBudget.trim()
    const maxStr = maxBudget.trim()
    const minP = minStr === '' ? undefined : Number.parseFloat(minStr) * 100
    const maxP = maxStr === '' ? undefined : Number.parseFloat(maxStr) * 100
    const radius = Math.min(500, Math.max(1, radiusMiles))
    const singleCategory =
      selectedCategories.size === 1 ? [...selectedCategories][0] : undefined

    let dateTimeFrom: string | undefined
    let dateTimeTo: string | undefined
    if (urgency === 'today') {
      dateTimeFrom = startOfLocalDay().toISOString()
      dateTimeTo = endOfLocalDay().toISOString()
    } else if (urgency === 'week') {
      const start = startOfLocalDay()
      start.setDate(start.getDate() - 6)
      dateTimeFrom = start.toISOString()
      dateTimeTo = endOfLocalDay().toISOString()
    }

    return {
      lat: LONDON_LAT,
      lng: LONDON_LNG,
      radiusMiles: radius,
      search: debouncedSearch || undefined,
      category: singleCategory,
      minPricePence:
        minP != null && Number.isFinite(minP) ? Math.round(minP) : undefined,
      maxPricePence:
        maxP != null && Number.isFinite(maxP) ? Math.round(maxP) : undefined,
      dateTimeFrom,
      dateTimeTo,
    }
  }, [
    debouncedSearch,
    minBudget,
    maxBudget,
    radiusMiles,
    selectedCategories,
    urgency,
  ])

  const { data, loading, error } = useQuery<TasksQueryData>(TASKS_QUERY, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
  })

  const filteredSorted = useMemo(() => {
    const items = data?.tasks ?? []

    let next = items.filter((task) => {
      if (selectedCategories.size > 0) {
        const cat = (task.category ?? '').trim()
        if (cat && !selectedCategories.has(cat)) return false
      }
      if (urgency === 'emergency' && !matchesUrgency(task, urgency)) {
        return false
      }
      return true
    })

    if (sort === 'newest' || sort === 'oldest') {
      next = [...next].sort((a, b) => {
        const ta = taskCreatedTime(a)
        const tb = taskCreatedTime(b)
        return sort === 'oldest' ? ta - tb : tb - ta
      })
    }
    return next
  }, [data, selectedCategories, urgency, sort])

  const mapPositions = useMemo(
    () => mapTasksToPreviewPositions(filteredSorted),
    [filteredSorted],
  )

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
        searchQuery={searchInput}
        onSearchChange={(v) => {
          setSearchInput(v)
          setPage(0)
        }}
        radiusMiles={radiusMiles}
        onRadiusChange={(m) => {
          setRadiusMiles(m)
          setPage(0)
        }}
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
          <TasksMapPanel tasks={pageItems} positions={mapPositions} />
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
