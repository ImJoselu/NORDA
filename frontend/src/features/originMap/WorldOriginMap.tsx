import { useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import type { ContinentGroup } from '@/types/origin'
import { pluralize } from '@/utils/coffeeLabels'
import { FlyTo } from './FlyTo'
import { createDotIcon } from './markerIcon'

interface WorldOriginMapProps {
  origins: ContinentGroup[]
  className?: string
}

const DOT_ICON = createDotIcon(16)

export function WorldOriginMap({ origins, className = '' }: WorldOriginMapProps) {
  const navigate = useNavigate()
  const [focus, setFocus] = useState<{ center: [number, number]; zoom: number } | null>(null)
  const countries = useMemo(() => origins.flatMap((group) => group.countries), [origins])

  return (
    <div className={`overflow-hidden rounded-card ${className}`}>
      <MapContainer center={[15, 10]} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {focus && <FlyTo center={focus.center} zoom={focus.zoom} />}
        {countries.map((country) => (
          <Marker
            key={country.slug}
            position={[country.latitude, country.longitude]}
            icon={DOT_ICON}
            title={country.name}
            eventHandlers={{
              click: () => setFocus({ center: [country.latitude, country.longitude], zoom: 5 }),
            }}
          >
            <Popup>
              <div className="flex flex-col gap-2">
                <p className="font-medium text-ink">{country.name}</p>
                <p className="text-sm text-ink-soft">{pluralize(country.productCount, 'café', 'cafés')}</p>
                <Button size="sm" onClick={() => navigate(`/origins/${country.slug}`)}>
                  Explorar
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
