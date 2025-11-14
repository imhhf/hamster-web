<template>
  <div class="empty-view" :style="{ backgroundColor: backgroundColor }">
    <div class="empty-content">
      <!-- 空状态图片 -->
      <div class="empty-image">
        <img :src="imageSrc" :alt="title" class="empty-bg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import emptyBg from '@/assets/common/empty_bg.png'

const props = defineProps({
  // 背景色
  backgroundColor: {
    type: String,
    default: 'transparent'
  },
  // 自定义图片路径
  imageSrc: {
    type: String,
    default: emptyBg
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 描述文字
  description: {
    type: String,
    default: ''
  },
  // 是否显示按钮
  showButton: {
    type: Boolean,
    default: false
  },
  // 按钮文字
  buttonText: {
    type: String,
    default: 're try'
  },
  // 图片宽度
  imageWidth: {
    type: String,
    default: '120px'
  },
  // 图片高度
  imageHeight: {
    type: String,
    default: '120px'
  },
  // 内容对齐方式
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  }
})

const emit = defineEmits(['buttonClick'])

const handleButtonClick = () => {
  emit('buttonClick')
}

// 计算内容对齐样式
const contentAlign = computed(() => {
  const alignMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }
  return alignMap[props.align]
})
</script>

<style scoped lang="scss">
.empty-view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  transform: translateY(40px);
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: v-bind(contentAlign);
  text-align: v-bind(align);
  max-width: 400px;
}

.empty-bg {
  width: v-bind(imageWidth);
  height: v-bind(imageHeight);
  object-fit: contain;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .empty-view {
    padding: 16px;
  }

  .empty-content {
    max-width: 100%;
  }

  .empty-title {
    font-size: 15px;
  }

  .empty-description {
    font-size: 13px;
  }

  .btn-primary {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
