import { createApp } from 'vue'
import App from './App.vue'
import '@common/styles/reset.less'
// [note]引入Vant中函数组件css
import '@common/vantFunctionComponentsCss'

const app = createApp(App)
app.mount('#app')
