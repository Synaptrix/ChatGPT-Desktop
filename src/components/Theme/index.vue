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

    <icon-moon class="swap-on text-7" />

    <icon-sun class="swap-off text-7" />
  </div>
</template>
