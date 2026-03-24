<template>
  <div>
    <h2>首页</h2>
    <p>当前角色：{{ role }}</p>
    <permissionDemo />
    <br />
    <button @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/info";
import permissionDemo from "@/views/permission-demo/index.vue";

const store = useUserStore();

const role = store.role;

const handleLogout = () => {
  store.logout();
};
</script>
