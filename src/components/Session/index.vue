<script setup lang="ts">
import { useSessionStore } from '@/stores'

const { currentSession } = storeToRefs(useSessionStore())
</script>

<template>
  {{ currentSession }}
</template>

<style scoped lang="scss"></style>
