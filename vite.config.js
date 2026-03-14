import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ prefixed ones) for server-side config only
  const env = loadEnv(mode, process.cwd(), '')

  // Target for the dev-server proxy – not exposed to the browser (no VITE_ prefix)
  const apiProxyTarget = env.API_PROXY_TARGET || 'https://api.acrohub.org'

  return {
    plugins: [vue()],
    server: {
      proxy: {
        // Proxy /api/* to the backend API, stripping the /api prefix.
        // This mirrors the CloudFront ordered_cache_behavior used in production
        // and avoids CORS issues during local development.
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
