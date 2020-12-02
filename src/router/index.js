import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login/Login.vue"

export const constantRoutes = [
  {
    path: '',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login
  }
];

export const asyncRoutes = [
  {
    path: '/home',
    component: () => import("../views/home/Home.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
});

export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
  });
  router.matcher = newRouter.matcher;
}
let flag = true;
router.beforeEach((to, from, next) => {
  if (to.path == '/home' && flag) {
    asyncRoutes.forEach(route => {
      console.log(route);
      router.addRoute(route);
    })
    flag = false;
    next({...to,replace:true});
  }else {
    next();
  }
})

export default router;
