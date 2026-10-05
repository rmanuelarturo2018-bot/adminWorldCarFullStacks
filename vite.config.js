import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // Puerto del dev server, configurable desde .env (PORT)
      port: Number(env.PORT) || 5173,
      // Host de escucha (por defecto localhost)
      host: env.HOST || 'localhost',
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      // Puerto del preview de producción (npm run preview)
      port: Number(env.PREVIEW_PORT) || 4173,
    },
  }
})
