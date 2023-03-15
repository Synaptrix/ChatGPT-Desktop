<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import { THEME } from '@/constants'
import { IconMoon, IconSun } from '@arco-design/web-vue/es/icon'

const settingStore = useSettingsStore()
const { toggleTheme } = settingStore
const { themeMode } = storeToRefs(settingStore)

const checked = computed(() => themeMode.value === THEME.light)
</script>

<template>
  <div class="swap swap-rotate" @click="toggleTheme">
    <input type="checkbox" v-model="checked" />

    <IconMoon class="swap-on" />

    <IconSun class="swap-off" />
  </div>
</template>
