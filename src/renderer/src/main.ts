import '@renderer/styles/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@renderer/router'
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@renderer/styles/tailwind.css'
import '@renderer/styles/flex.css'
import { createPinia } from 'pinia'
import '@renderer/styles/var.scss'
import piniaPlugin from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


let app = createApp(App)
let pinia = createPinia()
pinia.use(piniaPlugin)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.use(router)
app.use(elementPlus)
app.use(pinia)




app.mount('#app')
