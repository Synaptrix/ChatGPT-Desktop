<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'

const recordStore = useSessionStore()
const { isThinking, currentSession } = storeToRefs(recordStore)

const roleStore = useRoleStore()
const { currentRole, isEdit, textAreaValue, imageValue, popoverVisible } =
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

      popoverVisible.value = false

      if (currentSession.value?.type === 'text') getAiMessage(value)
      else getAiIamge(value)

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
    <div class="flex w-full flex-col">
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
      <div class="flex w-full" v-if="currentSession?.type === 'image'">
        <a-select placeholder="选择生成的尺寸" v-model="imageValue.size">
          <a-option>256x256</a-option>
          <a-option>512x512</a-option>
          <a-option>1024x1024</a-option>
        </a-select>
        <a-select placeholder="选择生成的数量" v-model="imageValue.number">
          <a-option v-for="i in 10" :key="i">{{ i + '' }}</a-option>
        </a-select>
      </div>
    </div>
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
