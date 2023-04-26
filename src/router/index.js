import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import TestView from '@/views/TestView.vue'
import PersonalInformation from '@/components/display/PersonalInformation.vue'
import UserManagement from '@/components/display/UserManagement.vue'
import ClassAffairsManagement from '@/components/display/ClassAffairsManagement.vue'
import StudentManagement from '@/components/display/StudentManagement.vue'
import ScoresManagement from '@/components/display/ScoresManagement.vue'
import QuestionnaireManagement from '@/components/display/QuestionnaireManagement.vue'
import NewQuestionnaire from '@/components/display/NewQuestionnaire.vue'
import { useUserStore } from '@/stores/user'
import VotesManagement from '@/components/display/VotesManagement.vue'
import NewVote from '@/components/display/NewVote.vue'
import TeacherRegisterView from '@/views/TeacherRegisterView.vue'

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
      },
      {
        path: 'studentManagement',
        name: 'studentManagement',
        component: StudentManagement
      },
      {
        path: 'scoresManagement',
        name: 'scoresManagement',
        component: ScoresManagement
      },
      {
        path: 'questionnaireManagement',
        name: 'questionnaireManagement',
        component: QuestionnaireManagement
      },
      {
        path: 'newQuestionnaire',
        name: 'newQuestionnaire',
        component: NewQuestionnaire
      },
      {
        path: 'votesManagement',
        name: 'votesManagement',
        component: VotesManagement
      },
      {
        path: 'newVote',
        name: 'newVote',
        component: NewVote
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
    },
    {
      path: '/adminRegister',
      name: 'teacherRegisterView',
      component: TeacherRegisterView
    },
    {
      path: '/register',
      redirect: '/adminRegister'
    },
    {
      path: '/admin',
      redirect: '/adminRegister'
    },
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
