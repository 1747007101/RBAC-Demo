import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";

router.beforeEach(async (to) => {
  const { token, router } = storeToRefs(useUserStore());
  const { isLoaded } = storeToRefs(usePermissionStore());

  const hasToken = !!token.value;

  // 白名单
  const whiteList = ["/login"];

  // 未登录
  if (!hasToken) {
    console.log("未登录");
    if (whiteList.includes(to.path)) return;

    return `/login?redirect=${encodeURIComponent(to.fullPath)}`;
  }

  // 已登录访问 login → 重定向
  if (to.path === "/login") {
    const redirect = router.value?.[0].path;
    return redirect;
  }
  // 初始化动态路由（刷新场景）
  if (!isLoaded.value) {
    try {
      const userStore = useUserStore();

      // 获取后端路由并 addRoute
      await userStore.getRoutes();

      isLoaded.value = true;
      // 重新匹配路由
      return { ...to, replace: true };
    } catch (err) {
      console.error("动态路由加载失败", err);

      return "/login";
    }
  }
});
