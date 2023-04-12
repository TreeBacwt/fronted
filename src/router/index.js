import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import TestView from '@/views/TestView.vue'
import PersonalInformation from '@/components/display/PersonalInformation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      children: [{
        path: 'personalInformation',
        name: 'personalInformation',
        component: PersonalInformation
      }]
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    }
  ]
})

export default router
