import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface FlyToProps {
  center: [number, number]
  zoom: number
}

export function FlyTo({ center, zoom }: FlyToProps) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.1 })
  }, [map, center, zoom])

  return null
}
