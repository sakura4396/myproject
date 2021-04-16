import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Welcome from '../components/welcome.vue'

Vue.use(VueRouter)
/* eslint-disable */
const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Welcome
  }
]

const router = new VueRouter({
  routes
})

export default router
