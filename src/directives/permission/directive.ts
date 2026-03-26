import { type DirectiveBinding } from "vue";
import { useUserStore } from "@/store/modules/user";
import { App } from "vue";

/**
 * 函数式
 * @methods
 */
export function hasPermission(code: string) {
  if (!code) return false;
  const store = useUserStore();

  if (store.permissions.includes("*")) return true;

  return store.permissions.includes(code);
}

export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const code = binding.value;
    if (!hasPermission(code)) {
      el.parentNode?.removeChild(el);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    const code = binding.value;
    if (hasPermission(code)) {
      // 有权限 → 恢复显示（如果被移除过）
      if (!el.parentNode) document.body.appendChild(el);
    } else {
      // 无权限 → 移除
      el.parentNode?.removeChild(el);
    }
  },
};
/**
 *
 * @methods 导出指令：v-hasPermi
 */
export const setupPermissionDirective = (app: App<Element>) => {
  app.directive("hasPermi", permissionDirective);
};
