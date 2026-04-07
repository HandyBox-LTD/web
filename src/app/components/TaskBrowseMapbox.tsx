'use client'

import { Box, Text } from '@chakra-ui/react'
import type { GeoJSONSource, Map as MapboxMap, Marker, Popup } from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'

export type TaskBrowseMapTask = {
  id: string
  title: string
  location?: string | null
  locationLat?: number | null
  locationLng?: number | null
  /** Short line for popup (e.g. budget). */
  detailLine?: string | null
}

export type TaskBrowseMapboxProps = {
  accessToken: string | undefined
  centerLat: number
  centerLng: number
  radiusMiles: number
  tasks: TaskBrowseMapTask[]
  /** Fills the positioned parent (`position: relative` + height). */
  variant?: 'panel' | 'fullscreen'
  selectedTaskId?: string | null
  onMarkerSelect?: (taskId: string) => void
  /**
   * When false, the map may be `display:none` (e.g. mobile list tab). Toggle to
   * true so Mapbox can `resize()` after becoming visible.
   */
  visible?: boolean
}

function milesToLatDegrees(miles: number) {
  return miles / 69
}

function milesToLngDegrees(miles: number, atLatDeg: number) {
  const cosLat = Math.cos((atLatDeg * Math.PI) / 180)
  const denom = 69 * Math.max(Math.abs(cosLat), 0.2)
  return miles / denom
}

function circlePolygonRing(
  centerLng: number,
  centerLat: number,
  radiusMiles: number,
  steps = 64,
): [number, number][] {
  const dLat = milesToLatDegrees(radiusMiles)
  const dLng = milesToLngDegrees(radiusMiles, centerLat)
  const ring: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * 2 * Math.PI
    ring.push([centerLng + dLng * Math.cos(a), centerLat + dLat * Math.sin(a)])
  }
  return ring
}

function radiusFeature(
  centerLng: number,
  centerLat: number,
  radiusMiles: number,
) {
  const ring = circlePolygonRing(centerLng, centerLat, radiusMiles)
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [ring],
    },
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildPopupHtml(task: TaskBrowseMapTask) {
  const loc = (task.location ?? '').trim() || 'Location on map'
  const detail = (task.detailLine ?? '').trim()
  return `
    <div style="padding:4px 2px;min-width:160px;max-width:240px;font-family:system-ui,sans-serif;font-size:13px;line-height:1.35;">
      <div style="font-weight:700;color:#0f172a;margin-bottom:4px;">${escapeHtml(task.title)}</div>
      <div style="color:#64748b;font-size:12px;">${escapeHtml(loc)}</div>
      ${detail ? `<div style="margin-top:6px;color:#1e293b;font-size:12px;font-weight:600;">${escapeHtml(detail)}</div>` : ''}
    </div>
  `
}

function markerButtonEl(selected: boolean): {
  el: HTMLButtonElement
  setSelected: (v: boolean) => void
} {
  const el = document.createElement('button')
  el.type = 'button'
  const apply = (isSel: boolean) => {
    const s = isSel ? 22 : 15
    Object.assign(el.style, {
      display: 'block',
      width: `${s}px`,
      height: `${s}px`,
      padding: '0',
      borderRadius: '9999px',
      background: isSel ? '#ea580c' : '#1A56DB',
      border: isSel ? '3px solid #ffffff' : '2px solid #ffffff',
      boxShadow: isSel
        ? '0 2px 10px rgba(234,88,12,0.45)'
        : '0 1px 4px rgba(0,0,0,0.25)',
      cursor: 'pointer',
      transition: 'width 0.15s ease, height 0.15s ease, background 0.15s ease',
    })
  }
  apply(selected)
  return {
    el,
    setSelected: (v: boolean) => apply(v),
  }
}

export function TaskBrowseMapbox({
  accessToken,
  centerLat,
  centerLng,
  radiusMiles,
  tasks,
  variant = 'panel',
  selectedTaskId = null,
  onMarkerSelect,
  visible = true,
}: TaskBrowseMapboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const markersRef = useRef<
    { marker: Marker; taskId: string; setSelected: (v: boolean) => void }[]
  >([])
  const hoverPopupRef = useRef<Popup | null>(null)
  const onMarkerSelectRef = useRef(onMarkerSelect)
  onMarkerSelectRef.current = onMarkerSelect
  const [mapReady, setMapReady] = useState(false)
  const prevTasksSigRef = useRef<string>('')

  // biome-ignore lint/correctness/useExhaustiveDependencies: init once per token; centre/radius sync in later effects
  useEffect(() => {
    if (!accessToken?.trim() || !containerRef.current) {
      setMapReady(false)
      return
    }

    let cancelled = false
    const container = containerRef.current

    void import('mapbox-gl').then((mapboxgl) => {
      if (cancelled || !container) return

      mapboxgl.default.accessToken = accessToken

      const map = new mapboxgl.default.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [centerLng, centerLat],
        zoom: 11,
      })

      map.addControl(new mapboxgl.default.NavigationControl(), 'top-right')
      mapRef.current = map

      map.on('load', () => {
        if (cancelled) return
        map.addSource('search-radius', {
          type: 'geojson',
          data: radiusFeature(centerLng, centerLat, radiusMiles),
        })
        map.addLayer({
          id: 'search-radius-fill',
          type: 'fill',
          source: 'search-radius',
          paint: {
            'fill-color': '#1A56DB',
            'fill-opacity': 0.08,
          },
        })
        map.addLayer({
          id: 'search-radius-line',
          type: 'line',
          source: 'search-radius',
          paint: {
            'line-color': '#1A56DB',
            'line-width': 2,
            'line-opacity': 0.35,
          },
        })
        setMapReady(true)
      })
    })

    return () => {
      cancelled = true
      setMapReady(false)
      hoverPopupRef.current?.remove()
      hoverPopupRef.current = null
      for (const { marker } of markersRef.current) marker.remove()
      markersRef.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [accessToken])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map?.isStyleLoaded()) return

    const source = map.getSource('search-radius') as GeoJSONSource | undefined
    source?.setData(radiusFeature(centerLng, centerLat, radiusMiles))
    map.easeTo({ center: [centerLng, centerLat], duration: 450 })
  }, [mapReady, centerLat, centerLng, radiusMiles])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map || !visible) return
    const id = requestAnimationFrame(() => {
      map.resize()
    })
    return () => cancelAnimationFrame(id)
  }, [mapReady, visible])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map?.isStyleLoaded()) return

    hoverPopupRef.current?.remove()
    hoverPopupRef.current = null
    for (const { marker } of markersRef.current) marker.remove()
    markersRef.current = []

    const withCoords = tasks.filter(
      (t) =>
        t.locationLat != null &&
        t.locationLng != null &&
        Number.isFinite(t.locationLat) &&
        Number.isFinite(t.locationLng),
    )

    void import('mapbox-gl').then((mapboxgl) => {
      const current = mapRef.current
      if (!current?.isStyleLoaded()) return

      for (const task of withCoords) {
        const { el, setSelected } = markerButtonEl(false)
        el.setAttribute(
          'aria-label',
          `Task: ${task.title}. Select to highlight in list.`,
        )
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          onMarkerSelectRef.current?.(task.id)
        })

        const lng = task.locationLng as number
        const lat = task.locationLat as number

        let enterTimer: ReturnType<typeof setTimeout> | undefined
        el.addEventListener('mouseenter', () => {
          enterTimer = setTimeout(() => {
            hoverPopupRef.current?.remove()
            const popup = new mapboxgl.default.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 18,
              maxWidth: '280px',
              className: 'task-browse-map-popup',
            })
              .setLngLat([lng, lat])
              .setHTML(buildPopupHtml(task))
              .addTo(current)
            hoverPopupRef.current = popup
          }, 120)
        })
        el.addEventListener('mouseleave', () => {
          if (enterTimer) clearTimeout(enterTimer)
          hoverPopupRef.current?.remove()
          hoverPopupRef.current = null
        })

        const marker = new mapboxgl.default.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(current)
        markersRef.current.push({ marker, taskId: task.id, setSelected })
      }

      const sig = withCoords
        .map((t) => `${t.id}:${t.locationLat},${t.locationLng}`)
        .join('|')
      const tasksChanged = sig !== prevTasksSigRef.current
      prevTasksSigRef.current = sig

      if (tasksChanged && withCoords.length > 0) {
        const b = new mapboxgl.default.LngLatBounds()
        for (const t of withCoords) {
          b.extend([t.locationLng as number, t.locationLat as number])
        }
        b.extend([centerLng, centerLat])
        current.fitBounds(b, {
          padding: variant === 'fullscreen' ? 80 : 48,
          maxZoom: 13,
          duration: 500,
        })
      } else if (tasksChanged && withCoords.length === 0) {
        current.easeTo({
          center: [centerLng, centerLat],
          zoom: 11,
          duration: 400,
        })
      }
    })
  }, [mapReady, tasks, centerLat, centerLng, variant])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map?.isStyleLoaded() || !selectedTaskId) return

    const task = tasks.find((t) => t.id === selectedTaskId)
    if (
      !task ||
      task.locationLat == null ||
      task.locationLng == null ||
      !Number.isFinite(task.locationLat) ||
      !Number.isFinite(task.locationLng)
    ) {
      return
    }

    map.flyTo({
      center: [task.locationLng, task.locationLat],
      zoom: Math.max(map.getZoom(), 13.5),
      duration: 650,
      essential: true,
    })
  }, [mapReady, selectedTaskId, tasks])

  useEffect(() => {
    for (const row of markersRef.current) {
      row.setSelected(row.taskId === selectedTaskId)
    }
  }, [selectedTaskId])

  if (!accessToken?.trim()) {
    return (
      <Box
        borderRadius={variant === 'fullscreen' ? '0' : 'xl'}
        position={variant === 'fullscreen' ? 'absolute' : { lg: 'sticky' }}
        inset={variant === 'fullscreen' ? 0 : undefined}
        top={variant === 'fullscreen' ? 0 : { lg: 6 }}
        h={
          variant === 'fullscreen'
            ? 'full'
            : { base: '280px', lg: 'min(70vh, 560px)' }
        }
        bg="surfaceContainerLow"
        boxShadow={variant === 'fullscreen' ? 'none' : 'ghostBorder'}
        borderWidth={variant === 'fullscreen' ? 0 : '1px'}
        borderColor="border"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={6}
        zIndex={variant === 'fullscreen' ? 0 : undefined}
      >
        <Text color="muted" fontSize="sm" textAlign="center">
          Set{' '}
          <Text as="span" fontWeight={700} color="fg">
            NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          </Text>{' '}
          in your environment to load the map.
        </Text>
      </Box>
    )
  }

  const isFull = variant === 'fullscreen'

  return (
    <Box
      position={isFull ? 'absolute' : { lg: 'sticky' }}
      inset={isFull ? 0 : undefined}
      top={isFull ? 0 : { lg: 6 }}
      h={isFull ? 'full' : { base: '280px', lg: 'min(70vh, 560px)' }}
      overflow="hidden"
      borderRadius={isFull ? '0' : 'xl'}
      boxShadow={isFull ? 'none' : 'ghostBorder'}
      borderWidth={isFull ? 0 : '1px'}
      borderColor="border"
      zIndex={isFull ? 0 : undefined}
    >
      <Box
        ref={containerRef}
        w="full"
        h="full"
        aria-label="Map of tasks near the search area"
      />
    </Box>
  )
}
