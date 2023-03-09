import { AppTheme } from '@/constants'

// @unocss-include
export const useAppStore = defineStore(
  'app',
  () => {
    const themeMode = ref(AppTheme.light)

    const themeStyle = computed(() =>
      themeMode.value === AppTheme.light ? 'bg-white/50' : 'bg-black/50'
    )

    return { themeMode, themeStyle }
  },
  {
    persist: true
  }
)
