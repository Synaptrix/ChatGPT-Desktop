<script setup lang="ts">
import Theme from './components/Theme/index.vue'
import { useThemeStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { themeClass } = storeToRefs(useThemeStore())
</script>

<template>
  <Suspense>
    <div
      class="app relative h-screen overflow-hidden rounded-2xl"
      :class="themeClass"
      data-tauri-drag-region
    >
      <Theme />
    </div>
  </Suspense>
</template>

<style scoped lang="scss">
.app {
  &::before,
  &::after {
    @apply -z-1 absolute top-0 left-0 right-0 bottom-0 bg-inherit blur-3xl content-none;
  }
}
</style>
