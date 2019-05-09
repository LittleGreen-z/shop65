// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/base.css'
import CusBread from '../src/components/cusBread.vue'
import App from './App'
import router from './router'
import moment from 'moment'
import HttpServer from '../src/http'

Vue.use(HttpServer)
Vue.config.productionTip = false
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
Vue.use(ElementUI)
Vue.component('cusBread', CusBread)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
