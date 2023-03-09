import type { ThemeMode } from '@/types'

export const useMutationObserver = () => {
  // 主题模式
  const themeMode = ref<ThemeMode>('light')

  // 监听body元素的属性变化，如果是主题变化就更改主题模式
  const observer = new MutationObserver((mutationsList) => {
    for (const { type, attributeName } of mutationsList) {
      if (type === 'attributes' && attributeName === 'data-theme') {
        themeMode.value = document.documentElement.getAttribute(
          'data-theme'
        ) as ThemeMode
      }
    }
  })

  onMounted(() => {
    observer.observe(document.documentElement, {
      attributes: true
    })
  })

  return {
    themeMode
  }
}
