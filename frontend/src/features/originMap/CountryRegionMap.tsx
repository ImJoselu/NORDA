import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import type { CountryDetail } from '@/types/origin'
import { pluralize } from '@/utils/coffeeLabels'
import { createDotIcon } from './markerIcon'

interface CountryRegionMapProps {
  country: CountryDetail
  className?: string
}

const DOT_ICON = createDotIcon(14)

export function CountryRegionMap({ country, className = '' }: CountryRegionMapProps) {
  const navigate = useNavigate()

  return (
    <div className={`overflow-hidden rounded-card ${className}`}>
      <MapContainer
        center={[country.latitude, country.longitude]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {country.regions.map((region) => (
          <Marker key={region.slug} position={[region.latitude, region.longitude]} icon={DOT_ICON} title={region.name}>
            <Popup>
              <div className="flex flex-col gap-2">
                <p className="font-medium text-ink">{region.name}</p>
                <p className="text-sm text-ink-soft">{pluralize(region.productCount, 'café', 'cafés')}</p>
                <Button size="sm" onClick={() => navigate(`/origins/${country.slug}/${region.slug}`)}>
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
