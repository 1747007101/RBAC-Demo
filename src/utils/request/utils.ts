import { useUserStore } from "@/store";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const isRedirecting = ref(false);

export function handleLogout() {
  const userStore = useUserStore();
  if (isRedirecting.value) return;
  isRedirecting.value = true;

  // 清除token & 用户信息
  userStore.reset();

  // 跳转登录页
  router.replace({
    path: "/login",
    query: {
      redirect: location.pathname,
    },
  });
}
