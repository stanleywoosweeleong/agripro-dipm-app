import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Repo path: https://<user>.github.io/agripro-dipm-app/
// If renamed later, set base via env: BASE=/new-name/ npm run build
const base = process.env.BASE || '/agripro-dipm-app/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'AgriPro DIPM — 榴莲虫害管理 / Durian Pest Management',
        short_name: 'AgriPro DIPM',
        description:
          '榴莲综合防治 — 按取食方式诊断、轮替用药、查农药是否违禁。Durian IPM: diagnose by how pests feed, rotate by MoA, check chemicals.',
        theme_color: '#059669',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ]
});
