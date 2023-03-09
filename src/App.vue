<script setup lang="ts">
import Theme from './components/Theme/index.vue'
import { useAppStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { themeMode, themeStyle } = storeToRefs(useAppStore())
</script>

<template>
  <Suspense>
    <div
      class="main h-screen rounded-xl backdrop-blur"
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
