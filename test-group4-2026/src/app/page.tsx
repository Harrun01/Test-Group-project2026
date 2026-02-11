'use client'

import dynamic from 'next/dynamic'


const UKMap = dynamic(() => import("./components/UKMap"), {
  ssr: false, // This is the key - disable server-side rendering
  loading: () => <p>Loading map...</p> // Optional: shows while loading
})

export default function MapPage() {
  return (
    <div>
      <h1>UK Map</h1>
      <UKMap />
    </div>
  )
}