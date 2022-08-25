import Toast from './toast.vue'
import { createApp } from 'vue' 

const ToastHandle = (params) => {
  let ToastInstance = createApp(Toast, params)
  const toastDom = ToastInstance.mount(document.createElement('div'));
  document.body.appendChild(toastDom.$el);
}

export default {
  install: (app) => {
    app.config.globalProperties.$toast = ToastHandle;
  }
}
