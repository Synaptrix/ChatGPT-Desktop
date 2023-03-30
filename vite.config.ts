import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import Unocss from 'unocss/vite'
import { presetUno, presetIcons, transformerDirectives } from 'unocss'
import presetAutoprefixer from 'unocss-preset-autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig(async () => ({
  plugins: [
    vue(),
    Unocss({
      presets: [presetUno(), presetIcons(), presetAutoprefixer()],
      transformers: [
        transformerDirectives({
          applyVariable: ['--uno']
        })
      ]
    }),
    AutoImport({
      dts: './src/types/auto-import.d.ts',
      eslintrc: {
        enabled: true
      },
      imports: [
        'vue',
        'pinia',
        {
          '@arco-design/web-vue': ['Message']
        }
      ],
      resolvers: [ArcoResolver()],
      vueTemplate: true,
      dirs: [
        './src/api/*',
        './src/constants/*',
        './src/hooks/*',
        './src/sqls/*',
        './src/stores/*',
        './src/utils/*'
      ]
    }),
    Components({
      dts: './src/types/components.d.ts',
      resolvers: [
        ArcoResolver({
          resolveIcons: true
        })
      ]
    }),
    visualizer(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`
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
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie >= 8',
            'last 10 versions'
          ]
        })
      ]
    }
  }
}))
