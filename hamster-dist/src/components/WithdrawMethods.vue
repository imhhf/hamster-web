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
    <div class="withdraw-methods-popup" :style="{ backgroundImage: `url(${bgImage})` }">
      <!-- 弹窗头部 -->
      <div class="popup-header">
        <div class="popup-title">{{ $t('Agency.WithdrawMethods') }}</div>
        <div class="popup-close" @click="handleClose">
          <img :src="arrowInvite" alt="close" />
        </div>
      </div>

      <!-- 表单内容 -->
      <div class="form-content">
        <!-- Withdrawal method -->
        <div class="form-item">
          <label class="form-label">{{ $t('Agency.WithdrawalMethod') }}</label>
          <div class="form-input-wrapper">
            <div class="custom-select" :class="{ open: isSelectOpen }">
              <!-- 显示区域 -->
              <div class="select-display" @click="toggleSelect">
                <div class="select-content">
                  <img 
                    v-if="getSelectedChannelIcon()" 
                    :src="getSelectedChannelIcon()" 
                    class="select-icon-img" 
                    alt="selected channel icon"
                  />
                  <span class="select-text">
                    {{ formData.method || $t('Agency.SelectWithdrawalMethod') }}
                  </span>
                </div>
                <div class="select-arrow" :class="{ rotated: isSelectOpen }">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>

              <!-- 选项列表 -->
              <div class="select-options" v-show="isSelectOpen">
                <div
                  v-for="channel in channelList"
                  :key="channel.id"
                  class="select-option"
                  @click="selectOption(channel.channelName || '')"
                >
                  <img 
                    v-if="channel.channelIcon" 
                    :src="channel.channelIcon" 
                    class="option-icon-img" 
                    alt="channel icon"
                  />
                  <span v-else class="option-icon">{{ '💳' }}</span>
                  <span class="option-text">{{ channel.channelName || $t('Agency.Unknown') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account ID -->
        <div class="form-item">
          <label class="form-label">{{ $t('Agency.AccountID') }}</label>
          <div class="form-input-wrapper">
            <input
              v-model="formData.accountId"
              type="text"
              :placeholder="$t('Agency.EnterAccountID')"
              class="form-input"
            />
          </div>
        </div>

        <!-- Reciplent's name -->
        <div class="form-item">
          <label class="form-label">{{ $t('Agency.RecipientName') }}</label>
          <div class="form-input-wrapper">
            <input
              v-model="formData.reciplentName"
              type="text"
              :placeholder="$t('Agency.EnterRecipientName')"
              class="form-input"
            />
          </div>
        </div>

        <!-- WhatsApp number -->
        <div class="form-item">
          <label class="form-label">{{ $t('Agency.WhatsAppNumber') }}</label>
          <div class="form-input-wrapper">
            <input
              v-model="formData.whatsappNumber"
              type="text"
              :placeholder="$t('Agency.EnterWhatsAppNumber')"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- 确认按钮 -->
      <div class="popup-actions">
        <button 
          class="confirm-btn" 
          @click="handleConfirm" 
          :disabled="!canConfirm || loading"
        >
          <div v-if="loading" class="btn-loading-content">
            <div class="loading-spinner"></div>
            <span>{{ $t('Agency.Saving') }}</span>
          </div>
          <span v-else>{{ $t('Agency.Confirm') }}</span>
        </button>
      </div>
    </div>
  </var-popup>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Popup as VarPopup } from '@varlet/ui'
import arrowInvite from '@/assets/agency/arrow_invite.png'
import { useI18n } from 'vue-i18n'

import { WITHDRAW_WITHDRAW_TYPES , WITHDRAW_ACCOUNT, WITHDRAW_ACCOUNT_SAVE } from '@/api/withdraw';

// Props 和 Emits
const props = defineProps({
  visible: Boolean,
  bgImage: {
    type: String,
  },
  selectedChannelId: [String, Number],
  uid: [String, Number],
  ticket: String
})




const emit = defineEmits(['update:visible', 'channel-selected'])

// 提现渠道列表
const channelList = ref([])
const loading = ref(false)

// 表单数据
const formData = ref({
  method: '',
  accountId: '',
  reciplentName: '',
  whatsappNumber: '',
  channelId: '',
  channelIcon: '',
})

// 保存上一次的数据用于回显
const lastFormData = ref({
  method: '',
  accountId: '',
  reciplentName: '',
  whatsappNumber: '',
  channelId: '',
  channelIcon: '',
})

// 保存表单数据
const saveFormData = () => {
  lastFormData.value = { ...formData.value }
}

// 恢复表单数据
const restoreFormData = () => {
  if (lastFormData.value.method) {
    formData.value = { ...lastFormData.value }
    // 确保图标信息也被恢复
    if (lastFormData.value.channelIcon) {
      formData.value.channelIcon = lastFormData.value.channelIcon
    }
  }
}

// 计算是否可以确认
const canConfirm = computed(() => {
  return (
    formData.value.method &&
    formData.value.accountId &&
    formData.value.reciplentName &&
    formData.value.whatsappNumber
  )
})

// 下拉框状态
const isSelectOpen = ref(false)

// 切换下拉框状态
const toggleSelect = () => {
  isSelectOpen.value = !isSelectOpen.value
}

// 选择选项
const selectOption = (optionText) => {
  // 找到对应的渠道信息
  const selectedChannel = channelList.value.find(channel => channel.channelName === optionText)

  if (selectedChannel) {
    formData.value.method = optionText
    // 将渠道ID也保存到表单数据中
    formData.value.channelId = selectedChannel.id
    // 保存图标信息
    formData.value.channelIcon = selectedChannel.channelIcon
  }

  isSelectOpen.value = false
}

// 关闭下拉框
const closeSelect = () => {
  isSelectOpen.value = false
}

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.custom-select')) {
    closeSelect()
  }
}

// 获取提现渠道列表
const fetchChannelList = async () => {
  try {
    const res = await WITHDRAW_WITHDRAW_TYPES({
      uid: props.uid
    })
    console.log('提现方式列表:', res);
    
    if (res) {
      // 将接口返回的数据转换为组件需要的格式
      channelList.value = res.map(item => ({
        id: item.withdrawType,
        channelName: item.withdrawTypeName,
        channelIcon: item.withdrawTypeIcon
      }))
      console.log('提现渠道列表:', channelList.value)
    }

    // 获取用户已保存的账户信息
    const account = await WITHDRAW_ACCOUNT({
      uid: props.uid
    })
    
    console.log('用户账户信息:', account);
    
    // 如果用户有已保存的账户信息，自动填充表单
    if (account) {
      formData.value = {
        method: account.withdrawTypeName,
        accountId: account.accountId,
        reciplentName: account.reciplentName,
        whatsappNumber: account.whatsAppNumber,
        channelId: account.withdrawType,
        channelIcon: account.withdrawTypeIcon,
      }
      
      // 保存到 lastFormData 用于回显
      lastFormData.value = { ...formData.value }
      
      console.log('自动填充表单数据:', formData.value)
    }

  } catch (error) {
    console.error('获取提现渠道失败:', error)
    
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

// 确认选择
const handleConfirm = async () => {
  if (canConfirm.value) {
    try {
      // 显示加载状态
      loading.value = true
      
      // 构建保存账户信息的请求参数
      const saveParams = {
        uid: props.uid,
        withdrawType: formData.value.channelId,
        accountId: formData.value.accountId,
        reciplentName: formData.value.reciplentName,
        whatsAppNumber: formData.value.whatsappNumber
      }
      
      console.log('保存账户信息参数:', saveParams)
      
      // 调用保存接口
      const result = await WITHDRAW_ACCOUNT_SAVE(saveParams)
      console.log('保存账户信息结果:', result)
      
      // 保存当前数据到本地
      saveFormData()
      
      // 发送选择事件给父组件
      emit('channel-selected', { ...formData.value })
      
      // 关闭弹窗
      emit('update:visible', false)
      
    } catch (error) {
      console.error('保存账户信息失败:', error)
      // 这里可以添加错误提示
    } finally {
      loading.value = false
    }
  }
}

// 重置表单
const resetForm = () => {
  // 不要清空 lastFormData，保留用于回显
  formData.value = {
    method: '',
    accountId: '',
    reciplentName: '',
    whatsappNumber: '',
    channelId: '',
    channelIcon: '',
  }
}

// 获取选中渠道的图标
const getSelectedChannelIcon = () => {
  if (!formData.value.method) return '' // 默认图标


  // 如果没有保存的图标信息，则从渠道列表中查找
  const selectedChannel = channelList.value.find(
    channel => channel.channelName === formData.value.method
  )
  return selectedChannel?.channelIcon
}

// 监听弹窗显示状态
watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      // 弹窗打开时获取渠道列表
      fetchChannelList()
      // 恢复之前的数据
      restoreFormData()
    } else {
      // 弹窗关闭时重置表单（但保留 lastFormData）
      resetForm()
    }
  }
)

// 组件挂载时获取渠道列表
onMounted(() => {
  fetchChannelList()
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="less" scoped>
.withdraw-methods-popup {
  width: 375px;
  background: #fff;
  margin: 0 auto;
  padding: 29px 22px 42px 22px;
  box-sizing: border-box;
  border-radius: 16px 16px 0 0;

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
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 18px;
        height: 11px;
      }
    }
  }

  .form-content {
    margin-bottom: 32px;

    .form-item {
      margin-bottom: 24px;

      .form-label {
        display: block;
        font-family: Helvetica;
        font-size: 14px;
        color: #000;
        line-height: 17px;
        margin-bottom: 8px;
        font-weight: bold;
      }

      .form-input-wrapper {
        .form-input,
        .form-select {
          width: 100%;
          background-color: rgba(130, 130, 130, 0.2);
          border: none;
          border-radius: 12px;
          padding: 16px;
          font-family: Helvetica;
          font-size: 14px;
          color: #000;
          line-height: 17px;
          box-sizing: border-box;

          &::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }

        }

        .custom-select {
          position: relative;
          width: 100%;
          background-color: rgba(130, 130, 130, 0.2);
          border-radius: 12px;
          padding: 16px;
          font-family: Helvetica;
          font-size: 14px;
          color: #000;
          line-height: 17px;
          box-sizing: border-box;
          cursor: pointer;
          transition: border-color 0.2s ease;

          &.open {
            border-color: #f7cf4a;
          }

          .select-display {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 20px; // Adjust for arrow
          }

          .select-content {
            display: flex;
            align-items: center;
            flex: 1;
          }
          .select-icon-img {
            height: 20px;
          }
          

          .select-text {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 10px;
          }

          .select-arrow {
            transition: transform 0.3s ease;
            transform: rotate(0deg);

            &.rotated {
              transform: rotate(180deg);
            }
          }

          .select-options {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: rgba(216, 216, 216, 1);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10;
            max-height: 200px;
            overflow-y: auto;
            margin-top: 4px;

            .select-option {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              cursor: pointer;
              transition: background-color 0.2s ease;

              &:hover {
                background-color: rgba(178, 144, 64, 0.3);
              }

              &:first-child {
                border-radius: 12px 12px 0 0;
              }

              &:last-child {
                border-radius: 0 0 12px 12px;
              }

              .option-icon {
                margin-right: 12px;
                font-size: 18px;
              }

              .option-icon-img {
                width: 20px;
                height: 20px;
                margin-right: 12px;
              }

              .option-text {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }

  .popup-actions {
    .confirm-btn {
      width: 100%;
      height: 48px;
      background: linear-gradient(to bottom, rgba(186, 54, 255, 1) , rgba(90, 0, 255, 1) );
      border: none;
      border-radius: 24px;
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 16px;
      color: #fff;
      line-height: 19px;
      cursor: pointer;
      transition: all 0.2s ease;


      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: rgba(216, 216, 216, 1);
        color: rgba(162, 162, 162, 1);
      }

      .btn-loading-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 移动端优化
@media (max-width: 768px) {
  .custom-select {
    font-size: 16px; // 防止iOS缩放
  }
}
</style>
