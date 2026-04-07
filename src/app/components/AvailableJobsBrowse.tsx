'use client'

import { useQuery } from '@apollo/client/react'
import { Box, Grid, HStack, Stack, useBreakpointValue } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { TaskBrowseMapbox } from '@/app/components/TaskBrowseMapbox'
import { TASKS_QUERY } from '@/graphql/tasks'
import type { TaskListItem, TasksQueryData } from '@/graphql/tasks-query.types'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import {
  AppDrawer,
  AvailableJobCard,
  AvailableJobsHeader,
  Button,
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

export type AvailableJobsBrowseProps = {
  /**
   * `mapHero` — full-viewport map with a floating list panel (homepage default).
   * `classic` — filters + list in a grid, map panel below (no full bleed).
   */
  layout?: 'mapHero' | 'classic'
  headerTitle?: string
  headerSubtitle?: string
}

export function AvailableJobsBrowse({
  layout = 'mapHero',
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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
  const prevSelectedTaskIdRef = useRef<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list')

  const isDesktopSplit =
    useBreakpointValue({ base: false, md: true }, { fallback: 'base' }) ?? false

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

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

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

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE))

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)))
  }, [totalPages])

  const safePage = Math.min(page, totalPages - 1)
  const sliceStart = safePage * PAGE_SIZE
  const pageItems = filteredSorted.slice(sliceStart, sliceStart + PAGE_SIZE)

  useEffect(() => {
    if (!selectedTaskId) {
      prevSelectedTaskIdRef.current = null
      return
    }
    if (!filteredSorted.some((t) => t.id === selectedTaskId)) {
      setSelectedTaskId(null)
      prevSelectedTaskIdRef.current = null
      return
    }
  }, [filteredSorted, selectedTaskId])

  useEffect(() => {
    if (selectedTaskId === prevSelectedTaskIdRef.current) return
    prevSelectedTaskIdRef.current = selectedTaskId
    if (!selectedTaskId) return
    const idx = filteredSorted.findIndex((t) => t.id === selectedTaskId)
    if (idx < 0) return
    setPage(Math.floor(idx / PAGE_SIZE))
  }, [selectedTaskId, filteredSorted])

  useEffect(() => {
    if (!selectedTaskId) return
    if (!pageItems.some((t) => t.id === selectedTaskId)) return
    const el = cardRefs.current.get(selectedTaskId)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedTaskId, pageItems])

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
      showMapPromo={false}
    />
  )

  const mapTasksForBox = useMemo(
    () =>
      filteredSorted.map((task) => {
        const { main, sub } = formatBudget(task)
        return {
          id: task.id,
          title: task.title,
          location: task.location,
          locationLat: task.locationLat,
          locationLng: task.locationLng,
          detailLine: `${main} · ${sub}`,
        }
      }),
    [filteredSorted],
  )

  const listBody = (
    <>
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
            <Box
              key={task.id}
              ref={(node: HTMLDivElement | null) => {
                if (node) cardRefs.current.set(task.id, node)
                else cardRefs.current.delete(task.id)
              }}
            >
              <AvailableJobCard
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
                isActive={selectedTaskId === task.id}
                onActivate={() => setSelectedTaskId(task.id)}
              />
            </Box>
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
    </>
  )

  if (layout === 'mapHero') {
    const listPanelInner = (
      <>
        <Box
          px={{ base: 3, md: 4 }}
          pt={{ base: 3, md: 4 }}
          pb={2}
          flexShrink={0}
        >
          <HStack gap={2} flexWrap="wrap" align="center">
            <Button
              type="button"
              variant="subtle"
              bg="surfaceContainerHigh"
              size="sm"
              onClick={() => setFiltersOpen(true)}
            >
              Filters
            </Button>
          </HStack>
        </Box>

        <Box px={{ base: 3, md: 4 }} pt={0} flexShrink={0}>
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
        </Box>

        <Box
          flex={1}
          minH={0}
          overflowY="auto"
          px={{ base: 3, md: 4 }}
          pb={{ base: 3, md: 4 }}
        >
          <Stack gap={4}>{listBody}</Stack>
        </Box>
      </>
    )

    return (
      <>
        <AppDrawer
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          title="Filters"
          description="Refine tasks by search, area, budget, and urgency."
          placement="start"
          size="md"
          primaryActionLabel="Apply"
        >
          {filterBlock}
        </AppDrawer>

        <Box position="relative" w="full" minH="100dvh">
          <Box
            position="absolute"
            inset={0}
            display={
              isDesktopSplit ? 'block' : mobileView === 'map' ? 'block' : 'none'
            }
            zIndex={0}
          >
            <TaskBrowseMapbox
              accessToken={mapboxToken}
              centerLat={queryVariables.lat}
              centerLng={queryVariables.lng}
              radiusMiles={queryVariables.radiusMiles}
              tasks={mapTasksForBox}
              variant="fullscreen"
              visible={isDesktopSplit || mobileView === 'map'}
              selectedTaskId={selectedTaskId}
              onMarkerSelect={(id) => {
                setSelectedTaskId(id)
                if (!isDesktopSplit) setMobileView('list')
              }}
            />
          </Box>

          <Box
            position="absolute"
            zIndex={2}
            top={{ base: 3, md: 5 }}
            left={{ base: 3, md: 5 }}
            bottom={{ base: 3, md: 5 }}
            w={{
              base: 'calc(100% - 24px)',
              md: 'min(420px, 38vw)',
            }}
            maxW="440px"
            display="flex"
            flexDirection="column"
            pointerEvents="none"
          >
            <Stack
              gap={0}
              flex={1}
              minH={0}
              bg="surfaceContainerLowest"
              borderRadius="2xl"
              boxShadow="0 8px 40px rgba(15,23,42,0.18)"
              borderWidth="1px"
              borderColor="border"
              overflow="hidden"
              pointerEvents="auto"
              display={
                isDesktopSplit
                  ? 'flex'
                  : mobileView === 'list'
                    ? 'flex'
                    : 'none'
              }
            >
              {listPanelInner}
            </Stack>
          </Box>

          {!isDesktopSplit ? (
            <HStack
              position="absolute"
              zIndex={3}
              bottom={4}
              left="50%"
              transform="translateX(-50%)"
              gap={2}
              bg="surfaceContainerLowest"
              borderRadius="full"
              boxShadow="0 4px 24px rgba(15,23,42,0.15)"
              borderWidth="1px"
              borderColor="border"
              p={1}
            >
              <Button
                type="button"
                size="sm"
                variant={mobileView === 'list' ? 'solid' : 'subtle'}
                borderRadius="full"
                px={5}
                onClick={() => setMobileView('list')}
              >
                List
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mobileView === 'map' ? 'solid' : 'subtle'}
                borderRadius="full"
                px={5}
                onClick={() => setMobileView('map')}
              >
                Map
              </Button>
            </HStack>
          ) : null}
        </Box>
      </>
    )
  }

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

      <Grid
        templateColumns={{ base: '1fr', lg: 'minmax(260px,320px) 1fr' }}
        gap={{ base: 8, lg: 10 }}
        alignItems="start"
      >
        <Box position={{ lg: 'sticky' }} top={{ lg: 6 }}>
          {filterBlock}
        </Box>
        <Stack gap={5}>{listBody}</Stack>
      </Grid>

      <TaskBrowseMapbox
        accessToken={mapboxToken}
        centerLat={queryVariables.lat}
        centerLng={queryVariables.lng}
        radiusMiles={queryVariables.radiusMiles}
        tasks={mapTasksForBox}
        variant="panel"
        selectedTaskId={selectedTaskId}
        onMarkerSelect={setSelectedTaskId}
      />
    </Stack>
  )
}
