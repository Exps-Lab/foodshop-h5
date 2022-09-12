import { createApp } from 'vue'
import App from './App.vue'
import '@common/styles/reset.less'
// [note]引入Vant中函数ui组件
import { bindFunctionComponents } from '@common/vantFunctionComponents'

const app = createApp(App)
bindFunctionComponents(app)

app.mount('#app')
