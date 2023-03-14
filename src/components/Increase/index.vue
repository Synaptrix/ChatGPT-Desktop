<script setup lang="ts">
import { IconPlusCircle } from '@arco-design/web-vue/es/icon'
import { useRecordStore } from '@/stores'

const { createNewRecord } = useRecordStore()
</script>

<template>
  <a-tooltip content="新建对话">
    <IconPlusCircle @click="createNewRecord" />
  </a-tooltip>
</template>
