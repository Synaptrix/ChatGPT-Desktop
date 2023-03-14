<script setup lang="ts">
import { IconRefresh } from '@arco-design/web-vue/es/icon'
import { useRecordStore } from '@/stores'

const recordStore = useRecordStore()
const { updateRecord } = recordStore
const { currentRecord } = storeToRefs(recordStore)

const handleClick = () => {
  if (!currentRecord.value) return

  const newRecord = { ...currentRecord.value }
  newRecord.data?.pop()

  currentRecord.value = newRecord

  updateRecord(newRecord)
}
</script>

<template>
  <a-tooltip content="重新回答">
    <IconRefresh @click="handleClick" />
  </a-tooltip>
</template>
