<template>
  <div class="reseller-page" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <!-- 顶部自定义导航栏 -->
    <div class="nav-bar" :style="{ backgroundImage: `url(${head_bg})` }">
      <div class="nav-bar__back" @click="handleBack">
        <img :src="currentLang === 'ar' ? arrow_right : back" class="nav-bar__back-icon" />
      </div>
      <div class="nav-bar__title">{{ $t('Reseller.Agent') }}</div>
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-card">
      <img
        class="user-avatar"
        referrerpolicy="no-referrer"
        v-if="agentInfo.agentAvatar"
        :src="agentInfo.agentAvatar"
      />
      <div class="user-info">
        <span class="user-name">{{
          agentInfo.agentName  || $t('Reseller.Username')
        }}</span>
        <span class="user-id"
          >{{ $t('Reseller.UserId') }}:{{ agentInfo.erbanNo  }}</span
        >
      </div>
      <button class="action-btn" @click="handleOrderClick">
        <span>{{ $t('Reseller.OrderProcessing') }}</span>
      </button>
    </div>

    <!-- 订单与转账操作区 -->
    <div class="action-panel">
      <div class="action-item">
        <img class="action-icon" referrerpolicy="no-referrer" :src="gold_icon" />
        <span class="action-count">{{ formatNumber(agentInfo.agentBalance) }}</span>
        <button class="action-btn" @click="handleTransferClick">
          <span>{{ $t('Reseller.TransferCoin') }}</span>
        </button>
      </div>
    </div>

    <!-- 币商转账币商入口 -->
    <!-- <div
      class="transfer-to-reseller-section"
      @click="handleResellerTransferClick"
      v-if="agentInfo.transferAgentStatus === 'YES'"
    >
      <div class="transfer-to-reseller-item">
        <span class="transfer-to-reseller-text">{{ $t('Reseller.TransferToReseller') }}</span>
        <img
          class="transfer-to-reseller-arrow"
          referrerpolicy="no-referrer"
          :src="currentLang === 'ar' ? arrow_left : arrow_right"
        />
      </div>
    </div> -->

    <!-- 转账弹窗组件 -->
    <TransferPopup
      v-model:visible="showTransferPopup"
      :agent-balance="agentInfo.agentBalance ?? 0"
      :max-transfer-amount="999999"
      :agent-id="agentInfo.agentId"
      :uid="props.uid"
      @transfer-success="handleTransferSuccess"
      @transfer-failed="handleTransferFailed"
    />

    <!-- 币商转账币商弹窗组件 -->
    <TransferPopup
      v-model:visible="showResellerTransferPopup"
      :agent-balance="agentInfo.agentBalance ?? 0"
      :max-transfer-amount="999999"
      :agent-id="agentInfo.agentId"
      :uid="props.uid"
      :is-reseller-transfer="true"
      @transfer-success="handleResellerTransferSuccess"
      @transfer-failed="handleResellerTransferFailed"
    />

    <!-- 转账统计区 -->
    <div class="transfer-summary">
      <div class="summary-row">
        <div class="summary-item">
          <div class="summary-gold">
            <img class="summary-icon" referrerpolicy="no-referrer" :src="gold_icon" />
            <span class="summary-value">{{ formatNumber(agentInfo.transferToday) }}</span>
          </div>
          <span class="summary-label">{{ $t('Reseller.TransferToday') }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <div class="summary-gold">
            <img class="summary-icon" referrerpolicy="no-referrer" :src="gold_icon" />
            <span class="summary-value">{{ formatNumber(agentInfo.transferThisWeek) }}</span>
          </div>
          <span class="summary-label">{{ $t('Reseller.TransferThisWeek') }}</span>
        </div>
      </div>
      <div class="summary-row">
        <div class="summary-item">
          <div class="summary-gold">
            <img class="summary-icon" referrerpolicy="no-referrer" :src="gold_icon" />
            <span class="summary-value">{{ formatNumber(agentInfo.transferThisMonth) }}</span>
          </div>
          <span class="summary-label">{{ $t('Reseller.TransferThisMonth') }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <div class="summary-gold">
            <img class="summary-icon" referrerpolicy="no-referrer" :src="gold_icon" />
            <span class="summary-value">{{ formatNumber(agentInfo.transferLastMonth) }}</span>
          </div>
          <span class="summary-label">{{ $t('Reseller.TransferLastMonth') }}</span>
        </div>
      </div>
    </div>


    <div class="record">
      <!-- 转账记录区 -->
      <div class="record-header">
        <div class="record-title">
          <img class="record-icon" :src="record_icon" alt="">
          <span>{{ $t('Reseller.Record') }}</span>
        </div>
      </div>
  
      <!-- 使用 varlet List 组件实现下拉加载 -->
      <var-list
        class="transfer-record-list"
        :finished="!hasNext"
        :loading="loading"
        :finished-text="recordList.length ? t('Reseller.NoMoreRecords') : ''"
        @load="loadMore"
      >
        <template v-if="recordList.length">
          <div
            v-for="item in recordList"
            :key="item.id"
            class="transfer-record-item flex-row justify-between"
          >
            <div class="transfer-record-info flex-col">
              <span class="transfer-record-type">{{
                item.descContent || $t('Reseller.TransferCoins')
              }}</span>
              <span class="transfer-record-date">{{ item.createTime?.slice(0, 10) }}</span>
            </div>
            <div class="transfer-record-amount-group flex-row align-center">
              <img class="transfer-record-icon" referrerpolicy="no-referrer" :src="gold_icon" />
              <span class="transfer-record-amount">{{ formatNumber(item.amount) }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <EmptyView />
        </template>
      </var-list>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import head_bg from '@/assets/reseller/head_bg.png'
import back from '@/assets/reseller/back.png'
import arrow_right from '@/assets/reseller/arrow_right.png'
import arrow_left from '@/assets/agency/arrow_left.png'
import gold_icon from '@/assets/reseller/gold_icon.png'
import record_icon from '@/assets/reseller/record_icon.png'
import { List as VarList, Dialog } from '@varlet/ui'
import TransferPopup from '@/components/TransferPopup.vue'
import EmptyView from '@/components/emptyview.vue'
import { AppClose } from "@/utils/client";
import { AGENCY_USER_PURSE, GET_AGENT_BILL } from '@/api/reseller'

// 接收参数
const props = defineProps({
  uid: [String, Number],
  ticket: String,
  source: String,
  deviceId: String
})


const router = useRouter()
const { t, locale } = useI18n()

// 语言相关
const currentLang = computed(() => locale.value)

// 千分位格式化函数
const formatNumber = (num) => {
  if (num === undefined || num === null || num === '') return '0'
  const numStr = String(num)
  if (numStr === '0') return '0'

  // 处理小数
  const parts = numStr.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1] || ''

  // 为整数部分添加千分位逗号
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // 如果有小数部分，拼接回去
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

// Mock数据 - 用户信息
const agentInfo = ref({
  agentAvatar: '',
  agentName: '',
  erbanNo: null,
  agentBalance: null,
  transferToday: null,
  transferThisWeek: null,
  transferThisMonth: null,
  transferLastMonth: null,
  transferAgentStatus: 'YES'
})



// 获取用户信息 - 使用真实API
const fetchAgentInfo = async () => {
  try {
    const uid =  props.uid
    if (!uid) {
      console.warn('No uid available for API call')
      return
    }

    const response = await AGENCY_USER_PURSE({ uid })
    console.log('代理主页接口返回:', response)
    
    if (response) {
      const data = response
      agentInfo.value = {
        agentAvatar: data.avatar,
        agentName: data.nick,
        erbanNo: data.erbanNo ,
        agentBalance: data.purseGoldNum,
        transferToday: data.transferTodayNum,
        transferThisWeek: data.transferThisWeekNum ,
        transferThisMonth: data.transferThisMonthNum ,
        transferLastMonth: data.transferLastMonthNum ,
        transferAgentStatus: 'YES' // 根据实际业务逻辑设置
      }
    } else {
      console.error('API返回错误:', response?.message)
      
    }
  } catch (e) {
    console.error('Failed to fetch agent info:', e)
    // 如果出错，至少显示登录信息
   
  }
}

// 转账记录
const recordList = ref([])
const offset = ref(0)
const hasNext = ref(true)
const loading = ref(false)

// 转账弹窗相关状态管理
const showTransferPopup = ref(false)
const showResellerTransferPopup = ref(false)
// 提现方式弹窗相关状态管理
const showWithdrawMethods = ref(false)

// 获取转账记录（分页）- 使用真实API
const fetchRecordList = async () => {
  if (loading.value || !hasNext.value) return
  loading.value = true
  try {
    const uid = props.uid
    if (!uid) {
      console.warn('No uid available for API call')
      hasNext.value = false
      return
    }

    const params = {
      uid,
      pageSize: 20
    }
    
    // 如果有lastTime，添加分页参数
    if (recordList.value.length > 0) {
      const lastRecord = recordList.value[recordList.value.length - 1]
      if (lastRecord.billTime) {
        params.lastTime = lastRecord.billTime
      }
    }

    const response = await GET_AGENT_BILL(params)
    console.log('代充记录接口返回:', response)
    
    if (response) {
      const data = response
      const newRecords = data.list || []
      
      if (newRecords.length > 0) {
        // 转换数据格式以适配现有UI
        const formattedRecords = newRecords.map(record => ({
          id: record.billId,
          descContent: record.billDetailName || t('Reseller.TransferCoins'),
          createTime: new Date(record.billTime).toISOString(),
          amount: record.billAmount || 0
        }))
        
        // 分页追加
        recordList.value = [...recordList.value, ...formattedRecords]
        hasNext.value = !data.whetherLastPage
      } else {
        hasNext.value = false
      }
    } else {
      console.error('API返回错误:', response?.message)
      hasNext.value = false
    }
  } catch (e) {
    console.error('Failed to fetch record list:', e)
    hasNext.value = false
  } finally {
    loading.value = false
  }
}

// 下拉加载
const loadMore = () => {
  fetchRecordList()
}

// 返回按钮点击事件
const handleBack = () => {
  AppClose();
}

// 订单处理按钮点击事件
const handleOrderClick = () => {
  router.push({
    path: '/reseller/order',
    query: {
      uid: props.uid,
      ticket: props.ticket,
      source: props.source,
      deviceId: props.deviceId
    }
  })
}
// 转账按钮点击事件 - 打开转账弹窗
const handleTransferClick = () => {
  showTransferPopup.value = true
}

// 币商转账币商按钮点击事件 - 打开币商转账弹窗
const handleResellerTransferClick = () => {
  showResellerTransferPopup.value = true
}

// 处理转账成功事件
const handleTransferSuccess = async () => {
  // 重置分页状态
  offset.value = 0
  hasNext.value = true
  recordList.value = []
  // 重新获取用户信息和转账记录
  await fetchAgentInfo()
  await fetchRecordList()
  showTransferPopup.value = false
}

// 处理转账失败事件
const handleTransferFailed = (error) => {}

// 处理币商转账成功事件
const handleResellerTransferSuccess = async () => {
  // 重置分页状态
  offset.value = 0
  hasNext.value = true
  recordList.value = []
  // 重新获取用户信息和转账记录
  await fetchAgentInfo()
  await fetchRecordList()
  showResellerTransferPopup.value = false
}

// 处理币商转账失败事件
const handleResellerTransferFailed = (error) => {}

onMounted(async () => {

  fetchAgentInfo()
  fetchRecordList()
})

onMounted(() => {
  const recordHeader = document.querySelector('.record-header')
  const handleScroll = () => {
    if (recordHeader) {
      const sticky = recordHeader.getBoundingClientRect().top <= 0
      recordHeader.classList.toggle('is-sticky', sticky)
    }
  }
  window.addEventListener('scroll', handleScroll)
  // 清理事件监听器
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style lang="scss" scoped>
/* 页面主容器，宽度375px，适配移动端 */
.reseller-page {
  background: #F1F1F1;
  width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  font-family: Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;

  // 阿拉伯语RTL支持
  &[dir='rtl'] {
    // 返回按钮位置调整
    .nav-bar__back {
      left: auto;
      right: 16px;
    }

    .user-info {
      margin-left: 0;
      margin-right: 16px;
    }
    .user-card .action-btn {
      margin-left: 0;
      margin-right: 8px;
    }
    .user-card .action-btn:first-of-type {
      margin-right: 0;
    }
    .action-item .action-count {
      margin-left: 0;
      margin-right: 8px;
    }
    .action-item .action-btn {
      margin-left: 0;
      margin-right: auto;
    }
    .summary-divider {
      margin: 0 16px;
    }
    .record-bar {
      margin-right: 0;
      margin-left: 8px;
    }
    .transfer-record-icon {
      margin-right: 0;
      margin-left: 4px;
    }
  }
}

/* 顶部自定义导航栏 */
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

/* 返回按钮区域，左上角绝对定位 */
.nav-bar__back {
  position: absolute;
  top: 48px; /* 距顶部48px，适配状态栏 */
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

/* 标题区域，居中显示 */
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
  letter-spacing: 1px;
}

/* 用户信息卡片 */
.user-card {
  margin: -30px 16px 0;
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 2;
  box-sizing: border-box;
}
.user-avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
}
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-name {
  font-size: 16px;
  color: #000;
}
.user-id {
  font-size: 14px;
  color: #a29b94;
  margin-top: 4px;
}

/* 按钮容器 */
.user-card .action-btn {
  margin-left: 8px;
}

.user-card .action-btn:first-of-type {
  margin-left: 0;
}

/* 提现按钮特殊样式 */
.withdraw-btn {
  background: #4a90e2 !important;

  span {
    color: #fff !important;
  }
}

/* 操作区 */
.action-panel {
  width: 90%;
  margin: 24px auto 0 auto;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  box-sizing: border-box;
}
.action-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.action-item:last-child {
  margin-bottom: 0;
}
.action-icon {
  width: 22px;
  height: 22px;
}
.action-count {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin-left: 8px;
}
.action-btn {
  width: 117px;
  height: 30px;
  margin-left: auto;
  background: linear-gradient(to bottom, rgba(186, 54, 255, 1) , rgba(90, 0, 255, 1) );
  border: none;
  border-radius: 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-self: center;
  span {
    font-family: Helvetica;
    font-size: 12px;
    color: #FFFFFF;
    line-height: 15px;
    font-style: normal;
    text-align: center;
    margin: 0 auto;
  }
}
.divider {
  height: 1px;
  background: #eee;
  margin: 12px 0;
  width: 100%;
}

/* 币商转账币商入口 */
.transfer-to-reseller-section {
  width: 90%;
  margin: 24px auto 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 20px 16px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.transfer-to-reseller-section:hover {
  background: #f8f8f8;
}

.transfer-to-reseller-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.transfer-to-reseller-text {
  font-size: 14px;
  color: #000000;
  line-height: 18px;
  text-align: left;
  font-style: normal;
  font-weight: 500;
}

.transfer-to-reseller-arrow {
  width: 20px;
  height: 20px;
}

/* 转账统计区 */
.transfer-summary {
  width: 90%;
  margin: 24px auto 0 auto;
  box-sizing: border-box;
}
.summary-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  background: linear-gradient(to bottom, rgba(189, 119, 255, 0.37) , rgba(189, 119, 255, 0.14) );
  padding: 16px 16px;
  border-radius: 12px;
  
}
.summary-row:last-child {
  margin-bottom: 0;
}
.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .summary-gold {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.summary-icon {
  width: 18px;
  height: 18px;
  margin: 0 4px;
  margin-bottom: 4px;
}
.summary-value {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}
.summary-label {
  font-size: 12px;
  color: #a29b94;
  margin-top: 6px;
}
.summary-divider {
  width: 1px;
  height: 40px;
  background: #ebebeb;
  margin: 0 16px;
}

.record {
  width: 90%;
  margin: 24px auto 0;
  background: #fff;
  padding: 10px 15px 5px;
  border-radius: 10px;
}
/* 记录头部 */
.record-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background: #fff;
  // 移除吸顶逻辑
  z-index: 10; // 确保在其他内容之上
  box-sizing: border-box;
  position: sticky;
  top: 0;
  background-color: transparent;
  transition: background-color 0.3s ease;
  &.is-sticky {
    background-color: #fff;
  }
}
.record-title {
  display: flex;
  align-items: center;
  align-items: center;
  .record-icon {
    width: 16px;
    height: 16px;
  }
  span {
    font-family: Helvetica, Helvetica;
    font-weight: bold;
    font-size: 12px;
    color: #000000;
    text-align: left;
    font-style: normal;
    margin: 0 5px ;
    line-height: 20px;
    height: 16px;
  }
}
.record-bar {
  width: 3px;
  height: 16px;
  background: #f7cf4a;
  border-radius: 2px;
  margin-right: 8px;
}
.record-total {
  display: flex;
  align-items: center;
}
.record-total-label {
  font-size: 13px;
  color: #a29b94;
  margin-right: 4px;
}
.record-total-value {
  font-size: 13px;
  color: #000;
}

/* 转账记录列表容器 */
.transfer-record-list {
  margin: 24px auto 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 单条转账记录项 */
.transfer-record-item {
  width: 100%;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

/* 左侧信息 */
.transfer-record-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.transfer-record-type {
  color: #000;
  font-size: 12px;
  font-weight: 700;
  line-height: 22px;
  white-space: nowrap;
}
.transfer-record-date {
  color: #a19b95;
  font-size: 11px;
  line-height: 18px;
  margin-top: 8px;
  white-space: nowrap;
}

/* 右侧金额和图标 */
.transfer-record-amount-group {
  display: flex;
  align-items: center;
}
.transfer-record-icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
}
.transfer-record-amount {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  font-size: 11px;
}

/* 空记录区 */
.record-empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;
}
.record-empty-img {
  width: 160px;
  height: 126px;
  object-fit: contain;
}
.record-empty-text {
  font-size: 16px;
  color: #bdbdbd;
  margin-top: 12px;
}
</style>
