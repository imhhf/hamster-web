import { createRouter, createWebHistory } from "vue-router";
import { getLang } from "@/utils";
import router_modules from "./config";

const router_base = [
  // 首页
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: router_base.concat(router_modules),
});

console.log(router_modules);


router.beforeEach((to, from, next) => {
  // 设置页面标题
  const title = to.meta["title_" + getLang()];
  document.title = title ? title : "Hamster";

  next();
});

export default router;
