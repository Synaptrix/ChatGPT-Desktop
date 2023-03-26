import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import { visualizer } from 'rollup-plugin-visualizer'
import { presetIcons, presetUno, transformerDirectives } from 'unocss'
import presetAutoprefixer from 'unocss-preset-autoprefixer'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

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
    visualizer()
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
    target: 'esnext',
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
