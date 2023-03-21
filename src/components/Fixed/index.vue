<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import { IconPushpin } from '@arco-design/web-vue/es/icon'

const { isFix } = storeToRefs(useSettingsStore())
</script>

<template>
  <div class="swap swap-rotate" @click="isFix = !isFix">
    <input type="checkbox" v-model="isFix" />

    <IconPushpin class="swap-on text-[rgb(var(--primary-6))]" />

    <div class="swap-off">
      <IconPushpin class="-rotate-45" />
    </div>
  </div>
</template>
