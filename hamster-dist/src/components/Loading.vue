<script setup>
const props = defineProps({
  // 是否展示
  show: {
    type: Boolean,
    default: true,
  },

  // 动画时长，单位秒，设置为 0 可以禁用动画
  duration: {
    type: Number,
    default: 0.3,
  },

  // loading颜色
  color: {
    type: String,
    default: "#1989fa",
  },

  // overlay颜色
  bgColor: {
    type: String,
    default: "",
  },

  // 提示文字
  text: {
    type: String,
    default: "",
  },

  // loading类型
  type: {
    type: String,
    default: "spinner", // circular、spinner
  },

  // loading加载图标大小
  size: {
    type: String,
    default: "30px",
  },

  // loading文字大小
  textSize: {
    type: String,
    default: "14px",
  },

  // loading文字颜色
  textColor: {
    type: String,
    default: "#1989fa",
  },

  //loading图标是否和文字内容垂直排列
  vertical: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["hide"])

function overlayHide() {
  emit("hide");
}
</script>
  
<template>
  <van-overlay class="loading" :show="show" :duration="duration" :z-index="9999" :style="{ background: bgColor }"
    @click="overlayHide()">
    <van-loading :color="color" :type="type" :size="size" :text-size="textSize" :text-color="textColor"
      :vertical="vertical">
      {{ text }}
    </van-loading>
  </van-overlay>
</template>
  
<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>