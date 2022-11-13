import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import SignUpView from '../views/SignUpView.vue'
import GameView from '../views/GameView.vue'
import ResultView from '../views/ResultView.vue'
import RankingView from '../views/RankingView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
    meta: { requiresAuth: false }
  },
  {
    path: '/game',
    name: 'game',
    component: GameView,
    meta: { requiresAuth: true }
  },
  {
    path: '/result',
    name: 'result',
    component: ResultView,
    meta: { requiresAuth: true }
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: RankingView,
    meta: { requiresAuth: true }
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    
    const user = sessionStorage.getItem('user')
    console.log(JSON.parse(user))

    if(!user){
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }else{
      next() 
    }

  } else {
    next() 
  }
})

export default router
