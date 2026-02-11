"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// @ts-ignore - Leaflet internal property fix
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

export default function UKMap() {
    
    const ukCenter :[ number, number] = [54.5, -2.0]// Center of the UK
    const ukBounds : [[number, number], [number, number]] = [[49.9, -8.0], [59.0, 2.0]] // Approximate bounds of the UK

    return (
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
                </MapContainer>
    )
}
