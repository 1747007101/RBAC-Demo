<template>
  <div>
    <h2>用户页</h2>
    <p>这是一个用户业务页面，只有admin与user可以访问。</p>
    <button @click="back()">返回</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const { back } = useRouter();
</script>

<style scoped></style>
