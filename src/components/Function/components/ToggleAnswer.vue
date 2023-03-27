<script setup lang="ts">
const sessionStore = useSessionStore()
const { updateSessionData } = sessionStore
const { isThinking, sessionDataList, chatController, currentSession } =
  storeToRefs(sessionStore)

const handleClick = () => {
  if (isThinking.value) {
    chatController.value?.abort()

    updateSessionData(sessionDataList.value.at(-1)!)
  } else {
    currentSession.value?.type === 'text' ? getAiMessage() : getAiIamge()
  }
}
</script>

<template>
  <a-tooltip :content="isThinking ? '停止思考' : '重新回答'">
    <a-button
      type="text"
      :disabled="!sessionDataList.length"
      @click="handleClick"
    >
      <template #icon>
        <icon-stop v-if="isThinking" />
        <icon-refresh v-else />
      </template>
    </a-button>
  </a-tooltip>
</template>
