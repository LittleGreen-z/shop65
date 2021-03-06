import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Users from '../components/users.vue'
import Rights from '../components/rights.vue'
import Roles from '../components/roles.vue'
import Goodlist from '../components/goodslist.vue'
import Goodadd from '../components/goodsadd.vue'
import Cateparams from '../components/cateparams.vue'
import Goodscate from '../components/goodscate.vue'
import { Message } from 'element-ui'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
      {
        name: 'roles',
        path: '/roles',
        component: Roles
      },
      {
        name: 'goods',
        path: '/goods',
        component: Goodlist
      },
      {
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodadd
      },
      {
        name: 'params',
        path: '/params',
        component: Cateparams
      },
      {
        name: 'categories',
        path: '/categories',
        component: Goodscate
      }]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  }
  else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录')
      router.push({name: 'login'})
      return
    }
    next()
  }
})
export default router