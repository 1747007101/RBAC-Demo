import { defineStore } from "pinia";
import { rolePermissions } from "@/mock/permission";
import { getUserInfoApi, getRoutesApi, logoutApi } from "@/api";
import { setupRoutes } from "@/router";
import router from "@/router";

export const useUserStore = defineStore("user", {
  state: () => ({
    role: "guest",
    permissions: [] as string[],
    router: [] as any[],
    tokenKey: "Bearer ",
    token: "",
  }),
  getters: {
    getRouter() {
      return this.router;
    },
  },
  actions: {
    setRole(role: string) {
      this.role = role;
      this.permissions = rolePermissions[role] || [];
    },
    setToken(token: string) {
      this.token = token;
    },
    setRouter(router: any[]) {
      this.router = router;
    },
    async login(role: string) {
      const res = await getUserInfoApi({ role });
      if (res.code === 200) {
        const { token, userInfo } = res.data;
        console.log("Login successful, token set:", this.token); // 调试输出
        this.setRole(userInfo.role);
        this.setToken(token);
        this.permissions = userInfo.permissions;
        await this.getRoutes();
      }
    },
    async logout() {
      const res = await logoutApi();
      if (res.code === 200) {
        this.reset();
      }
    },
    reset() {
      this.setToken("");
      this.setRouter([]);
      this.setRole("guest");
      router.replace("/login");
    },
    async getRoutes() {
      // if (this.token) {
      const res = await getRoutesApi();
      if (res.code === 200) {
        this.setRouter(res.data);
        await setupRoutes(); // 登录后设置路由
      }
      // }
    },
  },
  persist: true,
});
