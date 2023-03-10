import { createApp } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import 'uno.css'
import '@kidonng/daisyui/index.css'
import './assets/css/global.scss'

createApp(App).use(createPinia().use(piniaPluginPersistedstate)).mount('#app')
