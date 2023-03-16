<script setup lang="ts">
import {
  IconPlusCircle,
  IconRefresh,
  IconDelete,
  IconHistory,
  IconSettings
} from '@arco-design/web-vue/es/icon'
import { useSessionStore } from '@/stores'
import { getArrayLength } from '@/utils'

const { currentSession, isThinking, sessionDataList } = storeToRefs(
  useSessionStore()
)

const modalVisible = ref(false)
const setModalVisible = () => {
  modalVisible.value = !modalVisible.value
}

// TODO: 在获取数据时删除的处理，在获取数据时切换历史记录的处理
const functions = computed(() => [
  {
    content: '新建对话',
    icon: IconPlusCircle,
    disabled: !!currentSession
    // handleClick: createNewRecord
  },
  {
    content: '重新回答',
    icon: IconRefresh,
    disabled: isThinking.value || !(sessionDataList.value.length > 2)
    // handleClick: () => getAiMessage()
  },
  {
    content: '清空对话',
    icon: IconDelete,
    disabled: !!currentSession
    // handleClick: () => deleteRecord()
  },
  {
    content: '历史记录',
    icon: IconHistory,
    handleClick: () => {
      // empty
    }
  },
  {
    content: '设置',
    icon: IconSettings,
    handleClick: setModalVisible
  }
])
</script>

<template>
  <div class="function flex gap-2">
    <a-tooltip
      v-for="(item, index) in functions"
      :content="item.content"
      :key="index"
      :position="index === getArrayLength(functions) - 1 ? 'tr' : 'top'"
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

  <SettingsModal :visible="modalVisible" :set-visible="setModalVisible" />
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
