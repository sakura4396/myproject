import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import Amap from 'vue-amap'

Vue.config.productionTip = false
Vue.use(Amap)
Amap.initAMapApiLoader({
  key: '9a30153b24a92e6b3136253da83fc528',
  plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.DragRoute']
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
