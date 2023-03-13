<script setup lang="ts">
import { useThemeStore } from '@/stores'
import { THEME } from '@/constants'
import { IconMoon, IconSun } from '@arco-design/web-vue/es/icon'

const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const { themeMode } = storeToRefs(themeStore)

const checked = computed(() => themeMode.value === THEME.light)
</script>

<template>
  <div class="swap swap-rotate" @click="toggleTheme">
    <input type="checkbox" v-model="checked" />

    <IconMoon class="swap-on" />

    <IconSun class="swap-off" />
  </div>
</template>
