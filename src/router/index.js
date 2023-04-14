import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import TestView from '@/views/TestView.vue'
import PersonalInformation from '@/components/display/PersonalInformation.vue'
import UserManagement from '@/components/display/UserManagement.vue'
import ClassAffairsManagement from '@/components/display/ClassAffairsManagement.vue'
import { useUserStore } from '@/stores/user'

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
      },
      {
        path: '/',
        redirect: { name: 'personalInformation' }
      },
      {
        path: '/information',
        redirect: { name: 'personalInformation' }
      },
      {
        path: 'userManagement',
        name: 'userManagement',
        component: UserManagement
      },
      {
        path: 'classAffairsManagement',
        name: 'classAffairsManagement',
        component: ClassAffairsManagement
      }]
    },
    {
      path: '/login',
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

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if (userStore.user.id == 0 && to.name !== 'login') {
    ElMessage.warning('请先登录！')
    return { name: 'login' }
  }
})

export default router
