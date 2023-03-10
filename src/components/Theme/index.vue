<script setup lang="ts">
import { useThemeStore } from '@/stores'
import { THEME } from '@/constants'

const { themeMode } = storeToRefs(useThemeStore())
</script>

<template>
  <label class="swap swap-rotate fixed! top-4 right-4">
    <input
      type="checkbox"
      :checked="themeMode === THEME.light"
      @click="themeMode = themeMode === THEME.light ? THEME.dark : THEME.light"
    />

    <i class="swap-on i-carbon-moon text-7"></i>

    <i class="swap-off i-carbon-sun text-7"></i>
  </label>
</template>
