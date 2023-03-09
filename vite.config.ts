import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { presetUno, transformerDirectives } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(async () => ({
  plugins: [
    vue(),
    Unocss({
      presets: [presetUno(), presetDaisy()],
      transformers: [transformerDirectives()]
    }),
    AutoImport({
      dts: './src/types/auto-import.d.ts',
      eslintrc: {
        enabled: false
      },
      imports: ['vue']
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: '0.0.0.0'
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG
  }
}))
