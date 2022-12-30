import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    //首页
    path: "/",
    name: "Index",
    component: () => import("../views/Index.vue"),
    redirect: "/wall",
    children: [
      {
        path: "/wall",
        name: "Wall",
        component: () => import("../views/Wall.vue"),
      },
      {
        path: "/photo",
        name: "Photo",
        component: () => import("../views/Photo.vue"),
      },
    ],
  },
  // {
  //   path: "/wall",
  //   name: "Wall",
  //   component: () => import("../views/Wall.vue"),
  // },
  // {
  //   path: "/photo",
  //   name: "Photo",
  //   component: () => import("../views/Photo.vue"),
  // },

  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];

const router = new VueRouter({
  routes,
});

export default router;
