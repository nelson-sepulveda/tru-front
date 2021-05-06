import Vue from 'vue'
import App from './App.vue';
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin, BootstrapVueIcons  } from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2';

import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import IndexComponent from './components/index'
import ProfileUserComponent from './components/profile-user'

// If you don't need the styles, do not connect


Vue.use(VueSweetalert2)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(IconsPlugin)
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "IndexComponent",
    component: IndexComponent
  },
  {
    path: "/profile",
    name: "ProfileUserComponent",
    component: ProfileUserComponent
  }
]

const router = new VueRouter({
  routes
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
