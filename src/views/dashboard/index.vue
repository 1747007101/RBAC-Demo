<template>
  <div>
    <h2>首页</h2>
    <p>当前角色：{{ role }}</p>
    <ul>
      <li v-hasPermi="'permission:demo'">
        <router-link to="/permission-demo">权限页</router-link>
      </li>
      <li v-hasPermi="'user:role'">
        <router-link to="/user">用户页</router-link>
      </li>
    </ul>
    <br />
    <button @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";

const store = useUserStore();

const role = store.role;

const handleLogout = () => {
  store.logout();
};
</script>
