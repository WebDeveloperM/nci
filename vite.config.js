import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 3-arg loadEnv (bo'sh prefix) — VITE_ bilan cheklanmagan barcha o'zgaruvchilarni o'qiydi.
  // Bu qiymatlar faqat Node (dev-server) jarayonida ishlatiladi va clientga hech qachon yuborilmaydi.
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
            Authorization: `Basic ${Buffer.from(`${env.NCI_AUTH_USER}:${env.NCI_AUTH_PASS}`).toString('base64')}`,
          },
        },
      },
    },
  }
})
