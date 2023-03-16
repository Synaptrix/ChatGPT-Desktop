<script lang="ts" setup>
import { useSessionStore } from '@/stores'

const sessionStore = useSessionStore()
const { sessionList } = storeToRefs(sessionStore)
const { switchSession } = sessionStore
</script>

<template>
  <div v-for="item in sessionList" :key="item.id" class="bg-green">
    <div>
      {{ item.id }}
    </div>
    <a-button @click="switchSession(item)">切换</a-button>
  </div>
</template>

<style lang="scss" scoped></style>
