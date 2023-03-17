import { createApp } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import hljs from 'highlight.js'
import '@arco-design/web-vue/es/message/style/css.js'
import 'uno.css'
import 'highlight.js/styles/github-dark-dimmed.css'
import '@kidonng/daisyui/index.css'
import './assets/css/global.scss'

const app = createApp(App)

app.directive('highlight', {
  mounted(el) {
    const blocks = el.querySelectorAll('pre code')
    blocks.forEach((block: any) => {
      hljs.highlightBlock(block)
    })
  }
})

app.use(createPinia().use(piniaPluginPersistedstate)).mount('#app')
