// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
  alias: {
    "@": resolve(__dirname, "src"),
    "@/utils": resolve(__dirname, "src/components/utils"),
    "@/features": resolve(__dirname, "src/features"),
    "@/shared": resolve(__dirname, "src/shared"),
    "@/services": resolve(__dirname, "src/services"),
    "@/assets": resolve(__dirname, "src/assets"),
    "@/lib": resolve(__dirname, "src/lib"),
    "@/types": resolve(__dirname, "src/types"),
    "@/contexts": resolve(__dirname, "src/contexts"),
    "@/styles": resolve(__dirname, "src/styles"),
  },
},
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost/healtng_dash_carcasa",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("❌ Proxy error:", err);
          });
        },
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
