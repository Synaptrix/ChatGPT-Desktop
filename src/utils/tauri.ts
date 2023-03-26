import { message } from '@tauri-apps/api/dialog'
import { getName } from '@tauri-apps/api/app'

/**
 * 错误弹框
 * @param errorMessage 错误信息
 */
export const dialogErrorMessage = async (errorMessage: string) => {
  const appName = await getName()

  message(errorMessage, {
    title: appName,
    type: 'error'
  })
}
