<script setup lang="ts">
import { useThemeStore } from '@/stores'
import { THEME } from '@/constants'
import { IconMoon, IconSun } from '@arco-design/web-vue/es/icon'

const { themeMode } = storeToRefs(useThemeStore())
</script>

<template>
  <label class="swap swap-rotate fixed! top-4 right-4">
    <input
      type="checkbox"
      :checked="themeMode === THEME.light"
      @click="themeMode = themeMode === THEME.light ? THEME.dark : THEME.light"
    />

    <icon-moon class="swap-on h-7 w-7" />

    <icon-sun class="swap-off h-7 w-7" />
  </label>
</template>
