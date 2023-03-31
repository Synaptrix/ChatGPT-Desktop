import { type, OsType } from '@tauri-apps/api/os'
import type { CSSProperties } from 'vue'

export const useModalStyle = () => {
  const platform = ref<OsType>('Darwin')

  const modalMaskStyle = computed<CSSProperties>(() => ({
    borderRadius: platform.value === 'Darwin' ? '0.75rem' : 0
  }))

  onMounted(async () => {
    platform.value = await type()
  })

  return {
    modalMaskStyle
  }
}
