import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import Layout from '../components/HelloWorld.vue'

const routes: Array<RouteRecordRaw> = [
  {
  //路由初始指向
    path: '/',
    name: 'home',
    component:()=>import('@/view/home/index.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
