import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from '@/plugins/Toast'
import '@common/styles/reset.less'
import '@common/styles/common-style.less'
import '@common/styles/btn_style.less'
// [note]引入Vant中函数组件css
import '@common/vantFunctionComponentsCss'
import { installDirectives } from '@common/directives'
import { createPinia } from 'pinia'
// import { initSentry } from '@viteConf/sentryConf'

const app = createApp(App)
// initSentry(app, router)

app.use(Toast)
app.use(router)
app.use(createPinia())
installDirectives(app)
app.mount('#app')
