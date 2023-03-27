<script setup lang="ts">
import type { MessageType } from '@/types'

const sessionStore = useSessionStore()
const { switchSession } = sessionStore
const { isThinking, currentSession } = storeToRefs(sessionStore)

const handleSelect = async (value: MessageType) => {
  await switchSession()

  currentSession.value!.type = value
}
</script>

<template>
  <a-tooltip content="新增对话">
    <a-dropdown @select="handleSelect">
      <a-button type="text" :disabled="isThinking">
        <template #icon>
          <icon-plus-circle></icon-plus-circle>
        </template>
      </a-button>
      <template #content>
        <a-doption value="text">文本模式</a-doption>
        <a-doption value="image">图像模式</a-doption>
      </template>
    </a-dropdown>
  </a-tooltip>
</template>
