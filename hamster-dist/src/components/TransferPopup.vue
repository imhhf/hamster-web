<template>
  <div v-if="isVisible" class="transfer-popup-overlay" @click="handleOverlayClick">
    <div class="transfer-popup" @click.stop>
      <!-- 弹窗标题 -->
      <div class="popup-header">
        <span class="popup-title">{{ $t('transfer.title') }}</span>
        <div class="popup-divider"></div>
      </div>

      <!-- 用户搜索区域 -->
      <div class="search-section">
        <div class="section-label">{{ $t('transfer.checkUserId') }}</div>
        <!-- 搜索输入框 - 未搜索到用户时显示 -->
        <div v-if="!searchedUser" class="search-input-container">
          <input
            v-model="searchUserId"
            type="text"
            class="search-input"
            :placeholder="$t('transfer.searchUserIdPlaceholder')"
            @input="handleSearchInput"
          />
          <button class="search-btn" @click="handleSearchUser">
            <span>{{ $t('transfer.search') }}</span>
          </button>
          <img class="search-icon" :src="search_icon" />
        </div>
        <!-- 用户搜索结果展示 - 搜索到用户后显示 -->
        <div v-else class="user-result">
          <div class="user-info">
            <img
              class="user-avatar"
              referrerpolicy="no-referrer"
              :src="
               searchedUser.avatar
              "
            />
            <div class="user-details">
              <span class="username">{{
                searchedUser.nickname || $t('transfer.unknownUser')
              }}</span>
              <span class="user-id"
                >{{ $t('transfer.userIdPrefix') }} {{ searchedUser.userId || '' }}</span
              >
            </div>
          </div>
          <button class="clear-btn" @click="handleClearUser">
            <span>Clear</span>
          </button>
        </div>
      </div>

      <!-- 转账金额区域 -->
      <div class="amount-section">
        <div class="section-label">{{ $t('transfer.enterAmount') }}</div>
        <div class="balance-display">
          <span class="balance-label">{{ $t('transfer.balance') }}</span>
          <img class="coin-icon" referrerpolicy="no-referrer" :src="gold_icon" />
          <span class="balance-amount">{{ formatNumber(agentBalance) }}</span>
        </div>
        <div class="amount-input-container">
          <img class="coin-input-icon" :src="gold_icon" />
          <input
            v-model="transferAmount"
            type="number"
            class="amount-input"
            :placeholder="`${$t('transfer.minAmountPlaceholder', { min: minTransferAmount })} - ${$t('transfer.maxAmountPlaceholder', { max: formatNumber(maxTransferAmount) })}`"
            @input="handleAmountInput"
          />
          <!-- <button class="max-btn" @click="handleMaxAmount">
            <span>{{ $t('transfer.max') }}</span>
          </button> -->
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="attention-text">
        Attention: <br />
        {{ $t('transfer.attention') }}
      </div>

      <!-- 转账按钮 -->
      <button
        class="transfer-btn"
        :class="{ 'transfer-btn--disabled': !canTransfer }"
        @click="handleTransfer"
        :disabled="!canTransfer"
      >
        <span v-if="isTransferring">{{ $t('transfer.transferring') }}</span>
        <span v-else>{{ $t('transfer.transfer') }}</span>
      </button>
    </div>

    <!-- 自定义确认弹窗 -->
    <div v-if="showConfirmDialog" class="confirm-dialog-overlay" @click="handleConfirmOverlayClick">
      <div class="confirm-dialog" @click.stop>
        <div class="confirm-content">
          <p class="confirm-message">{{ confirmMessage }}</p>
          <div class="confirm-buttons">
            <button 
              class="cancel-btn" 
              :class="{ 'cancel-btn--disabled': isTransferring }"
              @click="handleCancelTransfer"
              :disabled="isTransferring"
            >
              Cancel
            </button>
            <button 
              class="confirm-btn" 
              :class="{ 'confirm-btn--loading': isTransferring }"
              @click="handleConfirmTransfer"
              :disabled="isTransferring"
            >
              <span v-if="isTransferring">Processing...</span>
              <span v-else>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import search_icon from '@/assets/reseller/search_icon.png'
import gold_icon from '@/assets/reseller/gold_icon.png'
import { useI18n } from 'vue-i18n'
import { Snackbar } from '@varlet/ui'
import { AGENCY_SEARCH_USER, AGENCY_TRANSFER } from '@/api/reseller'


const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  agentBalance: {
    type: Number,
    required: true
  },
  maxTransferAmount: {
    type: Number,
    default: 999999
  },
  minTransferAmount: {
    type: Number,
    default: 1
  },
  agentId: {
    type: Number,
    default: 0
  },
  isResellerTransfer: {
    type: Boolean,
    default: false
  },
  uid: {
    type: [String, Number],
    required: true
  }
})


const emit = defineEmits(['update:visible', 'transfer', 'transfer-success', 'transfer-failed'])

const { t } = useI18n()

// 响应式数据
const searchUserId = ref('')
const transferAmount = ref('')
const searchedUser = ref(null)
const isSearching = ref(false)
const isTransferring = ref(false) // 转账状态
const showConfirmDialog = ref(false) // 确认弹窗显示状态
const confirmMessage = ref('') // 确认消息
const pendingTransferData = ref(null) // 待确认的转账数据

// 计算属性
const canTransfer = computed(() => {
  const amount = Number(transferAmount.value)
  return (
    searchedUser.value &&
    transferAmount.value &&
    amount >= props.minTransferAmount &&
    amount <= props.agentBalance &&
    amount <= props.maxTransferAmount &&
    !isTransferring.value // 转账中不能重复点击
  )
})

// 弹窗显示状态计算属性
const isVisible = computed(() => {
  return props.visible
})

// 方法
const handleOverlayClick = (event) => {
  // 确保点击的是遮罩层本身，而不是弹窗内容
  if (event.target === event.currentTarget) {
    emit('update:visible', false)
  }
}

// 添加键盘ESC键关闭弹窗
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('update:visible', false)
  }
}

// 监听弹窗显示状态
watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      // 弹窗打开时添加键盘事件监听
      document.addEventListener('keydown', handleKeydown)
    } else {
      // 弹窗关闭时移除键盘事件监听
      document.removeEventListener('keydown', handleKeydown)
      // 弹窗关闭时重置数据
      resetForm()
    }
  }
)

const handleSearchInput = () => {
  // 清空之前的搜索结果
  if (searchedUser.value) {
    searchedUser.value = null
  }
}

// 检查用户是否为币商
const checkIfUserIsReseller = (userRole) => {
  // 通过userRole字段判断用户是否为币商
  // GOLD_AGENT表示币商角色
  return userRole?.includes('GOLD_AGENT') ?? false
}

const handleSearchUser = async () => {
  if (!searchUserId.value.trim()) {
    Snackbar.error('Please enter user ID')
    return
  }

  try {
    isSearching.value = true

    const userId = parseInt(searchUserId.value)
    if (isNaN(userId)) {
      Snackbar.error('Please enter a valid user ID')
      return
    }

    // 调用真实的搜索用户API
    const response = await AGENCY_SEARCH_USER({ erbanNo: userId , uid: props.uid})
    
    if (response) {
      // 转换API返回的数据格式
      const userData = {
        uid: response.uid,
        userId: response.erbanNo,
        nickname: response.nick,
        avatar: response.avatar,
        ticket: props.ticket,
        userRole: 'GOLD_AGENT' // 假设搜索到的用户都是币商，实际可能需要额外API验证
      }

      // 如果是币商转账币商，需要验证目标用户是否为币商
      if (props.isResellerTransfer) {
        const isReseller = checkIfUserIsReseller(userData.userRole)
        if (!isReseller) {
          Snackbar.error(t('Reseller.NotResellerUser'))
          searchedUser.value = null
          return
        }
      }
      
      searchedUser.value = userData
    } else {
      searchedUser.value = null
    }
  } catch (error) {
    console.error('Search user failed:', error)
    Snackbar.error('Search failed, please try again')
    searchedUser.value = null
  } finally {
    isSearching.value = false
  }
}

const handleClearUser = () => {
  // 清除搜索结果，恢复到输入框状态
  searchedUser.value = null
  searchUserId.value = ''
}

const handleAmountInput = () => {
  const amount = Number(transferAmount.value)
  if (amount > props.agentBalance) {
    transferAmount.value = props.agentBalance.toString()
  }
  if (amount > props.maxTransferAmount) {
    transferAmount.value = props.maxTransferAmount.toString()
  }
  // 不在输入时限制最小值，只在提交时验证，以免影响用户输入体验
}

const handleMaxAmount = () => {
  const maxAmount = Math.min(props.agentBalance, props.maxTransferAmount)
  transferAmount.value = maxAmount.toString()
}

const handleTransfer = async () => {
  if (!canTransfer.value) return

  const amount = Number(transferAmount.value)
  if (amount < props.minTransferAmount) {
    Snackbar.error(t('transfer.minimumTransferError', { min: props.minTransferAmount }))
    return
  }

  if (amount > props.agentBalance) {
    Snackbar.error('Insufficient balance')
    return
  }

  if (amount > props.maxTransferAmount) {
    Snackbar.error(`Amount exceeds maximum transfer limit of ${props.maxTransferAmount}`)
    return
  }

  // 准备转账数据
  const transferData = {
    uid: props.uid, // 代理uid
    ticket: props.ticket,
    targetUid: searchedUser.value.uid, // 目标用户uid
    goldNum: amount // 代充金币数
  }

  // 设置确认消息和待确认数据
  confirmMessage.value = `Are you sure you want to transfer ${amount} coins to ${searchedUser.value?.nickname}?`
  pendingTransferData.value = transferData
  
  // 显示自定义确认弹窗
  showConfirmDialog.value = true
}

// 确认弹窗处理方法
const handleConfirmOverlayClick = (event) => {
  // 确保点击的是遮罩层本身，而不是弹窗内容
  // 在loading状态下不允许关闭弹窗
  if (event.target === event.currentTarget && !isTransferring.value) {
    showConfirmDialog.value = false
    pendingTransferData.value = null
  }
}

const handleCancelTransfer = () => {
  showConfirmDialog.value = false
  pendingTransferData.value = null
}

const handleConfirmTransfer = async () => {
  if (!pendingTransferData.value) return

  try {
    isTransferring.value = true
    // 不立即关闭确认弹窗，等接口完成后再关闭

    // 调用真实的转账API
    const response = await AGENCY_TRANSFER(pendingTransferData.value)
    console.log('打款接口返回:', response)
    
    if (response) {
      const amount = pendingTransferData.value.goldNum
      // 转账成功提示 - 使用Snackbar
      Snackbar.success(`Transfer ${amount} coins to ${searchedUser.value?.nickname} successfully!`)

      // 发送成功事件
      emit('transfer-success', {
        userId: searchedUser.value.userId?.toString() || '',
        amount: amount,
      })

      // 关闭确认弹窗
      showConfirmDialog.value = false
      
      // 关闭主弹窗并重置表单
      emit('update:visible', false)
      resetForm()
    } else {
      Snackbar.error(response?.message || 'Transfer failed, please try again')
      // 转账失败时关闭确认弹窗
      showConfirmDialog.value = false
    }
  } catch (error) {
    console.error('Transfer failed:', error)
    Snackbar.error('Transfer failed, please try again')
    emit('transfer-failed', error)
    // 转账失败时关闭确认弹窗
    showConfirmDialog.value = false
  } finally {
    isTransferring.value = false
    pendingTransferData.value = null
  }
}

const resetForm = () => {
  searchUserId.value = ''
  transferAmount.value = ''
  searchedUser.value = null
  isSearching.value = false
  isTransferring.value = false
  showConfirmDialog.value = false
  confirmMessage.value = ''
  pendingTransferData.value = null
}

const formatNumber = (num) => {
  return num.toLocaleString()
}
</script>

<style lang="less" scoped>
/* 弹窗遮罩层 */
.transfer-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  cursor: pointer; /* 添加指针样式 */
}

/* 弹窗主体 - 375px移动端布局 */
.transfer-popup {
  background: #fff;
  border-radius: 24px 24px 0 0;
  width: 375px;
  max-height: 80vh;
  padding: 20px 16px 40px;
  box-sizing: border-box;
  overflow-y: auto;
  cursor: default; /* 弹窗内容使用默认指针 */
}

/* 弹窗标题 */
.popup-header {
  margin-bottom: 20px;
}

.popup-title {
  color: #000;
  font-size: 20px;
  font-family: Helvetica-Bold, Helvetica, Arial, sans-serif;
  font-weight: 700;
  display: block;
  line-height: 1.2;
  margin-bottom: 20px;
}

.popup-divider {
  background: #ebebeb;
  width: 100%;
  height: 1px;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 10px;
}

.section-label {
  font-family: Helvetica, Helvetica;
  font-weight: bold;
  font-size: 12px;
  color: #a29b94;
  line-height: 15px;
  margin-bottom: 20px;
}

.search-input-container {
  position: relative;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px 8px 16px 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #a19b95;
  outline: none;
  padding: 8px 0;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #a19b95;
}

.search-btn {
  background: linear-gradient(to bottom, rgba(186, 54, 255, 1) , rgba(90, 0, 255, 1) );

  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn span {
  color: #fff;
  font-size: 16px;
  font-family: Helvetica-Bold, Helvetica, Arial, sans-serif;
  font-weight: 700;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}

/* 用户搜索结果 - 375px移动端适配 */
.user-result {
  background: #e7e7e7;
  border-radius: 16px;
  padding: 12px 20px 12px 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 16px;
  box-sizing: border-box;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  color: #000;
  font-size: 16px;
  font-family: Helvetica-Bold, Helvetica, Arial, sans-serif;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}

.user-id {
  color: #a29b94;
  font-size: 14px;
  font-family: Helvetica, Arial, sans-serif;
  line-height: 1.2;
}

/* 清除按钮 */
.clear-btn {
  background: linear-gradient(to bottom, rgba(186, 54, 255, 1) , rgba(90, 0, 255, 1) );
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn span {
  color: #fff;
  font-size: 16px;
  font-family: Helvetica-Bold, Helvetica, Arial, sans-serif;
  font-weight: 700;
  line-height: 1.2;
}

/* 金额区域 */
.amount-section {
  margin-bottom: 20px;
}

.balance-display {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.balance-label {
  color: #000;
  font-size: 16px;
  font-family: Helvetica-Bold, Helvetica, Arial, sans-serif;
  font-weight: 700;
  line-height: 1.2;
  margin-right: 8px;
}

.coin-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.balance-amount {
  color: #000;
  font-size: 16px;
  font-family: Helvetica-Bold, Helvetica, Arial, sans-serif;
  font-weight: 700;
  line-height: 1.2;
}

.amount-input-container {
  background: #e7e7e7;
  border-radius: 16px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  box-sizing: border-box;
}

.coin-input-icon {
  width: 24px;
  height: 24px;
}

.amount-input {
  flex: 1;
  min-width: 80px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #000;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
}

.amount-input::placeholder {
  color: #a19b95;
}

.max-btn {
  background: linear-gradient(to bottom, rgba(186, 54, 255, 1) , rgba(90, 0, 255, 1) );
  border: none;
  border-radius: 20px;
  padding: 8px 24px;
  cursor: pointer;
  white-space: nowrap;
  box-sizing: border-box;
}

.max-btn span {
  color: #fff;
  font-size: 16px;
  font-family: Helvetica-Bold, Helvetica, Arial, sans-serif;
  font-weight: 700;
  line-height: 1.2;
}

/* 注意事项 */
.attention-text {
  font-family: Helvetica;
  font-size: 12px;
  color: #a29b94;
  line-height: 15px;
  text-align: left;
  font-style: normal;
  margin-bottom: 32px;
  padding: 0 16px;
}

/* 转账按钮 */
.transfer-btn {
  width: 100%;
  background: linear-gradient(to bottom, rgba(186, 54, 255, 1) , rgba(90, 0, 255, 1) );
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transfer-btn--disabled {
  background: #d8d8d8;
  cursor: not-allowed;
}


.transfer-btn span {
  color: #fff;
  font-size: 16px;
  font-family: Helvetica-Bold, Helvetica, Arial, sans-serif;
  font-weight: 700;
  line-height: 1.2;
}

/* 自定义确认弹窗样式 */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.confirm-dialog {
  width: 327px;
  height: 173px;
  background: linear-gradient(to bottom, #E7CDFF, #F5EBFF);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.confirm-content {
  text-align: center;
  padding: 20px;
}

.confirm-message {
  color: #000;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 24px;
  line-height: 1.4;
}

.confirm-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cancel-btn {
  width: 140px;
  height: 49px;
  background: #CBCBCB;
  color: #7F7F7F;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #B8B8B8;
}

.cancel-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-btn {
  width: 140px;
  height: 49px;
  background: linear-gradient(to bottom, rgba(186, 54, 255, 1), rgba(90, 0, 255, 1));
  color: #FFFFFF;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  opacity: 0.9;
}

.confirm-btn--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 响应式适配 - 小屏设备 */
@media (max-width: 375px) {
  .transfer-popup {
    width: 100%;
    border-radius: 16px 16px 0 0;
  }

  .popup-title {
    font-size: 18px;
  }

  .section-label {
    font-size: 14px;
  }

  .search-input,
  .amount-input {
    font-size: 14px;
  }

  .confirm-dialog {
    width: 300px;
    height: 160px;
  }

  .cancel-btn,
  .confirm-btn {
    width: 120px;
    height: 45px;
  }
}
</style>
