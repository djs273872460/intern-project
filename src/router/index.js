import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login/Login.vue"
import home from "../views/home/Home"
import store from "../store"

 const constantRoutes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: home,
  },
  {
    path: '/empty',
    name: 'Empty',
    component: () => import('@/views/empty/Empty')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
});

router.beforeEach((to, from, next) => {
  if(store.getters.token){
    if(to.path === "/login") {
      next("/home")
    }else {
      next()
    }
  }else{
    if(to.path === "/login") {
      next()
    }else {
      next("/login")
    }
  }
})

export default router;
