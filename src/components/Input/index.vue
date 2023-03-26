<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'

const recordStore = useSessionStore()
const { isThinking } = storeToRefs(recordStore)

const roleStore = useRoleStore()
const { currentRole, isEdit, textAreaValue, popoverVisible } =
  storeToRefs(roleStore)

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

      // if (popoverVisible) {
      popoverVisible.value = false
      // }

      if (
        window.isImagesMode ||
        recordStore.sessionDataList.at(-1)?.message_type === 'image'
      ) {
        getAiImagesMessage(value)
      } else {
        getAiMessage(value)
      }

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
      :class="!textAreaValue && 'rounded-10'"
      :placeholder="isThinking ? 'AI 正在思考...' : '有什么问题尽管问我'"
      v-model="textAreaValue"
      :disabled="isThinking || isEdit"
      :auto-size="{
        minRows: 1,
        maxRows: 5
      }"
      clearable
      @keydown="onKeydown"
    ></a-textarea>
  </div>
</template>

<style scoped lang="scss">
.app-input {
  .arco-textarea-wrapper {
    transition: all 0.3s;

    &:hover {
      --uno: border-[var(--color-neutral-4)];
    }
    &.arco-textarea-focus {
      --uno: rounded-0 border-[rgb(var(--primary-6))];
    }
  }
}
</style>
