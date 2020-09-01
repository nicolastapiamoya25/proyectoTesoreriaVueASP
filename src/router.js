import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './components/Login.vue'
import Ingreso from './components/Ingreso.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{
        
      }
    },
    {
      path: '/ingreso',
      name: 'ingreso',
      component: Ingreso
    },
  ]
})
/*
router.beforeEach((to, from , next)=>{
  if(to.matched.some(record => record.meta.libre)){
    next()
  }
})
*/
export default router
