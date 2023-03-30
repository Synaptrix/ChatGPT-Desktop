import { appWindow } from '@tauri-apps/api/window'
import { type } from '@tauri-apps/api/os'

export const useInit = () => {
  const isLoading = ref(true)

  const windowClass = ref('')

  const { isFix, windowFocused } = storeToRefs(useSettingsStore())

  onMounted(async () => {
    await initSQL()

    isLoading.value = false

    useObserverLink()

    useDisableShortcuts()

    appWindow.onFocusChanged(({ payload }) => {
      windowFocused.value = payload

      setTimeout(() => {
        if (!windowFocused.value && !isFix.value) hideWindow()
      }, 100)
    })

    if (import.meta.env.PROD) {
      document.addEventListener('contextmenu', function (event) {
        if (!window.getSelection()?.toString()) {
          event.preventDefault()
        }
      })
    }
  })

  watch(
    windowFocused,
    async (newValue) => {
      const platformName = await type()

      if (platformName !== 'Darwin') {
        windowClass.value = 'bordered'
      } else {
        let className = 'rounded-xl '
        className += newValue ? 'bordered' : 'bordered-transparent'

        windowClass.value = className
      }
    },
    { immediate: true }
  )

  return { isLoading, windowClass }
}
