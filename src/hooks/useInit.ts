import { appWindow } from '@tauri-apps/api/window'
import { type } from '@tauri-apps/api/os'
import { invoke } from '@tauri-apps/api/tauri'

export const useInit = () => {
  const windowClass = ref('')

  const { isFix, windowFocused } = storeToRefs(useSettingsStore())

  onMounted(async () => {
    await initSQL()

    invoke('close_splashscreen')

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

  return { windowClass }
}
