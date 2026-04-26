import { defineStore } from "pinia";
import { rolePermissions } from "@/mock/permission";
import { getUserInfoApi, getRoutesApi, logoutApi } from "@/api";
import { setupRoutes } from "@/router";
import router from "@/router";

export interface UserState {
  role: "user" | "guest" | "admin";
  permissions: string[];
  router: any[];
  tokenKey: string;
  token: string;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    role: "guest",
    permissions: [] as string[],
    router: [] as any[],
    tokenKey: "Bearer ",
    token: "",
  }),
  getters: {
    getRouter(): any[] {
      return this.router;
    },
  },
  actions: {
    setRole(role: UserState["role"]) {
      this.role = role;
      this.permissions = rolePermissions[role] || [];
    },
    setToken(token: string) {
      this.token = token;
    },
    setRouter(router: any[]) {
      this.router = router;
    },
    async login(role: UserState["role"]) {
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
        router.replace("/login");
      }
    },
    reset() {
      this.setToken("");
      this.setRouter([]);
      this.setRole("guest");
    },
    async getRoutes() {
      // if (this.token) {
      const res = await getRoutesApi(this.role);
      if (res.code === 200) {
        this.setRouter(res.data);
        await setupRoutes(); // 登录后设置路由
      }
      // }
    },
  },
  persist: true,
});
