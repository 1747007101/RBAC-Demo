<template>
  <div>
    <h2>权限演示</h2>

    <table border="1">
      <tr>
        <th>权限code</th>
        <th>是否拥有</th>
      </tr>

      <tr v-for="code in allPermissions" :key="code">
        <td>{{ code }}</td>
        <td>{{ hasPermission(code) ? "✅" : "❌" }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { hasPermission } from "@/directives/permission";

const allPermissions = ["dashboard:view", "user:role", "guest:role"];
</script>
