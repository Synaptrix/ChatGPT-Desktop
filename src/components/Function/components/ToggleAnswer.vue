<script setup lang="ts">
const sessionStore = useSessionStore()
const { updateSessionData, changeLastSessionContent } = sessionStore
const { isThinking, sessionDataList, chatController } =
  storeToRefs(sessionStore)

const handleClick = () => {
  if (isThinking.value) {
    chatController.value?.abort()

    changeLastSessionContent('终止了回答')

    updateSessionData(sessionDataList.value.at(-1)!)
  } else {
    getAiMessage()
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
