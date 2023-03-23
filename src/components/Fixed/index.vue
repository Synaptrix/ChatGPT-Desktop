<script setup lang="ts">
const { isFix } = storeToRefs(useSettingsStore())
</script>

<template>
  <div class="swap swap-rotate" @click="isFix = !isFix">
    <input type="checkbox" v-model="isFix" />

    <icon-pushpin class="swap-on text-[rgb(var(--primary-6))]" />

    <div class="swap-off">
      <icon-pushpin class="-rotate-45" />
    </div>
  </div>
</template>
