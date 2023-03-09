<script setup lang="ts">
import Theme from './components/Theme/index.vue'
import { useMutationObserver } from './hooks'

const { themeMode } = useMutationObserver()

const background = computed(() =>
  themeMode.value === 'light' ? 'bg-white/50' : 'bg-black/50'
)
</script>

<template>
  <Suspense>
    <div
      class="main h-screen rounded-xl backdrop-blur"
      :class="background"
      data-tauri-drag-region
    >
      <button class="btn btn-active btn-ghost">Button</button>

      <Theme />
    </div>
  </Suspense>
</template>

<style scoped lang="scss"></style>
