<template>
  <div class="order-page" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <!-- 顶部自定义导航栏，宽度375px，高度125px，背景图可配置 -->
    <div class="nav-bar" :style="{ backgroundImage: `url(${head_bg})` }">
      <!-- 返回按钮区域 -->
      <div class="nav-bar__back" @click="handleBack">
        <img
          :src="currentLang === 'ar' ? arrow_right : back"
          :alt="t('Reseller.Back')"
          class="nav-bar__back-icon"
        />
      </div>
      <!-- 标题区域 -->
      <div class="nav-bar__title">{{ $t('Reseller.OrderProcessingTitle') }}</div>
    </div>

    <!-- 订单筛选区域 -->
    <div class="order-navbar__month">
      <div class="time" @click="showDatePicker = true">
        <div>{{ selectedMonth }}</div>
        <img :src="arrow_down" :class="{ 'arrow-flip': showDatePicker }" alt="" />
      </div>
      <div class="process" @click="showStatusPopup = true">
        <span class="process-label">{{
          statusOptions.find(opt => opt.value === selectedStatus)?.label
        }}</span>
        <img
          class="process-arrow"
          :src="arrow_down"
          :class="{ 'arrow-flip': showStatusPopup }"
          alt=""
        />
      </div>
    </div>

    <!-- 时间选择弹窗（只能选择到年月） -->
    <Popup
      v-model:show="showDatePicker"
      position="bottom"
      :overlay="true"
      :close-on-click-overlay="true"
    >
      <div class="date-popup">
        <DatePicker
          v-model="dateValue"
          type="month"
          :min="minMonth"
          :max="maxMonth"
          :title="t('Reseller.SelectMonth')"
          class="date-picker-inner"
          :locale="'en-US'"
          :first-day-of-week="0"
        />
        <div class="date-popup-footer">
          <button class="date-popup-btn cancel" @click="showDatePicker = false">
            {{ t('Reseller.Cancel') }}
          </button>
          <button class="date-popup-btn confirm" @click="onMonthConfirmClick">
            {{ t('Reseller.Confirm') }}
          </button>
        </div>
      </div>
    </Popup>

    <!-- 状态下拉弹窗 -->
    <Popup
      v-model:show="showStatusPopup"
      position="bottom"
      :overlay="true"
      :close-on-click-overlay="true"
      :style="{ background: 'transparent' }"
    >
      <div class="status-popup">
        <div class="status-popup-content">
          <div
            v-for="option in statusOptions"
            :key="option.value"
            class="status-popup-option"
            @click="selectStatus(option.value)"
          >
            <span class="status-popup-label">{{ option.label }}</span>
            <img
              :src="selectedStatus === option.value ? choose_icon : no_choose_icon"
              class="status-popup-icon"
              :alt="
                selectedStatus === option.value ? t('Reseller.Selected') : t('Reseller.NotSelected')
              "
            />
          </div>
        </div>
        <div class="status-popup-cancel" @click="showStatusPopup = false">
          {{ t('Reseller.Cancel') }}
        </div>
      </div>
    </Popup>

    <!-- 订单列表区域 - 使用 Varlet List 组件 -->
    <List
      v-model:loading="loading"
      v-model:error="error"
      :finished="finished"
      :error-text="errorText"
      :loading-text="loadingText"
      :finished-text="''"
      @load="onLoad"
      class="order-list"
    >
      <div
        class="order-list-item"
        v-for="(item, index) in orderList"
        :key="item.id || index"
        :class="{ 'has-footer': item.status === '0' }"
        @click="goToDetail(item)"
      >
        <div class="order-title">
          <div class="order-amount">
            $ {{ item.amount || item.money || 0 }} {{ t('Reseller.USD') }}
          </div>
          <div class="order-status" :class="getStatusClass(item.status || '0')">
            {{ getStatusText(item.status || '0') }}
          </div>
        </div>
        <!-- 提现渠道 -->
        <div class="order-list-row">
          <span class="order-label">{{ t('Reseller.WithdrawalMethod') }}</span>
          <div class="order-value">
            <img
              v-if="item.channelIcon"
              :src="item.channelIcon"
              class="channel-icon"
              :alt="t('Reseller.ChannelIcon')"
            />
          </div>
        </div>
        <!-- 提现金额 -->
        <div class="order-list-row">
          <span class="order-label">{{ t('Reseller.WithdrawalAmount') }}</span>
          <div class="order-value">
            <img :src="diamond_icon" class="field-icon" :alt="t('Reseller.Diamond')" />
            <span>{{ formatNumber(item.withdrawAmount) }}</span>
          </div>
        </div>
        <!-- 预期收入 -->
        <div class="order-list-row">
          <span class="order-label">{{ t('Reseller.AnticipatedIncome') }}</span>
          <div class="order-value">
            <img :src="gold_icon" class="field-icon" :alt="t('Reseller.Gold')" />
            <span>{{ formatNumber(item.incomeGoldNum) }}</span>
          </div>
        </div>
        <!-- 时间 -->
        <div class="order-list-row">
          <span class="order-label">{{ t('Reseller.OrderTime') }}</span>
          <span class="order-value">{{ item.orderTime }}</span>
        </div>
        <!-- 分割线 -->
        <div class="order-divider" v-if="item.status === '0'"></div>
        <!-- 状态、图标、时间 -->
        <div class="order-list-footer">
          <template v-if="item.status === '0'">
            <div class="order-footer-action" @click="() => goWithdrawCenter(item)">
              <span>{{ t('Reseller.ViewInWithdrawCenter') }}</span>
              <img
                class="order-footer-arrow"
                src="@/assets/reseller/arrow_right.png"
                :alt="t('Reseller.Arrow')"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && !error && orderList.length === 0" class="empty-state">
        <img :src="emptyIcon" :alt="t('Reseller.NoData')" class="empty-icon" />
        <p class="empty-text">{{ t('Reseller.NoOrderData') }}</p>
      </div>
    </List>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showToast , List } from 'vant'
import head_bg from '@/assets/reseller/head_bg.png'
import back from '@/assets/reseller/back.png'
import arrow_right from '@/assets/reseller/arrow_right.png'
import arrow_down from '@/assets/reseller/arrow_down.png'
import no_choose_icon from '@/assets/reseller/no_choose_icon.png'
import choose_icon from '@/assets/reseller/choose_icon.png'
import time_icon from '@/assets/reseller/time_icon.png'
import emptyIcon from '@/assets/reseller/no_data.png'
import diamond_icon from '@/assets/reseller/diamond_icon.png'
import gold_icon from '@/assets/reseller/gold_icon.png'
import { Popup, DatePicker } from '@varlet/ui'
import { Locale } from '@varlet/ui'
import enUS from '@varlet/ui/es/locale/en-US'
import { AGENCY_GET_WITHDRAW_ORDER_LIST } from '@/api/reseller'

// 接收参数
const props = defineProps({
  uid: [String, Number],
  ticket: String,
  source: String,
  deviceId: String
})

// 初始化路由和国际化
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

// 语言相关
const currentLang = computed(() => locale.value)

// 设置 DatePicker 组件语言为英语
Locale.use('en-US', enUS)


// 状态选项 - 对应API文档中的状态值
const statusOptions = [
  { label: t('Reseller.Pending'), value: '0' },
  { label: t('Reseller.InProgress'), value: '1' },
  { label: t('Reseller.Completed'), value: '3' },
  { label: t('Reseller.Declined'), value: '2' },
]

// 当前选中状态
const selectedStatus = ref('0')

// 控制弹窗显示
const showStatusPopup = ref(false)

// 选择状态
const selectStatus = (value) => {
  selectedStatus.value = value
  showStatusPopup.value = false
  // 重置列表，loadOrders 会通过 watch 自动调用
  resetList()
}

// 返回按钮点击事件
const handleBack = () => {
  window.history.back()
}

// 订单列表数据
const orderList = ref([])
const loading = ref(false)
const error = ref(false)
const finished = ref(false)
const errorText = ref(t('Reseller.LoadFailed'))
const loadingText = ref(t('Reseller.Loading'))
const finishedText = ref(t('Reseller.NoMoreData'))

// 分页参数
const offset = ref(0)
const pageSize = 20

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: t('Reseller.Pending'),
    1: t('Reseller.InProgress'),
    2: t('Reseller.Declined'),
    3: t('Reseller.Completed'),
  }
  return statusMap[status] || t('Reseller.Unknown')
}

// 获取状态样式类
const getStatusClass = (status) => {
  const statusClassMap = {
    0: 'status-pending',
    1: 'status-processing',
    2: 'status-declined',
    3: 'status-completed',
  }
  return statusClassMap[status] || ''
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return t('Reseller.NotAvailable')
  try {
    const date = new Date(timeStr)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return timeStr
  }
}

// 格式化数字，添加千位分隔符
const formatNumber = (num) => {
  if (typeof num === 'string') {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  if (typeof num === 'number') {
    return num.toLocaleString()
  }
  return num
}

// 重置列表
const resetList = () => {
  orderList.value = []
  offset.value = 0
  finished.value = false
  error.value = false
}

// 加载订单数据 - 使用真实API
const loadOrders = async () => {
  try {
    // 从props获取uid
    const uid = props.uid
 
    
    if (!uid) {
      console.warn('No uid available for API call')
      finished.value = true
      return
    }

    const params = {
      uid,
      withdrawStatus: parseInt(selectedStatus.value),
      pageNum: Math.floor(offset.value / pageSize) + 1,
      pageSize,
      selectDay: `${selectedMonth.value}-01` // 时间字段，格式：YYYY-MM-DD，使用选中月份的第一天
    }

    const response = await AGENCY_GET_WITHDRAW_ORDER_LIST(params)
    console.log('提现申请列表接口返回:', response)
    
    if (response) {
      const data = response
      
      // 转换数据格式以适配现有UI
      const formattedOrders = data.map(order => ({
        id: order.orderId,
        amount: order.cashAmount || 0,
        money: order.cashAmount || 0,
        status: order.withdrawStatus?.toString() || '0',
        channelIcon: order.withdrawTypeIcon || '',
        withdrawAmount: order.diamondNum || 0,
        estimateIncome: order.cashAmount || 0, // 使用现金金额作为预期收入
        orderTime: new Date(order.orderTime).toLocaleString(),
        orderNumber: order.orderId,
        accountId: order.accountId || '',
        reciplentName: order.reciplentName || '',
        whatsAppNumber: order.whatsAppNumber || '',
        agentEaseMobUsername: order.agentEaseMobUsername || '',
        voucherImages: order.voucherImages || '',
        incomeGoldNum: order.incomeGoldNum || 0
      }))

      if (offset.value === 0) {
        orderList.value = formattedOrders
      } else {
        orderList.value.push(...formattedOrders)
      }

      // 判断是否还有更多数据
      if (formattedOrders.length < pageSize) {
        finished.value = true
      } else {
        offset.value += pageSize
      }
    } else {
      console.error('API返回错误:', response?.message)
      finished.value = true
    }
  } catch (err) {
    console.error('Failed to load orders:', err)
    finished.value = true
  } finally {
    loading.value = false
  }
}

// List 组件的加载事件
const onLoad = async () => {
  if (loading.value) return

  loading.value = true
  error.value = false

  try {
    await loadOrders()
  } finally {
    loading.value = false
  }
}

const goToDetail = (data) => {
  // 将订单数据存储到sessionStorage中
  sessionStorage.setItem('currentOrderData', JSON.stringify(data))
  
  router.push({
    path: '/reseller/detail',
    query: {
      uid: props.uid || route.query.uid,
      ticket: props.ticket || route.query.ticket,
      source: props.source || route.query.source,
      deviceId: props.deviceId || route.query.deviceId
    },
  })
}

const goWithdrawCenter = (data) => {
  // 将订单数据存储到sessionStorage中
  sessionStorage.setItem('currentOrderData', JSON.stringify(data))
  
  router.push({
    path: '/reseller/detail',
    query: {
      uid: props.uid || route.query.uid,
      ticket: props.ticket || route.query.ticket,
      source: props.source || route.query.source,
      deviceId: props.deviceId || route.query.deviceId
    },
  })
}

// 确认支付
const confirmPayment = async (order) => {
  try {
    // 这里可以调用相应的API来确认支付
    // 暂时显示成功提示
    showToast('Payment confirmed successfully')
    // 刷新列表
    resetList()
    loadOrders()
  } catch (error) {
    console.error('Failed to confirm payment:', error)
    showToast('Failed to confirm payment')
  }
}

// 复制Order ID
const copyOrderId = (orderId) => {
  if (navigator.clipboard && orderId) {
    navigator.clipboard.writeText(orderId.toString())
    showToast('Order ID copied')
  }
}

// 复制Account ID
const copyAccountId = (accountId) => {
  if (navigator.clipboard && accountId) {
    navigator.clipboard.writeText(accountId.toString())
    showToast('Account ID copied')
  }
}

// 复制WhatsApp number
const copyWhatsApp = (whatsapp) => {
  if (navigator.clipboard && whatsapp) {
    navigator.clipboard.writeText(whatsapp)
    showToast('WhatsApp number copied')
  }
}

// --------- 时间选择相关 ---------
const showDatePicker = ref(false)
const dateValue = ref(formatMonth(new Date()))
const minMonth = '2020-01'
const maxMonth = '2030-12'

// 当前选中年月字符串
const selectedMonth = ref(formatMonth(dateValue.value))

function formatMonth(date) {
  if (typeof date === 'string') {
    // already formatted
    return date
  }
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  return `${y}-${m < 10 ? '0' + m : m}`
}

// 点击确认按钮
const onMonthConfirmClick = () => {
  selectedMonth.value = formatMonth(dateValue.value)
  showDatePicker.value = false
  // 重置列表，loadOrders 会通过 watch 自动调用
  resetList()
}

// 监听状态变化
watch(selectedStatus, () => {
  resetList()
  loadOrders()
})

// 监听月份变化
watch(selectedMonth, () => {
  resetList()
  loadOrders()
})

// 监听语言变化，确保 DatePicker 使用英语
watch(() => showDatePicker.value, async (newVal) => {
  if (newVal) {
    // 当弹窗打开时，重新设置语言
    await nextTick()
    Locale.use('en-US', enUS)
  }
})

// 组件挂载时加载数据
onMounted(() => {
  // 确保 DatePicker 使用英语
  Locale.use('en-US', enUS)
  loadOrders()
})
</script>

<style>
:root {
  --date-picker-title-color: #443213;
  --date-picker-title-background: #dfdf92;
}

:deep(.var-date-picker .var-month-picker__button.var-button--primary) {
  background-color: #f7cf4a;
}
:deep(.var-date-picker .var-button--outline) {
  border: 1px solid #f7cf4a;
  color: #f7cf4a;
}
</style>

<style lang="less" scoped>
.arrow-flip {
  transform: rotate(180deg);
  transition: transform 0.2s;
}
.order-page {
  background: #F1F1F1;
  width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  font-family: Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;
  position: relative;

  // 阿拉伯语RTL支持
  &[dir='rtl'] {
    // 返回按钮位置调整
    .nav-bar__back {
      left: auto;
      right: 16px;
    }

    .order-navbar__month .time div {
      margin-right: 0;
      margin-left: 4px;
    }
    .order-navbar__month .process .process-label {
      margin-right: 0;
      margin-left: 20px;
    }
    .order-navbar__month .process .process-arrow {
      right: auto;
      left: 12px;
    }
    .order-list-item .order-title .order-amount {
      text-align: left;
    }
    .order-list-item .order-title .order-status {
      text-align: left;
    }
    .order-list-row .order-label {
      text-align: left;
    }
    .order-list-row .order-value {
      text-align: left;
      justify-content: flex-start;
    }
    .channel-icon {
      margin-right: 0;
      margin-left: 8px;
    }
    .field-icon {
      margin-right: 0;
      margin-left: 8px;
    }
    .order-footer-action {
      margin-left: 0;
      margin-right: 16px;
    }
    .order-footer-action span {
      margin-right: 0;
      margin-left: 4px;
    }
  }
}

/* 顶部自定义导航栏，复用index.vue样式 */
.nav-bar {
  width: 375px;
  height: 125px;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  padding-bottom: 0;
}
.nav-bar__back {
  position: absolute;
  top: 48px;
  left: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}
.nav-bar__back-icon {
  width: 24px;
  height: 24px;
}
.nav-bar__title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #222;
  position: absolute;
  left: 0;
  top: 56px;
  z-index: 1;
}

/* 订单筛选区域 */
.order-navbar__month {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 16px;
  box-sizing: border-box;
  .time {
    display: flex;
    align-items: center;
    border-radius: 18px;
    padding: 4px 12px 4px 12px;
    font-size: 14px;
    color: #222;
    min-width: 72px;
    min-height: 28px;
    cursor: pointer;
    div {
      font-size: 14px;
      color: #222;
      margin-right: 4px;
      white-space: nowrap;
    }
    img {
      width: 14px;
      height: 14px;
      display: block;
    }
  }
  .process {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 18px;
    padding: 4px 12px 4px 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    font-size: 14px;
    color: #222;
    min-width: 72px;
    min-height: 28px;
    cursor: pointer;
    position: relative;

    .process-label {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #222;
      white-space: nowrap;
      margin-right: 20px; // 预留箭头空间
    }
    .process-arrow {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 14px;
      height: 14px;
      display: block;
    }
  }
}

/* 日期选择弹窗美化 */
.date-popup {
  background: #f7f7e7;
  border-radius: 16px 16px 0 0;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .date-picker-inner {
    width: 100%;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  // 头部背景色和标题色使用变量
  :deep(.var-date-picker__header) {
    background: var(--date-picker-title-background) !important;
    color: var(--date-picker-title-color) !important;
    border-radius: 12px 12px 0 0;
    font-weight: 600;
  }

  // 普通项背景
  :deep(.var-date-picker__cell) {
    background: #fff !important;
    border-radius: 8px;
    color: #443213 !important;
    transition: background 0.2s;
  }

  // 选中项高亮
  :deep(.var-date-picker__cell--active) {
    background: #f7cf4a !important;
    color: #443213 !important;
    border-radius: 8px !important;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(247, 207, 74, 0.15);
  }

  // 禁用项样式
  :deep(.var-date-picker__cell--disabled) {
    color: #c8c8c8 !important;
    background: #f7f7e7 !important;
    opacity: 0.7;
  }

  .date-popup-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px 24px 24px;
    background: var(--date-picker-title-background);
    .date-popup-btn {
      flex: 1;
      height: 40px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .cancel {
      background: #fff;
      color: #a29b94;
      margin-right: 8px;
      border: 1px solid #eae5cf;
    }
    .confirm {
      background: #f7cf4a;
      color: #443213;
      margin-left: 8px;
      border: 1px solid #f7cf4a;
    }
  }
}

/* 状态下拉弹窗样式 */
.status-popup {
  margin: 16px 20px 8px;
  min-height: 220px;
  .status-popup-content {
    border-radius: 16px;
    background: #fff;
    .status-popup-option {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 15px;
      cursor: pointer;
      .status-popup-icon {
        width: 17px;
        height: 17px;
        margin-left: 8px;
      }
      .status-popup-label {
        font-size: 16px;
        color: #222;
        text-align: center;
        flex: 1;
      }
    }
    .status-popup-option:last-child {
      border-bottom: none;
    }
  }

  /* 独立的 Cancel 按钮样式 */
  .status-popup-cancel {
    margin-top: 15px;
    margin-bottom: 20px;
    padding: 12px 0;
    color: #a29b94;
    font-size: 16px;
    text-align: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    cursor: pointer;
    border: none;
  }
}

/* 订单列表区域 */
.order-list {
  width: 100%;
  margin: 24px 0 0 0;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.order-list-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-sizing: border-box;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
  }

  .order-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .order-amount {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 22px;
      color: #000000;
      line-height: 27px;
      text-align: right;
      font-style: normal;
    }

    .order-status {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      text-align: right;
      font-style: normal;

      &.status-pending {
        color: rgba(255, 201, 0, 1);
      }

      &.status-completed {
        color: rgba(123, 223, 61, 1);
      }

      &.status-declined {
        color: rgba(242, 107, 77, 1);
      }

      &.status-processing {
        color: #1890ff;
      }
    }
  }
}

.order-list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.order-label {
  font-family: Helvetica;
  font-size: 14px;
  color: #a29b94;
  line-height: 17px;
  text-align: right;
  font-style: normal;
  white-space: nowrap;
}

.order-value {
  font-family: Helvetica;
  font-size: 14px;
  color: #000000;
  line-height: 17px;
  text-align: right;
  font-style: normal;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .van-icon {
    margin-left: 8px;
    color: #a29b94;
    cursor: pointer;

    &:hover {
      color: #666;
    }
  }
}

.channel-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
  border-radius: 4px;
  object-fit: cover;
}

.field-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
  object-fit: contain;
}

.payment-receipt-img {
  width: 60px;
  height: 45px;
  border-radius: 6px;
  object-fit: cover;
}

.order-divider {
  width: 100%;
  height: 1px;
  background: #ebebeb;
  margin: 16px 0;
}

.order-list-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0;

  .order-footer-action {
    display: flex;
    align-items: center;
    margin-left: 16px;
    cursor: pointer;

    span {
      color: #443213;
      font-size: 14px;
      font-weight: 500;
      margin-right: 4px;
    }

    .order-footer-arrow {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
  }
}

.order-list-item.has-footer {
  padding-bottom: 16px;
}

.payment-received-btn {
  background-color: rgba(247, 207, 74, 1);
  color: #443213;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-family: Helvetica, Helvetica;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  font-style: normal;
  cursor: pointer;

  &:hover {
    background-color: rgba(240, 192, 64, 1);
  }
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .empty-text {
    font-size: 16px;
    color: #a29b94;
    margin: 0;
  }
}

/* Varlet List 组件样式调整 */
:deep(.var-list) {
  background: transparent;
}

:deep(.var-list__loading) {
  padding: 20px 0;
  text-align: center;
  color: #a29b94;
}

:deep(.var-list__finished) {
  padding: 20px 0;
  text-align: center;
  color: #a29b94;
}

:deep(.var-list__error) {
  padding: 20px 0;
  text-align: center;
  color: #ff4d4f;
}
</style>
