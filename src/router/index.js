import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login/Login.vue"
import home from "../views/home/Home"

 const constantRoutes = [
  {
    path: '',
    redirect: '/login',
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: home,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import("../views/dashboard/index")
      },
      {
        path: 'document',
        name: 'Document',
        component: () => import("../views/document/index")
      },
      {
        path: 'chart',
        name: 'Chart',
        component: () => import("../views/chart/index")
      }
    ]
  }
];

// const asyncRoutes = [
//   {

//   }
// ];

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
