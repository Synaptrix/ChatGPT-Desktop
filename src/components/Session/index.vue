<script setup lang="ts">
import { useSettingsStore, useSessionStore, useRoleStore } from '@/stores'

const { uuid } = storeToRefs(useSettingsStore())
const { currentRecord } = storeToRefs(useSessionStore())
const { currentRole } = storeToRefs(useRoleStore())
</script>

<template>
  <div
    class="flex p-2"
    v-for="(item, index) of currentRecord?.data?.slice(1)"
    :key="index"
  >
    <Avatar class="w-14!" :value="!(index % 2) ? uuid : currentRole?.name" />
    <div>
      {{ item.content }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
