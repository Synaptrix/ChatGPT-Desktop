<script setup lang="ts">
import {
  IconPlusCircle,
  IconRefresh,
  IconDelete,
  IconHistory
} from '@arco-design/web-vue/es/icon'
import { useRecordStore } from '@/stores'
import { getArrayLength } from '@/utils'

const recordStore = useRecordStore()
const { createNewRecord, getAiMessage, deleteRecord } = recordStore
const { currentRecord, isThinking } = storeToRefs(recordStore)

const functions = computed(() => [
  {
    content: '新建对话',
    icon: IconPlusCircle,
    disabled: !!currentRecord,
    handleClick: createNewRecord
  },
  {
    content: '重新回答',
    icon: IconRefresh,
    disabled:
      isThinking.value || !(getArrayLength(currentRecord.value?.data) > 2),
    handleClick: () => getAiMessage()
  },
  {
    content: '清空对话',
    icon: IconDelete,
    disabled: !!currentRecord,
    handleClick: () => deleteRecord()
  },
  {
    content: '历史记录',
    icon: IconHistory,
    disabled: false,
    handleClick: () => {
      // empty
    }
  }
])
</script>

<template>
  <div class="function flex gap-2">
    <a-tooltip
      v-for="(item, index) in functions"
      :content="item.content"
      :key="index"
    >
      <a-button type="text" :disabled="item.disabled" @click="item.handleClick">
        <template #icon>
          <component
            :is="item.icon"
            class="text-5.5 text-[var(--color-text-2)]"
          />
        </template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<style scoped lang="scss">
.function {
  .arco-btn.arco-btn-disabled {
    .arco-icon {
      color: var(--color-text-4);
    }
  }
}
</style>
