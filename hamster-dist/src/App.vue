<script setup>
import { RouterView } from "vue-router";
import { getLang } from "@/utils";

const lang = getLang();
</script>

<template>
  <div class="views_wrap" :dir="lang == 'ara' ? 'rtl' : 'ltr'" :class="lang">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.views_wrap {
  width: 100%;
  height: calc(100vh);
}
</style>
<style>
.van-toast {
  background: rgba(0, 0, 0, 0.7) !important;
}
</style>
