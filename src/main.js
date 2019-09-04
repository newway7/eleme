import Vue from 'vue'

import App from './App'
import router from './router/index.js'
import axios from 'axios'

import './assets/stylus/index.styl'


Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
