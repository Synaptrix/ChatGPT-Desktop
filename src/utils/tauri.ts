import { message, confirm } from '@tauri-apps/api/dialog'

/**
 * 错误弹框
 * @param errorMessage 错误信息
 */
export const dialogErrorMessage = (errorMessage: string) => {
  message(errorMessage, {
    title: import.meta.env.VITE_APP_NAME,
    type: 'error'
  })
}

/**
 * 删除询问弹框
 */
export const deleteConfirm = async () =>
  await confirm('确定要删除吗？', {
    title: import.meta.env.VITE_APP_NAME,
    type: 'error'
  })
