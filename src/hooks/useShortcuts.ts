/** 定义快捷键 */
export const useShortcuts = () => {
  const sessionStore = useSessionStore()
  const { switchSession, deleteSession, updateSessionData } = sessionStore
  const { sessionDataList, isThinking, chatController } =
    storeToRefs(sessionStore)

  let lastTime = 0

  const onKeydown = (event: KeyboardEvent) => {
    const { ctrlKey, key } = event
    const disabled = isThinking.value || !sessionDataList.value.length

    /** ctrl + l 清空会话 */
    if (ctrlKey && key === 'l' && !disabled) {
      deleteSession()
    }

    /** ctrl + n 新建会话 */
    if (ctrlKey && key === 'n' && !disabled) {
      switchSession()
    }

    /** ctrl + r 重新问 */
    if (
      ctrlKey &&
      key === 'r' &&
      sessionDataList.value.length &&
      !isThinking.value
    ) {
      getAiMessage()
    }

    /** ctrl + c + c 停止Ai回复 */
    if (
      ctrlKey &&
      key === 'c' &&
      sessionDataList.value.length &&
      isThinking.value
    ) {
      const now = Date.now()
      if (now - lastTime < 1000) {
        chatController.value?.abort()
        updateSessionData(sessionDataList.value.at(-1)!)
      }
      lastTime = now
    }
  }

  document.body.addEventListener('keydown', onKeydown)
}
