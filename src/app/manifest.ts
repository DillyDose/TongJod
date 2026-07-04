import type { MetadataRoute } from 'next'

// Served at /manifest.webmanifest — makes the app installable.
// Deliberately no service worker: the app needs Supabase anyway, and
// installability alone gets the home-screen icon + standalone window.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TongJod — ต้องจด',
    short_name: 'TongJod',
    description: 'จดทุกบาท ใช้ชีวิตสบายใจ',
    // Open straight on the entry form — the whole point of installing
    start_url: '/form',
    display: 'standalone',
    background_color: '#FFF8F5', // --bg-base
    theme_color: '#58CC02', // --accent
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
