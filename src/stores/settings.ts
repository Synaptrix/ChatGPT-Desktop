import { register, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'
import { THEME, DEFAULT_SHORTCUT_KEY } from '@/constants'

// @unocss-include
export const useSettingsStore = defineStore(
  'settingsStore',
  () => {
    // 主题
    const themeMode = ref(THEME.light)
    const themeClass = computed(() =>
      themeMode.value === THEME.light ? 'bg-white/70' : 'bg-black/70'
    )

    // 用户的唯一值
    const uuid = ref('')

    // 是否固定窗口
    const isFix = ref(true)

    // openAI api key
    const apiKey = ref('')

    // 全局快捷键
    const shortcutKey = ref<string[]>([])
    const isBinding = ref(false)

    // 切换主题
    const toggleTheme = () => {
      themeMode.value =
        themeMode.value === THEME.light ? THEME.dark : THEME.light
    }

    // 绑定热键
    const registerKey = async () => {
      await unregisterAll()

      register(shortcutKey.value.join('+'), () => {
        appWindow.setFocus()
      })
    }

    // 监听主题
    watchEffect(() => {
      document.body.setAttribute('arco-theme', themeMode.value)
    })

    // 监听 uuid
    watchEffect(() => {
      if (uuid.value) return

      uuid.value = crypto.randomUUID()
    })

    // 监听快捷键
    watchEffect(() => {
      if (shortcutKey.value.length) return

      shortcutKey.value = DEFAULT_SHORTCUT_KEY
    })

    // 监听快捷键绑定状态
    watchEffect(() => {
      if (isBinding.value) return

      registerKey()
    })

    return {
      themeMode,
      themeClass,
      uuid,
      isFix,
      apiKey,
      shortcutKey,
      isBinding,
      toggleTheme
    }
  },
  {
    persist: {
      // paths: ['themeMode', 'uuid', 'apiKey', 'shortcutKey']
    }
  }
)
