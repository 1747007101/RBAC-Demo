import { createRouter, createWebHistory } from "vue-router";
import { App } from "vue";
import { useUserStore } from "@/store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: () => import("@/views/login/index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/error/404.vue"),
    },
  ],
});

const modules = import.meta.glob("@/views/**/*.vue");

function loadView(component: string) {
  const path = `/src/${component}.vue`;
  const mod = modules[path];

  if (!mod) {
    console.warn(`组件未找到: ${path}`);
    return () => import("@/views/error/404.vue");
  }

  return mod;
}
function transformRoutes(routes: any[]) {
  return routes.map((route) => {
    const record: any = {
      path: route.path,
      name: route.name,
      component: loadView(route.component),
      meta: route.meta || {},
    };

    if (route.redirect) {
      record.redirect = route.redirect;
    }

    if (route.children && route.children.length) {
      record.children = transformRoutes(route.children);
    }

    return record;
  });
}

export async function setupRoutes() {
  const userStore = useUserStore();
  const asyncRoutes = userStore.getRouter;
  if (asyncRoutes.length === 0) {
    console.warn("过滤后无有效路由，跳过路由添加");
    return;
  }
  const roleRoutes = transformRoutes(asyncRoutes);
  // 3. 遍历路由，添加前做同名校验
  roleRoutes.forEach((route) => {
    // 3.1 基础校验：路由名称/路径不能为空（避免无效路由）
    if (!route.name || !route.path) {
      console.error(`路由格式错误，跳过添加：`, route);
      return;
    }

    // 3.2 核心：检查是否已存在同名路由
    const isRouteExist = router
      .getRoutes()
      .some((existRoute) => existRoute.name === route.name);

    if (isRouteExist) {
      console.log(`ℹ️ 路由 ${route.name} 已存在，跳过重复添加`);
      return; // 已存在则跳过
    }
    // 3.3 安全添加：仅当路由不存在时才添加
    try {
      router.addRoute(route);
      console.log(`成功添加路由：${route.name} → ${route.path}`);
    } catch (err) {
      console.error(`添加路由 ${route.name} 失败：`, err);
    }
  });
}

export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
export default router;
