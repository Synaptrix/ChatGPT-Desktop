import { register, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'
import { enable, disable } from 'tauri-plugin-autostart-api'
import { nanoid } from 'nanoid'
import type { ThemeMode, TokenUnit } from '@/types'

export const useSettingsStore = defineStore(
  'settingsStore',
  () => {
    // 主题
    const themeMode = ref<ThemeMode>('system')

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

    // 是否开启代理
    const proxy = reactive({ bypass: false, url: '' })

    // modal设置参数
    const modalParams = reactive({ temperature: 0.6, max_tokens: 2000 })

    // token
    // 用量
    const isTokenUsage = ref(false)
    // 单位
    const tokenUnit = ref<TokenUnit>('TK')

    // 显示对话时间
    const showTime = ref(false)

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

          showWindow()
        } else {
          hideWindow()
        }
      })
    }

    // 切换主题
    const toggleTheme = async (theme: ThemeMode = themeMode.value) => {
      if (theme === 'system') {
        theme = (await appWindow.theme()) as ThemeMode
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
      uuid.value = nanoid()
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
      proxy,
      modalParams,
      isTokenUsage,
      tokenUnit,
      showTime,
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
        'proxy',
        'modalParams',
        'isTokenUsage',
        'tokenUnit',
        'showTime'
      ]
    }
  }
)
