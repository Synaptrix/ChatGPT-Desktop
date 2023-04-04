import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import '@arco-design/web-vue/es/message/style/css.js'
import 'uno.css'
import 'highlight.js/styles/github-dark-dimmed.css'
import './assets/css/global.scss'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate)).mount('#app')
