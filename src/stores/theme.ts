import { THEME } from '@/constants'

// @unocss-include
export const useThemeStore = defineStore(
  'themeStore',
  () => {
    const themeMode = ref(THEME.light)

    const themeClass = computed(() =>
      themeMode.value === THEME.light ? 'bg-white/70' : 'bg-black/70'
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
