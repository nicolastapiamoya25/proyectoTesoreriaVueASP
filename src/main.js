import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL='http://localhost:3013'
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
