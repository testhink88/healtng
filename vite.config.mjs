import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    preserveSymlinks: false,
  },
  define: {
    'process.env': {},
  },
  server: {
    port: 3000,
    strictPort: false,
    open: false,
    host: true,                        // permite acceso externo
    allowedHosts: [
      '.trycloudflare.com',            // permite cualquier URL de Cloudflared
      // '.loca.lt',                   // (opcional) si quieres usar LocalTunnel también
    ],
    // Si el HMR no conecta tras el túnel, descomenta y pon tu host actual:
    // hmr: {
    //   protocol: 'wss',
    //   host: 'isle-negotiation-horn-lucy.trycloudflare.com',
    //   clientPort: 443,
    // },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
