import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login/Login.vue"
import home from "../views/home/Home"

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




// let flag = true;
// router.beforeEach((to, from, next) => {
//   if (to.path == '/home' && flag) {
//     asyncRoutes.forEach(route => {
//       console.log(route);
//       router.addRoute(route);
//     })
//     flag = false;
//     next({...to,replace:true});
//   }else {
//     next();
//   }
// })


export default router;
