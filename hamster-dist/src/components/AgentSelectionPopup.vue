<template>
  <var-popup
    :show="visible"
    position="bottom"
    :overlay-style="{ background: 'rgba(0,0,0,0.8)' }"
    :close-on-click-overlay="true"
    transition="popup-fade"
    :style="{ background: 'transparent', padding: '0' }"
    @update:show="handleUpdateShow"
  >
    <div class="agent-selection-popup" :style="{ backgroundImage: `url(${bgImage})` }">
      <!-- 弹窗头部 -->
      <div class="popup-header">
          <div class="popup-close" @click="handleClose">
            <img :src="arrow_left" alt="close" />
          </div>
        <div class="popup-title">{{ t('Agency.SelectAgent') }}</div>
      </div>

      <!-- 代理列表 -->
      <div class="agent-list">
        <div
          v-for="agent in agentList"
          :key="agent.agentId"
          class="agent-item"
          :class="{ 'agent-item--selected': selectedAgentId === agent.agentId }"
          @click="handleSelectAgent(agent)"
        >
          <img
            class="agent-avatar"
            :src="agent.agentAvatar?.includes('http') ? agent.agentAvatar : 'https://file.hamsterdw.com/' + agent.agentAvatar"
            alt=""
          />
          <div class="agent-info">
            <div class="agent-name">{{ agent.agentName }}</div>
            <div class="agent-id">{{ t('Agency.UserId') }} {{ agent.agentId }}</div>
          </div>
          <img v-if="selectedAgentId === agent.agentId" class="agent-selected-icon" :src="choose_icon" alt="">
            <img v-else class="agent-selected-icon" :src="no_choose_icon" alt="">
        </div>
      </div>

      <!-- 确认按钮 -->
      <div class="popup-actions">
        <button class="confirm-btn" @click="handleConfirm" :disabled="!selectedAgentId">
          {{ t('Agency.Confirm') }}
        </button>
      </div>
    </div>
  </var-popup>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Popup as VarPopup } from '@varlet/ui'
import arrow_left from '@/assets/agency/arrow_left.png'
import no_choose_icon from '@/assets/agency/no_choose_icon.png'
import choose_icon from '@/assets/agency/choose_icon.png'
import { useI18n } from 'vue-i18n'
import { WITHDRAW_AGENCY_LIST } from '@/api/withdraw'


// Props 和 Emits
const props = defineProps({
  visible: Boolean,
  bgImage: {
    type: String,
  },
  selectedAgentId: [String, Number],
  uid: [String, Number],
  ticket: String
})

const emit = defineEmits(['update:visible', 'agent-selected'])

// 获取翻译函数
const { t } = useI18n()

// 代理列表
const agentList = ref([])
const loading = ref(false)

// 获取代理列表
const fetchAgentList = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await WITHDRAW_AGENCY_LIST({
      uid: props.uid
    })
    
    if (res && Array.isArray(res)) {
      // 将接口返回的数据转换为组件需要的格式
      agentList.value = res.map(item => ({
        agentId: item.erbanNo, // 使用 erbanNo 作为 agentId
        agentName: item.nick,  // 使用 nick 作为 agentName
        agentAvatar: item.avatar, // 使用 avatar 作为 agentAvatar
        uid: item.uid // 添加 uid 字段，用于提现接口调用
      }))
      console.log('转换后的代理列表:', agentList.value)
    } else {
      // 如果接口返回空数据，使用 mock 数据作为备选
    }
  } catch (error) {
    console.error('获取代理列表失败:', error)
    // 如果接口失败，使用 mock 数据作为备选
  } finally {
    loading.value = false
  }
}

// 处理弹窗显示状态更新
const handleUpdateShow = (show) => {
  emit('update:visible', show)
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 选择代理
const handleSelectAgent = (agent) => {
  emit('agent-selected', agent)
}

// 确认选择
const handleConfirm = () => {
  if (props.selectedAgentId) {
    emit('update:visible', false)
  }
}

// 监听弹窗显示状态
watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      // 弹窗打开时获取代理列表
      fetchAgentList()
    }
  }
)

// 组件挂载时获取代理列表
onMounted(() => {
  fetchAgentList()
})
</script>

<style lang="less" scoped>
.agent-selection-popup {
  width: 375px;
  background: #fff;
  border-radius: 16px 16px 0 0;
  margin: 0 auto;
  padding: 29px 22px 42px 22px;
  box-sizing: border-box;

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;

    .popup-title {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 18px;
      color: #000;
      line-height: 22px;
      text-align: center;
      flex: 1;
    }

    .popup-close {
      width: 11px;
      height: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 11px;
        height: 18px;
      }
    }
  }

  .agent-list {
    margin-bottom: 32px;
    max-height: 400px;
    overflow-y: auto;

    .agent-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background-color: rgba(130, 130, 130, 0.2);
      border-radius: 12px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;


      &.agent-item--selected {
       background: linear-gradient(to bottom, rgba(189, 119, 255, 0.37) , rgba(189, 119, 255, 0.14) );
      }

      .agent-avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 16px;
        object-fit: cover;
      }

      .agent-info {
        flex: 1;

        .agent-name {
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 13px;
          color: rgba(0, 0, 0, 1);
          line-height: 19px;
          margin-bottom: 4px;
        }

        .agent-id {
          font-family: Helvetica;
          font-size: 13px;
          color: rgba(161, 155, 149, 1);
          line-height: 17px;
        }
      }

      .agent-selected-icon {
        margin-left: 12px;
        width: 17px;
        height: 17px;
      }
    }
  }

  .popup-actions {
    .confirm-btn {
      width: 100%;
      height: 48px;
      background: #f7cf4a;
      border: none;
      border-radius: 24px;
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 16px;
      color: #443213;
      line-height: 19px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: #e6c23a;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #a19b94;
      }
    }
  }
}
</style>
