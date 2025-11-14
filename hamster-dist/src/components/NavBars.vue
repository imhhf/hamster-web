<script setup>
import { computed, onMounted } from "vue";
import { deviceType } from "@/utils";

const device = deviceType();
const props = defineProps({
  // 是否需要适配不兼容的安卓机型padding-top
  isPdTop: {
    type: Boolean,
    default: true,
  },

  // 是否固定在顶部
  isFixed: {
    type: Boolean,
    default: false,
  },

  // 是否显示下边框
  isBorder: {
    type: Boolean,
    default: false,
  },

  // 层级
  zIndex: {
    type: Number,
    default: 1,
  },

  // 底色
  bgColor: {
    type: String,
    default: "#ffffff",
  },

  // 是否需要左侧
  isLeft: {
    type: Boolean,
    default: false,
  },

  // 左侧图标-自定义vant返回图标
  leftIcon: {
    type: String,
    default: "",
  },

  // 左侧图标-自定义插槽返回图标
  leftSlot: {
    type: Boolean,
    default: false,
  },

  // 图标颜色
  iconColor: {
    type: String,
    default: "#000000",
  },

  // 图标大小
  iconSize: {
    type: String,
    default: "0.6rem",
  },

  // 标题
  title: {
    type: String,
    default: "",
  },

  // 标题-自定义插槽标题
  titleSlot: {
    type: Boolean,
    default: false,
  },

  // 标题-自定义插槽tabs标题
  tabsSlot: {
    type: Boolean,
    default: false,
  },

  // 标题颜色
  titleColor: {
    type: String,
    default: "#000000",
  },

  // 右侧
  isRight: {
    type: Boolean,
    default: false,
  },

  // 右侧图标-自定义vant返回图标
  rightIcon: {
    type: String,
    default: "",
  },

  // 右侧图标-插槽图标
  rightSlot: {
    type: Boolean,
    default: false,
  },
});

const cssVars = computed(() => {
  return {
    "--bgColor": props.bgColor,
  };
});

const emit = defineEmits(["onLeft", "onRight"]);

const setAndroidAreaTop = () => {
  if (device == "android" && props.isPdTop) {
    const areaTopDom = document.querySelector(".van-safe-area-top");
    const pdt = window
      .getComputedStyle(areaTopDom, null)
      .getPropertyValue("padding-top");

    // 兼容不支持 van-safe-area
    if (pdt == "0px") {
      areaTopDom.style.paddingTop = "30px";
    }
  }
};

// 左侧点击事件
function onLeft() {
  emit("onLeft");
}

// 右侧点击事件
function onRight() {
  emit("onRight");
}

onMounted(() => {
  setAndroidAreaTop();
});
</script>

<template>
  <van-nav-bar
    :style="cssVars"
    :fixed="isFixed"
    :placeholder="isFixed"
    :border="isBorder"
    :z-index="zIndex"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <template #left v-if="isLeft">
      <!-- 自定义vant返回图标 -->
      <template v-if="leftIcon">
        <van-icon
          :name="leftIcon"
          :color="iconColor"
          :size="iconSize"
          @click="onLeft"
        />
      </template>

      <!-- 自定义插槽返回图标 -->
      <template v-else-if="leftSlot">
        <slot name="left_slot"></slot>
      </template>

      <!-- 默认返回图标 -->
      <template v-else>
        <van-icon
          name="arrow-left"
          :color="iconColor"
          :size="iconSize"
          @click="onLeft"
        />
      </template>
    </template>

    <template #title v-if="title || titleSlot || tabsSlot">
      <template v-if="titleSlot">
        <slot name="title_slot"></slot>
      </template>
      <template v-else-if="tabsSlot">
        <slot name="tabs_slot"></slot>
      </template>
      <template v-else>
        <span :style="{ color: titleColor }">{{ title }}</span>
      </template>
    </template>

    <template #right v-if="isRight">
      <!-- 自定义vant右侧图标 -->
      <template v-if="rightIcon">
        <van-icon
          :name="rightIcon"
          :color="iconColor"
          :size="iconSize"
          @click="onRight"
        />
      </template>

      <!-- 具名插槽图标 -->
      <template v-else-if="rightSlot">
        <slot name="right_slot"></slot>
      </template>

      <!-- 插槽图标 -->
      <template v-else>
        <slot></slot>
      </template>
    </template>
  </van-nav-bar>
</template>

<style lang="scss">
.van-nav-bar {
  width: 100%;
  background: var(--bgColor) !important;
  z-index: 999 !important;

  .van-nav-bar__left {
    .back {
      width: 22px;
      height: 22px;
    }
  }
  .van-nav-bar__title {
    font-family: Helvetica;
    font-size: 20px;
    color: #ffffff;
    font-style: normal;
  }
  .van-nav-bar__right {
    .icon {
      width: 22px;
      height: 22px;
    }
  }
}

.ara {
  .van-nav-bar__left {
    left: auto;
    right: 0;
    .back {
      transform: rotateZ(180deg);
    }
  }
  .van-nav-bar__right {
    left: 0;
    right: auto;
  }
}
.en {
  .van-nav-bar__left {
    left: 0;
    right: auto;
  }
  .van-nav-bar__right {
    left: auto;
    right: 0;
  }
}
</style>
