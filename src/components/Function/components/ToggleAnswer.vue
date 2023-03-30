<script setup lang="ts">
const sessionStore = useSessionStore()
const { updateSessionData, changeLastSessionContent } = sessionStore
const { isThinking, sessionDataList, chatController, currentSession } =
  storeToRefs(sessionStore)

const handleClick = () => {
  if (isThinking.value) {
    chatController.value?.abort()

    changeLastSessionContent('停止思考')

    updateSessionData(getLastItem(sessionDataList.value))
  } else {
    currentSession.value?.type === 'text' ? getAiMessage() : getAiIamge()
  }
}
</script>

<template>
  <a-tooltip :content="isThinking ? '停止思考' : '重新回答'">
    <a-button
      type="text"
      :disabled="
        !sessionDataList.length ||
        (isThinking && currentSession?.type === 'image')
      "
      @click="handleClick"
    >
      <template #icon>
        <icon-stop v-if="isThinking" />
        <icon-refresh v-else />
      </template>
    </a-button>
  </a-tooltip>
</template>
