<template>
  <div class="order-page">
    <!-- Top Navigation Bar -->
    <div
      class="order-header"
      :style="{ backgroundImage: `url(${head_bg})` }"
      
    >
      <div class="order-navbar">
        <Icon
          name="chevron-left"
          size="28px"
          color="#000"
          :style="{ transform: locale === 'ar' ? 'scaleX(-1)' : 'scaleX(1)' }"
          @click="goBack"
          class="back-icon"
        />
        <span class="order-navbar__title">{{ t('Agency.OrderDetail') }}</span>
      </div>
    </div>

    <!-- Tab Switch -->
    <div class="order-tabs">
      <div class="order-tabs__list">
        <span
          v-for="tab in tabs"
          :key="tab.value"
          :class="['order-tabs__item', { active: activeTab === tab.value }]"
          @click="changeTab(tab.value)"
        >
          {{ tab.label }}
        </span>
      </div>
    </div>

    <!-- Order List with Vant List Component -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      :loading-text="t('Agency.LoadingOrders')"
      :finished-text="t('Agency.NoMoreOrders')"
      @load="onLoad"
      class="order-list"
    >
      <div v-for="order in orderList" :key="order.id" class="order-item">
        <div class="order-item__header">
          <span class="order-item__amount">$ {{ order.cashAmount }} USD</span>
          <span :class="['order-item__status', getStatusClass(order.withdrawStatus)]">
            {{ getStatusText(order.withdrawStatus) }}
          </span>
        </div>

        <div class="order-item__content">
          <div class="order-item__row">
            <span class="order-item__label">{{ t('Agency.WithdrawalMethod') }}</span>
            <div class="order-item__value">
              <var-image
                v-if="order.withdrawTypeIcon"
                :src="order.withdrawTypeIcon"
                class="channel-icon"
                alt="Channel Icon"
                fit="cover"
                lazy
                @click="previewImage(order.withdrawTypeIcon)"
              />
              <!-- <span>{{ order.method || '' }}</span> -->
            </div>
          </div>

          <div class="order-item__row">
            <span class="order-item__label">{{ t('Agency.OrderID') }}</span>
            <div class="order-item__value">
              <span>{{ order.orderId }}</span>
              <var-image
                class="copy-icon"
                :src="copyIcon"
                fit="contain"
                @click.stop="copyOrderId(order.orderId)"
                alt="Copy"
              />
            </div>
          </div>

          <div class="order-item__row">
            <span class="order-item__label">{{ t('Agency.OrderTime') }}</span>
            <span class="order-item__value">{{ formatTime(order.orderTime) }}</span>
          </div>

          <div class="order-item__row">
            <span class="order-item__label">{{ t('Agency.AccountID') }}</span>
            <div class="order-item__value">
              <span>{{ order.accountId || '' }}</span>
              <var-image
                class="copy-icon"
                :src="copyIcon"
                fit="contain"
                @click.stop="copyAccountId(order.accountId)"
                alt="Copy"
              />
            </div>
          </div>

          <div class="order-item__row">
            <span class="order-item__label">{{ t('Agency.RecipientName') }}</span>
            <span class="order-item__value">{{ order.reciplentName || '' }}</span>
          </div>

          <div class="order-item__row">
            <span class="order-item__label">{{ t('Agency.WhatsAppNumber') }}</span>
            <div class="order-item__value">
              <span>{{ order.whatsAppNumber || '' }}</span>
              <var-image
                class="copy-icon"
                :src="copyIcon"
                fit="contain"
                @click.stop="copyWhatsApp(order.whatsAppNumber)"
                alt="Copy"
              />
            </div>
          </div>

          <div class="order-item__row" v-if="order.paymentReceipt">
            <span class="order-item__label">{{ t('Agency.PaymentReceipt') }}</span>
            <div class="order-item__value">
              <var-image
                :src="order.paymentReceipt"
                class="payment-receipt-img"
                alt="Payment Receipt"
                fit="cover"
                lazy
                @click="previewImage(order.paymentReceipt)"
              />
            </div>
          </div>

          <div class="order-item__row agent-row" v-if="order.agentErbanNo">
            <div class="order-item__value">
              <var-image
                :src="order.agentAvatar"
                class="order-item__agent-avatar"
                fit="cover"
                lazy
                radius="50%"
                @click="previewImage(order.agentAvatar)"
              />
              <div class="agent-info">
                <span class="order-item__agent-name">{{ order.agentNick }}</span>
                <span class="order-item__agent-id">{{ order.agentErbanNo }}</span>
              </div>
            </div>
            <!-- <button class="order-item__contact-btn" @click.stop="contactAgent(order)">
              {{ t('Agency.Contact') }}
            </button> -->
          </div>
        </div>

        <template v-if="order.voucherImages">
          <div class="upload-receipt">{{ t('Agency.PaymentReceipt') }}</div>
          <div class="order-item__value">
            <div class="payment-voucher-display">
              <img :src="order.voucherImages"  style="width: 110px; height: 110px"  class="payment-voucher-img"
              fit="cover" alt="">
            </div>
            <!-- <div class="upload-time">
              {{ t('Agency.UploadedOn') }} {{ order.uploadPaymentVoucherTime }}
            </div> -->
          </div>
        </template>

        <div class="order-item__footer" v-if="order.withdrawStatus === 1">
          <button
            v-if="order.withdrawStatus === 1"
            class="order-item__payment-received-btn"
            @click.stop="confirmPayment(order)"
          >
            {{ t('Agency.PaymentReceived') }}
          </button>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { showToast } from 'vant'
import { Snackbar , Icon } from '@varlet/ui'
import head_bg from '@/assets/reseller/head_bg.png'
import copyIcon from '@/assets/reseller/copy_icon.png'
import { useRouter } from 'vue-router'
import { Image as VarImage, ImagePreview } from '@varlet/ui'
import { useI18n } from 'vue-i18n'
import { WITHDRAW_GET_ORDER, WITHDRAW_ORDER_COMPLETE } from '@/api/withdraw'
import { copyTarget } from '@/utils/index'
import { AppOpenChat } from '@/utils/client'

const { locale, t } = useI18n()

// 接收参数
const props = defineProps({
  uid: [String, Number],
  ticket: String,
  source: String,
  deviceId: String
})

// Tab data
const tabs = [
  { label: t('Agency.Pending'), value: 0 },
  { label: t('Agency.InProgress'), value: 1 },
  { label: t('Agency.Declined'), value: 2 },
  { label: t('Agency.Completed'), value: 3 },
]

const router = useRouter()

function goBack() {
  router.back()
}

// Current active tab
const activeTab = ref(0)

// List data
const orderList = ref([])
const loading = ref(false)
const finished = ref(false)
const offset = ref(0)
const pageSize = 20

// Tab switch
function changeTab(tab) {
  activeTab.value = tab
  resetList()
  loadOrders()
}

// Reset list when tab changes
function resetList() {
  orderList.value = []
  offset.value = 0
  finished.value = false
}

// Load orders - 使用真实 API
async function loadOrders() {
  try {
    loading.value = true
    
    // 调用提现订单接口
    const response = await WITHDRAW_GET_ORDER({
      uid: props.uid,
      ticket: props.ticket,
      withdrawStatus: activeTab.value
    })
    
    console.log('提现订单接口返回:', response)
    
    if (response) {
      
      if (offset.value === 0) {
        orderList.value = response
      } else {
        orderList.value = [...orderList, ...response]
      }
      
      // 由于接口只返回单个订单，设置 finished 为 true
      finished.value = true
      offset.value += 1
      
    } else {
      // 如果没有数据，清空列表
      if (offset.value === 0) {
        orderList.value = []
      }
      finished.value = true
    }
    
  } catch (error) {
    console.error('Failed to load orders:', error)
    Snackbar.error(t('Agency.FailedToLoadOrders'))
    finished.value = true
  } finally {
    loading.value = false
  }
}

// Load more orders (for van-list)
function onLoad() {
  loadOrders()
}

// Get status class
function getStatusClass(status) {
  const statusMap = {
    0: 'pending',
    1: 'progress',
    2: 'declined',
    3: 'completed',
  }
  return statusMap[status] || 'pending'
}

// Get status text
function getStatusText(status) {
  console.log(status,'getStatusText');
  
  const statusMap = {
    0: t('Agency.Pending'),
    1: t('Agency.InProgress'),
    2: t('Agency.Declined'),
    3: t('Agency.Completed'),
  }
  return statusMap[status] || t('Agency.Pending')
}

// Format time
function formatTime(timeStr) {
  if (!timeStr) return 'N/A'
  try {
    const date = new Date(timeStr)
    return date.toLocaleString()
  } catch (error) {
    return timeStr
  }
}

// 通用复制方法
async function copyToClipboard(text, successMessage) {
  if (!text) {
    console.warn('Copy text is empty')
    return false
  }

  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text.toString())
      showToast(successMessage)
      return true
    } else {
      // 降级使用传统方法
      copyTarget(text.toString(), () => {
        showToast(successMessage)
      })
      return true
    }
  } catch (error) {
    console.error('Copy failed:', error)
    
    // 如果现代API失败，尝试传统方法
    try {
      copyTarget(text.toString(), () => {
        showToast(successMessage)
      })
      return true
    } catch (fallbackError) {
      console.error('Fallback copy also failed:', fallbackError)
      Snackbar.error(t('Agency.CopyFailed'))
      return false
    }
  }
}

// Copy order ID
async function copyOrderId(orderId) {
  await copyToClipboard(orderId, t('Agency.OrderIDCopied'))
}

// Copy Account ID
async function copyAccountId(accountId) {
  await copyToClipboard(accountId, t('Agency.AccountIDCopied'))
}

// Copy WhatsApp number
async function copyWhatsApp(whatsapp) {
  await copyToClipboard(whatsapp, t('Agency.WhatsAppNumberCopied'))
}

// Contact agent
function contactAgent(order) {
  // 使用真实的代理信息发起私聊
  AppOpenChat(order.agentUid)
}

// Confirm payment
async function confirmPayment(order) {
  try {
    console.log('开始确认支付，订单信息:', order)
    
    // 调用完成订单API
    const response = await WITHDRAW_ORDER_COMPLETE({
      uid: props.uid,
      orderId: order.orderId
    })
    
    console.log('完成订单API返回:', response)
    
    showToast(t('Agency.PaymentConfirmedSuccessfully'))
    
    // 刷新订单列表
    resetList()
    await loadOrders()
    
    console.log('确认支付成功，列表已刷新:', order.orderId)
 
    
  } catch (error) {
    console.error('Failed to confirm payment:', error)
    Snackbar.error(t('Agency.FailedToConfirmPayment'))
  }
}

// 预览图片
function previewImage(url) {
  try {
    // 尝试使用Varlet ImagePreview
    ImagePreview([url])
  } catch (error) {
    // 如果Varlet预览失败，使用原生方法
    console.log('Varlet preview failed, using fallback method')
    const newWindow = window.open(url, '_blank')
    if (!newWindow) {
      // 如果弹窗被阻止，创建一个临时链接
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.click()
    }
  }
}

// Load orders on mount
onMounted(() => {
  loadOrders()
})

// Watch for tab changes
watch(activeTab, () => {
  resetList()
})
</script>

<style lang="less" scoped>
// Design draft 750 to 375, all px divided by 2
@base-width: 375px;
@base-height: 812px;

.order-page {
  background: rgba(241, 241, 241, 1);
  width: @base-width;
  min-height: @base-height;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.order-header {
  padding-top: 43.5px; // 87/2
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  .order-navbar {
    display: flex;
    align-items: center;
    width: @base-width;
    padding: 12.5px 163px 10px 9.5px; // 25/2 326/2 20/2 19/2
    position: relative;
    box-sizing: border-box;

    // RTL支持
    [dir='rtl'] & {
      padding: 12.5px 9.5px 10px 163px;
    }

    .order-navbar__icon {
      width: 17px;
      height: 17px;
      margin: 1.5px 0 3px 0;
    }

    // 为返回按钮图标添加样式
    .back-icon {
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 4px;
      border-radius: 4px;
      color: #000;
    }

    .order-navbar__title {
      color: #000;
      font-size: 18px;
      font-weight: 700;
      line-height: 21.5px;
      white-space: nowrap;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin-left: 0;
    }
  }
}

// Tab styles
.order-tabs {
  padding: 20px 10px 20.5px 10px; // 40/2 20/2 41/2 20/2

  .order-tabs__list {
    display: flex;
    flex-direction: row;
    position: relative;
    justify-content: space-between;
    .order-tabs__item {
      color: rgba(161, 155, 149, 1);
      font-size: 16px;
      line-height: 19px;
      margin-right: 22.5px; // 45/2
      cursor: pointer;
      white-space: nowrap;

      &.active {
        color: #000;
        font-weight: bold;
        position: relative;

        &::after {
          content: '';
          display: block;
          width: 30px; // 71/2
          height: 3px; // 22/2
          background: #000;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -5px;
        }
      }
    }
  }
}

// Order list styles
.order-list {
  flex: 1;
  padding: 0 10px;
}

.order-item {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 16px 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  .order-item__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .order-item__amount {
      color: #000;
      font-size: 22px;
      font-weight: bold;
    }

    .order-item__status {
      font-size: 14px;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 12px;

      &.pending {
        color: #ffc900;
        background-color: rgba(255, 201, 0, 0.1);
      }

      &.completed {
        color: #52c41a;
        background-color: rgba(82, 196, 26, 0.1);
      }

      &.declined {
        color: #ff4d4f;
        background-color: rgba(255, 77, 79, 0.1);
      }

      &.progress {
        color: #1890ff;
        background-color: rgba(24, 144, 255, 0.1);
      }
    }
  }

  .order-item__content {
    .order-item__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .order-item__label {
        color: rgba(162, 155, 148, 1);
        font-size: 14px;
      }

      .order-item__value {
        display: flex;
        align-items: center;
        color: #000;
        font-weight: bold;
        font-size: 14px;

        .channel-icon {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          object-fit: cover;
          vertical-align: middle;
        }

        .copy-icon {
          width: 16px;
          height: 16px;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }
        span {
          color: #000;
          font-weight: bold;
          margin: 0 4px;
          
        }
      }

      &.agent-row {
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        .order-item__value {
          flex: 1;
          justify-content: flex-start;
          align-items: center;
          color: #000;
          font-weight: bold;
        }
      }
    }
  }

  .order-item__agent-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
  }

  .agent-info {
    display: flex;
    flex-direction: column;

    .order-item__agent-name {
      color: #000;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .order-item__agent-id {
      color: #a29b94;
      font-size: 12px;
      line-height: 1.2;
      opacity: 0.8;
    }
  }

  .order-item__contact-btn {
    background-color: rgba(216, 216, 216, 1);
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 9px 17px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    white-space: nowrap;
  }
  .order-item__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .order-item__agent-info {
      display: flex;
      align-items: center;

      .order-item__agent-name {
        color: #a29b94;
        font-size: 12px;
      }
    }

    .order-item__action-btn {
      background-color: #f7cf4a;
      color: #443213;
      border: none;
      border-radius: 22px;
      padding: 14px 12px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      margin-bottom: 10px;
      width: 100%;
    }

    .order-item__payment-received-btn {
      background: linear-gradient(to bottom, rgba(186, 54, 255, 1), rgba(90, 0, 255, 1));
      color: #fff;
      border: none;
      border-radius: 22px;
      padding: 14px 12px;
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
      font-style: normal;
      cursor: pointer;
      margin-bottom: 10px;
      width: 100%;
    }

    .payment-receipt-img {
      width: 60px;
      height: 45px;
      border-radius: 6px;
      object-fit: cover;
    }

    .payment-voucher-display {
      width: 110px;
      height: 110px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 8px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }
    }

    .payment-voucher-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    // 为Payment Voucher创建特殊的行布局
    .order-item__row:has(.payment-voucher-display) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .order-item__label {
        margin-bottom: 0;
      }

      .order-item__value {
        justify-content: flex-start;
        width: 100%;
      }
    }
  }
}

.upload-receipt {
  font-family: Helvetica;
  font-size: 14px;
  color: #a29b94;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  padding: 10px 0;
}
.upload-time {
  padding: 10px 0;
  font-family: Helvetica;
  font-size: 14px;
  color: #a29b94;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}

// Empty state
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}
</style>
