import { createApp } from "vue";
import App from "./App.vue";
import { setupRouter } from "./router";
import { setupPermission } from "@/directives";
import { setupStore } from "@/store";
import "./permission";

// 创建实例
const setupAll = async () => {
  const app = createApp(App);

  setupStore(app);

  setupRouter(app);

  setupPermission(app);

  app.mount("#app");
};

setupAll();
