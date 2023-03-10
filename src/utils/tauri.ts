import { message } from '@tauri-apps/api/dialog'

export const dialogErrorMessage = (errorMessage: string) => {
  message(errorMessage, {
    title: import.meta.env.VITE_APP_NAME,
    type: 'error'
  })
}
