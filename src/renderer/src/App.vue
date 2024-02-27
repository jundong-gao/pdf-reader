
<template>
  <ElConfigProvider :locale="zh">
    <router-view></router-view>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import zh from 'element-plus/dist/locale/zh-cn'
</script>