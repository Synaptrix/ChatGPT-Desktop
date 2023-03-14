<script setup lang="ts">
import { IconRefresh } from '@arco-design/web-vue/es/icon'
import { useRecordStore } from '@/stores'

const recordStore = useRecordStore()
const { getAiMessage } = recordStore
const { currentRecord } = storeToRefs(recordStore)

const handleClick = () => {
  if (!currentRecord.value) return

  const newRecord = { ...currentRecord.value }
  newRecord.data?.pop()

  console.log('newRecord', newRecord)

  currentRecord.value = newRecord

  getAiMessage()
}
</script>

<template>
  <a-tooltip content="重新回答">
    <IconRefresh @click="handleClick" />
  </a-tooltip>
</template>
