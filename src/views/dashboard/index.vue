<template>
  <div>
    <h2>首页</h2>
    <p>当前角色：{{ role }}</p>
    <PermissionDemo />
    <br />
    <button @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/info";
import PermissionDemo from "@/views/permission-demo/permission-demo.vue";

const store = useUserStore();

const role = store.role;

const handleLogout = () => {
  store.logout();
  console.log("退出登录");
};
</script>
