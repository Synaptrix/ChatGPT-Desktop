<script setup lang="ts">
const settingStore = useSettingsStore()
const { toggleTheme } = settingStore
const { themeMode } = storeToRefs(settingStore)

const checked = computed(() => themeMode.value === THEME.light)
</script>

<template>
  <div class="swap swap-rotate" @click="toggleTheme">
    <input type="checkbox" v-model="checked" />

    <icon-moon class="swap-on" />

    <icon-sun class="swap-off" />
  </div>
</template>
