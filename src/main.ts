import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件

const app = createApp(App);


// 实例化 Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) //将插件添加到 pinia 实例上

app.use(ElementPlus).use(router).use(pinia).mount('#app')

//全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}