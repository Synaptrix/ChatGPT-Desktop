import { createApp } from 'vue'
import { message } from '@tauri-apps/api/dialog'
import App from './App.vue'
import 'uno.css'
import '@kidonng/daisyui/index.css'
import './assets/css/global.scss'

window.onerror = (errorMessage) => {
  message((errorMessage as string).replace('Error: ', ''), {
    title: import.meta.env.VITE_APP_NAME,
    type: 'error'
  })

  return true
}

createApp(App).mount('#app')
