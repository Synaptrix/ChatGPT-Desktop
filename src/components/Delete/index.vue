<script setup lang="ts">
import { IconDelete } from '@arco-design/web-vue/es/icon'
import { useRecordStore } from '@/stores'

const recordStore = useRecordStore()
const { deleteRecord } = recordStore
const { currentRecord } = storeToRefs(recordStore)
</script>

<template>
  <a-tooltip content="清空对话">
    <IconDelete @click="deleteRecord(currentRecord?.id)" />
  </a-tooltip>
</template>
