import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/api/nci': {
        target: 'https://1c.bnpz.uz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nci/, '/base1c/hs/ERP/GetNCI/'),
        headers: {
          Authorization: `Basic ${Buffer.from('integrationNCI:OYGIcJx33O9gl2PBwwBeyV').toString('base64')}`,
        },
      },
    },
  },
})
