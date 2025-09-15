import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import commonjs from 'vite-plugin-commonjs'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react(),
    commonjs(), // 👈 add this
    tailwindcss(),
  ],
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  server : {
    port: 3000,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    //   plugins: [
    //     NodeGlobalsPolyfillPlugin({
    //       process: true,
    //       buffer: true,
    //     }),
    //     NodeModulesPolyfillPlugin(),
    //   ],
    },
  },
})