<script lang="ts" setup>
import { useSessionStore, useRoleStore } from '@/stores'

const recordStore = useSessionStore()
const { getAiMessage } = recordStore
const { isThinking } = storeToRefs(recordStore)

const roleStore = useRoleStore()
const { getFilterRoleList } = roleStore
const { currentRole } = storeToRefs(roleStore)

const textAreaElement = ref<HTMLTextAreaElement | null>(null)

const textAreaValue = ref('')

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
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

watch(textAreaValue, (value) => {
  getFilterRoleList(value)
})

watch(currentRole, () => {
  textAreaValue.value = ''
  textAreaElement.value?.focus()
})

onMounted(() => {
  // appWindow.onFocusChanged(() => {
  //   textAreaElement.value?.focus()
  // })
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
      :disabled="isThinking"
      @keydown="onKeydown"
      auto-size
      clearable
    ></a-textarea>
  </div>
</template>

<style lang="scss" scoped>
.app-input {
  .arco-textarea-wrapper {
    // height: 32px;

    transition: all 0.3s;

    border-radius: 32px;

    &:hover {
      border-color: var(--color-neutral-4);
    }
    &.arco-textarea-focus {
      max-height: 96px;
      overflow-y: scroll;

      border-color: rgb(var(--arcoblue-6));
      border-radius: 0;
    }
  }
}
</style>
