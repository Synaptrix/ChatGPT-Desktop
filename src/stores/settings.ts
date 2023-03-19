import { register, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'
import { enable, disable } from 'tauri-plugin-autostart-api'
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

    // 窗口获取焦点状态
    const windowFocused = ref(true)

    // openAI api key
    const apiKey = ref('')

    // 全局快捷键
    const prevShortcutKeys = ref<string[]>([])
    const shortcutKeys = ref<string[]>([])
    const isBinding = ref(false)

    // 开机自启动
    const autoStart = ref(false)

    // 记忆对话
    const isMemory = ref(false)

    // 切换主题
    const toggleTheme = () => {
      themeMode.value =
        themeMode.value === THEME.light ? THEME.dark : THEME.light
    }

    // 绑定热键
    const registerKey = async () => {
      await unregisterAll()

      register(shortcutKeys.value.join('+'), () => {
        // 如果窗口已经显示，就隐藏
        if (!windowFocused.value) {
          appWindow.show()
          appWindow.setFocus()
        } else {
          appWindow.hide()
        }
      })
    }

    // 获取 uuid
    onMounted(() => {
      if (uuid.value) return

      uuid.value = crypto.randomUUID()
    })

    // 监听主题
    watchEffect(() => {
      document.body.setAttribute('arco-theme', themeMode.value)
    })

    // 监听快捷键更换
    watchEffect(() => {
      if (isBinding.value || shortcutKeys.value.length) return

      shortcutKeys.value = prevShortcutKeys.value.length
        ? prevShortcutKeys.value
        : DEFAULT_SHORTCUT_KEY
    })

    // 监听快捷键绑定状态
    watchEffect(() => {
      if (isBinding.value) {
        prevShortcutKeys.value = shortcutKeys.value
        shortcutKeys.value = []

        unregisterAll()
      } else {
        registerKey()
      }
    })

    // 监听开机自启动
    watchEffect(() => {
      if (autoStart.value) {
        enable()
      } else {
        disable()
      }
    })

    return {
      themeMode,
      themeClass,
      uuid,
      isFix,
      windowFocused,
      apiKey,
      shortcutKeys,
      isBinding,
      autoStart,
      isMemory,
      toggleTheme
    }
  },
  {
    persist: {
      paths: [
        'themeMode',
        'uuid',
        'apiKey',
        'shortcutKeys',
        'autoStart',
        'isMemory'
      ]
    }
  }
)
