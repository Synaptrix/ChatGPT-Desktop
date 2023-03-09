<script setup lang="ts">
import Theme from './components/Theme/index.vue'
import { useAppStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { themeMode, themeStyle } = storeToRefs(useAppStore())
</script>

<template>
  <Suspense>
    <div
      class="h-screen rounded-xl"
      style="background: inherit"
      data-tauri-drag-region
      :data-theme="themeMode"
      :class="themeStyle"
    >
      <button class="btn btn-active btn-ghost">Button</button>

      <Theme />
    </div>
  </Suspense>
</template>

<style scoped lang="scss"></style>
