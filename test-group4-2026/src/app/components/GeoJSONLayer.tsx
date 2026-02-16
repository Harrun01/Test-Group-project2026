'use client'

import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
import { PathOptions } from 'leaflet'

interface GeoJSONLayerProps {
  url: string
  onFeatureClick?: (feature: any, regionName?: string) => void
  onFeatureHover?: (regionName: string | null) => void
  style?: PathOptions  
   regionName?: string  
}

export default function GeoJSONLayer({ url, onFeatureClick, style, regionName , onFeatureHover}: GeoJSONLayerProps) {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(jsonData => {
        console.log('GeoJSON loaded successfully:', url)
        setData(jsonData)
      })
  }, [url])
  
  
  if (!data) {
    console.log('No data yet for:', url)
    return null
  }
  // Default style if none provided
  const defaultStyle = {
    fillColor: '#e0e0e0',
    weight: 2,
    opacity: 1,
    color: '#666',
    fillOpacity: 0.3
  }
   return (
    <GeoJSON 
      data={data}
      style={style || defaultStyle}
      eventHandlers={{
        click: (e) => {
          onFeatureClick?.(e.propagatedFrom.feature, regionName)
        },
        mouseover: () => { 
          onFeatureHover?.(regionName || null)
        },
        mouseout: () => { 
          onFeatureHover?.(null)
        }
      }}
    />
  )
}