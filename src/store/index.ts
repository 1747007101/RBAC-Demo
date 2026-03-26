// src/store/index.ts
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useUserStore } from "./modules/user";
import { usePermissionStore } from "./modules/permission";

import { App } from "vue";

// 创建Pinia实例
const store = createPinia();

// 注册持久化插件
store.use(piniaPluginPersistedstate);
export const setupStore = (app: App<Element>) => {
  app.use(store);
};
export { store };

export { useUserStore, usePermissionStore };
