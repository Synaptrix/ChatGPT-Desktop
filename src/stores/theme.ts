import { APP_THEME } from '@/constants'

// @unocss-include
export const useThemeStore = defineStore(
  'themeStore',
  () => {
    const themeMode = ref(APP_THEME.light)

    const themeClass = computed(() =>
      themeMode.value === APP_THEME.light ? 'bg-white/70' : 'bg-black/70'
    )

    watch(themeMode, (newTheme) => {
      document.documentElement.setAttribute('data-theme', newTheme)
    })

    return { themeMode, themeClass }
  },
  {
    persist: true
  }
)
