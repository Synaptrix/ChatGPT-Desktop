import { register, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'

export const useShortcutKeyStore = defineStore(
  'shortcutKeyStore',
  () => {
    const defaultShortcutKey = ref(['Alt', 'X'])

    const shortcutKey = ref<string[]>([])

    const finalShortcutKeys = computed(() =>
      shortcutKey.value.length ? shortcutKey.value : defaultShortcutKey.value
    )

    const setupComplete = ref(false)

    const registerKey = async () => {
      await unregisterAll()

      register(finalShortcutKeys.value.join('+'), () => {
        appWindow.setFocus()
      })
    }

    watch(setupComplete, registerKey)

    onMounted(registerKey)

    return {
      defaultShortcutKey,
      shortcutKey,
      setupComplete,
      finalShortcutKeys
    }
  },
  {
    persist: true
  }
)
