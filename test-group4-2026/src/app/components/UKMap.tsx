"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import GeoJSONLayer from "./GeoJSONLayer";

// @ts-ignore - Leaflet internal property fix
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

export default function UKMap() {
    
  const ukCenter: [number, number] = [54.5, -2.0] // Center of the UK
  const ukBounds: [[number, number], [number, number]] = [[49.9, -8.0], [59.0, 2.0]] // Approximate bounds of the UK
     
  // Toggle between countries and districts
  const [showCountries, setShowCountries] = useState(true)

  // Handle when a region is clicked
  const handleFeatureClick = (feature: any) => {
    console.log('Clicked region:', feature.properties.name)
    // We'll add selection logic here next
  }

  // Debug log to see what showCountries is on each render
  console.log('Rendering UKMap, showCountries:', showCountries)

  return (
    <div>
      {/* Toggle Button */}
      <button 
        onClick={() => {
          console.log('Button clicked! Current state:', showCountries)
          setShowCountries(!showCountries)
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '10px',
          background: 'white',
          border: '2px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {showCountries ? 'Show Districts' : 'Show Countries'}
      </button>

      <MapContainer 
        center={ukCenter}
        zoom={6}
        style={{ height: '800px', width: '100%' }}
        maxBounds={ukBounds}
        maxBoundsViscosity={0.5}
        minZoom={6}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={[51.5074, -0.1278]}>
          <Popup>London</Popup>
        </Marker>

   {/* Conditionally show either countries or districts */}
{showCountries ? (
  <>
    {/* Load all 4 countries separately */}
    <GeoJSONLayer 
      url="/geojson/england.json"
      onFeatureClick={handleFeatureClick}
      style={{
        fillColor: '#ff6b6b',
        weight: 3,
        opacity: 1,
        color: '#000000',
        fillOpacity: 0.3
      }}
    />
    <GeoJSONLayer 
      url="/geojson/scotland.json"
      onFeatureClick={handleFeatureClick}
      style={{
        fillColor: '#748ffc',
        weight: 3,
        opacity: 1,
        color: '#000000',
        fillOpacity: 0.3
      }}
    />
    <GeoJSONLayer 
      url="/geojson/wales.json"
      onFeatureClick={handleFeatureClick}
      style={{
        fillColor: '#51cf66',
        weight: 3,
        opacity: 1,
        color: '#000000',
        fillOpacity: 0.3
      }}
    />
    <GeoJSONLayer 
      url="/geojson/northern_ireland.json"
      onFeatureClick={handleFeatureClick}
      style={{
        fillColor: '#ffd43b',
        weight: 3,
        opacity: 1,
        color: '#000000',
        fillOpacity: 0.3
      }}
    />
  </>
) : (
  <GeoJSONLayer 
    url="/geojson/lad.json"
    onFeatureClick={handleFeatureClick}
    style={{
      fillColor: '#4dabf7',
      weight: 2,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.3
    }}
  />
)}
      </MapContainer>
    </div>
  )
}
