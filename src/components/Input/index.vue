<script lang="ts" setup>
import { appWindow } from '@tauri-apps/api/window'
import { Message } from '@arco-design/web-vue'
import { useSessionStore, useRoleStore } from '@/stores'
import { getAiMessage } from '@/api'

const recordStore = useSessionStore()
const { isThinking } = storeToRefs(recordStore)

const roleStore = useRoleStore()
const { currentRole, isEdit, textAreaValue } = storeToRefs(roleStore)

const textAreaElement = ref<HTMLTextAreaElement | null>(null)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (isEdit.value) {
      Message.info('请先完成角色的编辑')

      return
    }

    if (!event.shiftKey && event.which !== 229 && !event.isComposing) {
      event.preventDefault()

      const value = textAreaValue.value.trim()

      if (!value) return

      getAiMessage(value)

      textAreaElement.value?.blur()
      textAreaValue.value = ''
    }
  }
}

watch(currentRole, () => {
  textAreaValue.value = ''
  textAreaElement.value?.focus()
})

watch(isThinking, (newValue) => {
  if (newValue) return

  setTimeout(() => {
    textAreaElement.value?.focus()
  }, 10)
})

onMounted(() => {
  appWindow.onFocusChanged(() => {
    textAreaElement.value?.focus()
  })
})
</script>

<template>
  <div class="app-input flex items-center gap-2">
    <RoleList />

    <a-textarea
      ref="textAreaElement"
      class="bordered bg-transparent!"
      :placeholder="isThinking ? 'AI 正在思考...' : '有什么问题尽管问我'"
      v-model="textAreaValue"
      :disabled="isThinking || isEdit"
      auto-size
      clearable
      @keydown="onKeydown"
    ></a-textarea>
  </div>
</template>

<style lang="scss" scoped>
.app-input {
  .arco-textarea-wrapper {
    transition: all 0.3s;

    border-radius: 32px;

    &:hover {
      border-color: var(--color-neutral-4);
    }
    &.arco-textarea-focus {
      max-height: 96px;

      border-color: rgb(var(--arcoblue-6));
      border-radius: 0;
    }
  }
}
</style>
