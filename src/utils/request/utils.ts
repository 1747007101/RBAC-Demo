import { useUserStore } from "@/store";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const isRedirecting = ref(false);

export function handleLogout() {
  const userStore = useUserStore();
  // 👉 防止多个接口同时401，触发多次跳转（很关键！）
  if (isRedirecting.value) return;
  isRedirecting.value = true;

  // 清除token & 用户信息
  userStore.reset(); // 你自己实现（清token、清权限路由）

  // 跳转登录页（带上当前地址，方便登录后回跳）
  router.replace({
    path: "/login",
    query: {
      redirect: location.pathname,
    },
  });
}
