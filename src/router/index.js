import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Welcome from '../components/welcome.vue'
import Home from '../components/home.vue'
import Users from '../components/users.vue'
import Maps from '../components/maps.vue'
import NotFound from '../components/Notfound.vue'

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
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/maps',
        component: Maps,
      },
      {
        path: '/notfound',
        component: NotFound
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径，from代表从哪个路径跳转而来， next是一个函数，代表放行  next():放行 next('/login'):强制跳转
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  if (to.matched.length === 0) {
    return next('/notfound')
  }
  next()
})

export default router
