<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'

const { t } = useI18n()

const recordStore = useSessionStore()
const { isThinking, currentSession } = storeToRefs(recordStore)

const roleStore = useRoleStore()
const { currentRole, isEdit, textAreaValue, popoverVisible } =
  storeToRefs(roleStore)

const textAreaElement = ref<HTMLTextAreaElement | null>(null)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (isEdit.value) {
      Message.info(t('message.role.pleaseFinishRoleEdit'))

      return
    }

    if (!event.shiftKey && event.which !== 229 && !event.isComposing) {
      event.preventDefault()

      const value = textAreaValue.value.trim()

      if (!value) return

      popoverVisible.value = false

      if (currentSession.value?.type === 'text') getAiMessage(value)
      else getAiImage(value)

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
        :placeholder="
          isThinking
            ? $t('tips.input.isThinking')
            : $t('tips.input.placeholder')
        "
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
