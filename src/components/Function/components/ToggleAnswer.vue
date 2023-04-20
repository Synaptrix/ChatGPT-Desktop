<script setup lang="ts">
const { t } = useI18n()
const sessionStore = useSessionStore()
const { updateSessionData, changeLastSessionContent } = sessionStore
const { isThinking, sessionDataList, chatController, currentSession } =
  storeToRefs(sessionStore)

const handleClick = () => {
  if (isThinking.value) {
    chatController.value?.abort()

    changeLastSessionContent(t('session.stopGenerate'))

    updateSessionData(getLastItem(sessionDataList.value))
  } else {
    currentSession.value?.type === 'text' ? getAiMessage() : getAiImage()
  }
}
</script>

<template>
  <a-tooltip
    :content="
      isThinking ? $t('session.stopGenerate') : $t('session.regenerate')
    "
  >
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
