import { register, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'
import { hide, show } from '@tauri-apps/api/app'
import { enable, disable } from 'tauri-plugin-autostart-api'
import type { THEME_MODE } from '@/types'

export const useSettingsStore = defineStore(
  'settingsStore',
  () => {
    // 主题
    const themeMode = ref<THEME_MODE>('system')

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

    // 是否记住上次位置
    const isRememberPosition = ref(false)

    // 代理地址
    const proxyUrl = ref('')

    // modal设置参数
    const modalParams = reactive({ temperature: 0.6, maxTokens: 2000 })

    // 绑定快捷键
    const registerKey = async () => {
      await unregisterAll()

      register(shortcutKeys.value.join('+'), () => {
        // 如果窗口已经显示，就隐藏
        if (!windowFocused.value) {
          // 窗口打开时居中还是上次位置
          if (!isRememberPosition.value) {
            appWindow.center()
          }

          appWindow.unminimize()
          show() // macos 显示程序专用
          appWindow.show()
          appWindow.setFocus()
        } else {
          hide() // macos 隐藏程序专用
          appWindow.hide()
        }
      })
    }

    // 切换主题
    const toggleTheme = async (theme: THEME_MODE = themeMode.value) => {
      if (theme === 'system') {
        theme = (await appWindow.theme()) as THEME_MODE
      }

      document.body.setAttribute('arco-theme', theme)
    }

    onMounted(() => {
      toggleTheme()

      // 监听主题的变化
      appWindow.onThemeChanged(({ payload }) => {
        if (themeMode.value === 'system') {
          document.body.setAttribute('arco-theme', payload)
        }
      })

      // 获取 uuid
      if (uuid.value) return
      uuid.value = crypto.randomUUID()
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
      autoStart.value ? enable() : disable()
    })

    // 监听显示设备变化时，重置窗口位置到中间，以防止窗口位置偏移到屏幕外
    appWindow.onScaleChanged(() => {
      appWindow.center()
    })

    return {
      themeMode,
      uuid,
      isFix,
      windowFocused,
      apiKey,
      shortcutKeys,
      isBinding,
      autoStart,
      isMemory,
      isRememberPosition,
      proxyUrl,
      ...toRefs(modalParams),
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
        'isMemory',
        'isRememberPosition',
        'proxyUrl',
        'modalParams'
      ]
    }
  }
)
