'use client'

import { Box, Text } from '@chakra-ui/react'
import type { GeoJSONSource, Map as MapboxMap, Marker } from 'mapbox-gl'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'

export type TaskBrowseMapTask = {
  id: string
  title: string
  locationLat?: number | null
  locationLng?: number | null
}

export type TaskBrowseMapboxProps = {
  accessToken: string | undefined
  centerLat: number
  centerLng: number
  radiusMiles: number
  tasks: TaskBrowseMapTask[]
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

export function TaskBrowseMapbox({
  accessToken,
  centerLat,
  centerLng,
  radiusMiles,
  tasks,
}: TaskBrowseMapboxProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const markersRef = useRef<Marker[]>([])
  const [mapReady, setMapReady] = useState(false)

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
      for (const m of markersRef.current) m.remove()
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
    if (!mapReady || !map?.isStyleLoaded()) return

    for (const m of markersRef.current) m.remove()
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
        const el = document.createElement('button')
        el.type = 'button'
        el.setAttribute('aria-label', `Open task: ${task.title}`)
        el.title = task.title
        Object.assign(el.style, {
          display: 'block',
          width: '14px',
          height: '14px',
          padding: '0',
          borderRadius: '9999px',
          background: '#1A56DB',
          border: '2px solid #ffffff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          cursor: 'pointer',
        })
        el.addEventListener('click', () => {
          router.push(`/task/${task.id}`)
        })

        const marker = new mapboxgl.default.Marker({ element: el })
          .setLngLat([task.locationLng as number, task.locationLat as number])
          .addTo(current)
        markersRef.current.push(marker)
      }

      if (withCoords.length > 0) {
        const b = new mapboxgl.default.LngLatBounds()
        for (const t of withCoords) {
          b.extend([t.locationLng as number, t.locationLat as number])
        }
        b.extend([centerLng, centerLat])
        current.fitBounds(b, { padding: 48, maxZoom: 13, duration: 500 })
      }
    })
  }, [mapReady, tasks, centerLat, centerLng, router])

  if (!accessToken?.trim()) {
    return (
      <Box
        borderRadius="xl"
        position={{ lg: 'sticky' }}
        top={{ lg: 6 }}
        h={{ base: '280px', lg: 'min(70vh, 560px)' }}
        bg="surfaceContainerLow"
        boxShadow="ghostBorder"
        borderWidth="1px"
        borderColor="border"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={6}
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

  return (
    <Box
      borderRadius="xl"
      position={{ lg: 'sticky' }}
      top={{ lg: 6 }}
      h={{ base: '280px', lg: 'min(70vh, 560px)' }}
      overflow="hidden"
      boxShadow="ghostBorder"
      borderWidth="1px"
      borderColor="border"
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
