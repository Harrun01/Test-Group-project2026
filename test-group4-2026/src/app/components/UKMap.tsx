"use client";

// IMPORTS 
import { useState, useEffect } from "react";
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

const PALETTES: Record<string, {
  base: string; hover: string; selected: string; border: string
}> = {
  England: {
    base:     '#e03131',
    hover:    '#ff8787',   
    selected: '#7a0000',  
    border:   '#5a0000',
  },
  Scotland: {
     base:     '#e03131',
    hover:    '#ff8787',   
    selected: '#7a0000',   
    border:   '#5a0000',
  },
  Wales: {
    base:     '#e03131',
    hover:    '#ff8787',  
    selected: '#7a0000',  
    border:   '#5a0000',
  },
  'Northern Ireland': {
    base:     '#e03131',
    hover:    '#ff8787',   
    selected: '#7a0000',   
    border:   '#5a0000',
  },
  // Fallback used for LAD/district view
  _lad: {
    base:     '#1971c2',
    hover:    '#74c0fc',
    selected: '#0c3d6e',
    border:   '#072a4d',
  },
}

//COMPONENT FUNCTION
export default function UKMap() {
    
  //Variables for map center and bounds
  const ukCenter: [number, number] = [54.5, -2.0] // Center of the UK
  const ukBounds: [[number, number], [number, number]] = [[49.9, -8.0], [59.0, 2.0]] // Approximate bounds of the UK
     
  // Toggle between countries and districts
  //STATE
  const [showCountries, setShowCountries] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string[]>([])
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null) 
  const [openPanel, setOpenPanel] = useState<string | null>(null)

  // Debug log to see what regions are currently selected
  useEffect(() => {
    console.log('Currently selected regions:', selectedRegion)
  }, [selectedRegion])

  const handleFeatureClick = (regionName?: string) => {
    console.log('Clicked region:', regionName)
    if (!regionName) return

    const isAlreadySelected = selectedRegion.includes(regionName)

    if (isAlreadySelected) {
      const newSelected = selectedRegion.filter(r => r !== regionName)
      setSelectedRegion(newSelected)
      console.log('Deselected:', regionName)
    } else {
      const newSelected = [...selectedRegion, regionName || '']
      setSelectedRegion(newSelected)
      console.log("Selected", regionName)
    }
  }

  const handleFeatureHover = (regionName: string | null) => {
    setHoveredRegion(regionName || null)
  }

  // ─── STYLE FUNCTION 
  const getRegionStyle = (regionName: string, baseColor: string) => {
    const p          = PALETTES[regionName] ?? PALETTES['_lad']
    const isSelected = selectedRegion.includes(regionName)
    const isHovered  = hoveredRegion === regionName
    
    if (isSelected) {
      return {
        fillColor:   p.selected,
        fillOpacity: 0.72,        // solid — clearly active
        color:       p.border,
        weight:      3,
        opacity:     1,
      }
    }

    if (isHovered) {
      return {
        fillColor:   p.hover,
        fillOpacity: 0.55,        // lifted — noticeably brighter
        color:       '#ffffff',   // white border = crisp pop on hover
        weight:      2.5,
        opacity:     1,
      }
    }

    // Resting 
    return {
      fillColor:   p.base,
      fillOpacity: 0.22,          // subtle 
      color:       p.border,
      weight:      1.5,
      opacity:     0.7,
    }
  }
  return (
    <div className="relative">

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
        maxBoundsViscosity={0.5}
        minZoom={6}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <Marker position={[51.5074, -0.1278]}>
          <Popup>London</Popup>
        </Marker>

        {/* Conditionally show either countries or districts */}

        {showCountries ? (
          <>
            <GeoJSONLayer 
              url="/geojson/england.json"
              onFeatureClick={handleFeatureClick}
              onFeatureHover={handleFeatureHover}
              regionName="England"
              style={getRegionStyle("England", '#ff6b6b')}
            />
            <GeoJSONLayer 
              url="/geojson/scotland.json"
              onFeatureClick={handleFeatureClick}
              onFeatureHover={handleFeatureHover}
              regionName="Scotland"
              style={getRegionStyle("Scotland", '#748ffc')}
            />
            <GeoJSONLayer 
              url="/geojson/wales.json"
              onFeatureClick={handleFeatureClick}
              onFeatureHover={handleFeatureHover}
              regionName="Wales"
              style={getRegionStyle("Wales", '#51cf66')}
            />
            <GeoJSONLayer 
              url="/geojson/northern_ireland.json"
              onFeatureClick={handleFeatureClick}
              onFeatureHover={handleFeatureHover}
              regionName="Northern Ireland"
              style={getRegionStyle("Northern Ireland", '#ffd43b')}
            />
          </>
        ) : (
          <GeoJSONLayer 
            url="/geojson/lad.json"
            onFeatureClick={handleFeatureClick}
            onFeatureHover={handleFeatureHover}
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