import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'highlight.js/styles/base16/edge-light.css'
import App from './App.vue'
import router from './router/index'
import './style/global.styl'
import './style/reset.styl'
import './style/common.styl'
import appGlobal from './appGlobal'

const app = createApp(App)
app.use(createPinia())

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(ElementPlus, { locale: zhCn }).use(appGlobal).mount('#app')
