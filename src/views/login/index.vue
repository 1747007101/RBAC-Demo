<template>
  <div>
    <h2>选择角色</h2>
    <button @click="login('admin')">管理员</button>
    <button @click="login('user')">普通用户</button>
    <button @click="login('guest')">访客</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/store";

const router = useRouter();
const store = useUserStore();
const { isLoaded } = storeToRefs(usePermissionStore());

async function login(role: string) {
  await store.login(role);
  router.push({
    name: "Dashboard",
  });
  isLoaded.value = true; // 重置加载状态，确保路由重新加载
}
</script>
