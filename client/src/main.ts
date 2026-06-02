import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'

import '@pixelium/web-vue/dist/font.css'
import '@pixelium/web-vue/dist/normalize.css'
import './styles/index.scss'

const app = createApp(App)
app.use(store)
app.mount('#app')
