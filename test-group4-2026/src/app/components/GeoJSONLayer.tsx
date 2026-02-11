'use client'

import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
import { PathOptions } from 'leaflet'

interface GeoJSONLayerProps {
  url: string
  onFeatureClick?: (feature: any) => void
  style?: PathOptions  // Add this
}

export default function GeoJSONLayer({ url, onFeatureClick, style }: GeoJSONLayerProps) {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    console.log('Loading GeoJSON from:', url)
    fetch(url)
      .then(res => res.json())
      .then(jsonData => {
        console.log('GeoJSON loaded successfully:', url)
        setData(jsonData)
      })
      .catch(err => console.error('Error loading GeoJSON:', err))
  }, [url])
  
  if (!data) {
    console.log('No data yet for:', url)
    return null
  }
  
  console.log('Rendering GeoJSON for:', url)
  
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
      style={style || defaultStyle}  // Use custom style or default
      eventHandlers={{
        click: (e) => {
          onFeatureClick?.(e.propagatedFrom.feature)
        }
      }}
    />
  )
}