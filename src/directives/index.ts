import type { App } from "vue";
import { setupPermissionDirective } from "./permission/directive";

export const setupPermission = (app: App<Element>) => {
  setupPermissionDirective(app);
};
