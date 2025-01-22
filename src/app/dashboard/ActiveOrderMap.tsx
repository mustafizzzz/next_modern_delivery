"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"
import { Loader2 } from "lucide-react"

type Order = {
  _id: string
  orderNumber: string
  area: string
  status: string
  customer: {
    name: string
    address: string
  }
}

type ActiveOrderMapProps = {
  orders: Order[]
}

interface AreaCoordinates {
  [area: string]: [number, number]
}

// Function to fetch coordinates for an area
async function getCoordinates(area: string): Promise<[number, number] | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${area},Mumbai,India&format=json&limit=1`,
    )
    const data = await response.json()

    if (data && data[0]) {
      return [Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)]
    }
    return null
  } catch (error) {
    console.error(`Error fetching coordinates for ${area}:`, error)
    return null
  }
}

// Function to collect unique areas from orders
function getUniqueAreas(orders: Order[]): string[] {
  return [...new Set(orders.map((order) => order.area.toLowerCase()))]
}

// Custom icon for markers
const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export function ActiveOrderMap({ orders }: ActiveOrderMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.076, 72.8777])
  const [areaCoordinates, setAreaCoordinates] = useState<AreaCoordinates>({})

  useEffect(() => {
    async function fetchAreaCoordinates() {
      setIsLoading(true)
      const coordinates: AreaCoordinates = {}
      const uniqueAreas = getUniqueAreas(orders)

      for (const area of uniqueAreas) {
        const coords = await getCoordinates(area)
        if (coords) {
          coordinates[area] = coords
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      setAreaCoordinates(coordinates)

      // Set map center to first area's coordinates if available
      if (Object.values(coordinates).length > 0) {
        setMapCenter(Object.values(coordinates)[0])
      }

      setIsLoading(false)
    }

    fetchAreaCoordinates()
  }, [orders])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 p-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading map coordinates...</p>
        </div>
      </div>
    )
  }

  return (
    <MapContainer center={mapCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {orders.map((order) => {
        const position = areaCoordinates[order.area.toLowerCase()]
        if (position) {
          // Add a small random offset to each marker to prevent overlap
          const lat = position[0] + (Math.random() - 0.5) * 0.005
          const lon = position[1] + (Math.random() - 0.5) * 0.005
          return (
            <Marker key={order._id} position={[lat, lon]} icon={customIcon}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold mb-2">Order: {order.orderNumber}</h3>
                  <p className="text-sm">
                    Status: <span className="capitalize">{order.status}</span>
                  </p>
                  <p className="text-sm">Customer: {order.customer.name}</p>
                  <p className="text-sm">Area: {order.area}</p>
                  <p className="text-sm">Address: {order.customer.address}</p>
                </div>
              </Popup>
            </Marker>
          )
        }
        return null
      })}
    </MapContainer>
  )
}

