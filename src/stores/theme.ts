import { THEME } from '@/constants'

// @unocss-include
export const useThemeStore = defineStore(
  'themeStore',
  () => {
    const themeMode = ref(THEME.light)

    const themeClass = computed(() =>
      themeMode.value === THEME.light ? 'bg-white/60' : 'bg-black/60'
    )

    const toggleTheme = () => {
      themeMode.value =
        themeMode.value === THEME.light ? THEME.dark : THEME.light
    }

    watch(
      themeMode,
      (newTheme) => {
        document.body.setAttribute('arco-theme', newTheme)
      },
      {
        immediate: true
      }
    )

    return {
      themeMode,
      themeClass,
      toggleTheme
    }
  },
  {
    persist: true
  }
)
