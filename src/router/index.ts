import { createRouter, createWebHistory } from "vue-router";
import { App } from "vue";
import { usePermissionStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";

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
    console.warn("⚠️ 过滤后无有效路由，跳过路由添加");
    return;
  }
  const roleRoutes = transformRoutes(asyncRoutes);
  // 3. 遍历路由，添加前做同名校验
  roleRoutes.forEach((route) => {
    // 3.1 基础校验：路由名称/路径不能为空（避免无效路由）
    if (!route.name || !route.path) {
      console.error(`❌ 路由格式错误，跳过添加：`, route);
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
    const routes = transformRoutes(asyncRoutes);
    // 3.3 安全添加：仅当路由不存在时才添加
    try {
      router.addRoute(route);
      console.log(`✅ 成功添加路由：${route.name} → ${route.path}`);
    } catch (err) {
      console.error(`❌ 添加路由 ${route.name} 失败：`, err);
    }
  });
}
router.beforeEach(async (to, from) => {
  const { token, router } = storeToRefs(useUserStore());
  const { isLoaded } = storeToRefs(usePermissionStore());

  const hasToken = !!token.value;

  // ✅ 白名单
  const whiteList = ["/login"];

  // ❌ 未登录
  if (!hasToken) {
    console.log("未登录");
    if (whiteList.includes(to.path)) return;

    return `/login?redirect=${encodeURIComponent(to.fullPath)}`;
  }

  // ✅ 已登录访问 login → 重定向
  if (to.path === "/login") {
    const redirect = router.value?.[0].path;
    return redirect;
  }
  // ✅ 初始化动态路由（刷新场景）
  if (!isLoaded.value) {
    try {
      const userStore = useUserStore();

      // 👉 获取后端路由并 addRoute
      await userStore.getRoutes();

      isLoaded.value = true;
      // ⚠️ 关键：重新匹配路由
      return { ...to, replace: true };
    } catch (err) {
      console.error("动态路由加载失败", err);

      return "/login";
    }
  }
  // // ❌ 未登录
  // if (!token.value && to.path !== "/login") {
  //   return "/login";
  // }

  // // ✅ 已登录但未加载动态路由（包括刷新）
  // console.log("导航守卫检查：", token.value, isLoaded.value);
  // if (token.value && !isLoaded.value) {
  //   // if (to.path === "/login") {
  //   //   return router[0]?.path; // 已登录但访问登录页，允许访问
  //   // }
  //   try {
  //     const userStore = useUserStore();
  //     await userStore.getRoutes();

  //     isLoaded.value = true;

  //     // ⚠️ 关键：重新进入当前页面
  //     return { ...to, replace: true };
  //   } catch (err) {
  //     console.error("动态路由加载失败", err);
  //     return "/login";
  //   }
  // }
});
export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
export default router;
