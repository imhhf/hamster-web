<template>
  <Popup
    :show="props.show"
    position="bottom"
    :overlay-style="{ background: 'rgba(0,0,0,0.8)' }"
    :close-on-click-overlay="true"
    transition="popup-fade"
    :style="{ background: 'transparent', padding: '0' }"
    @update:show="closePopup"
  >
    <div class="withdraw-popup">
      <div class="withdraw-header">
        <div class="withdraw-title">{{ $t('Agency.Withdraw') }}</div>
        <img :src="arrowInvite" alt="" @click="closePopup" />
      </div>

      <div class="withdraw-method" @click="handleSelectWithdrawMethod">
        <div class="withdraw-method-title">
          <div v-if="selectedWithdrawMethod" class="selected-method-display">
            <div class="method-header">
              <img 
                v-if="selectedWithdrawMethod.channelIcon" 
                :src="selectedWithdrawMethod.channelIcon" 
                class="method-icon-img" 
                alt="withdraw method icon"
              />
              <span v-else class="method-icon">{{ '💳' }}</span>
              <span class="withdraw-method-name">{{ selectedWithdrawMethod.method }}</span>
            </div>
            <span class="withdraw-method-details"
              >{{ selectedWithdrawMethod.reciplentName }} -
              {{ selectedWithdrawMethod.accountId }}</span
            >
          </div>
          <div v-else class="default-withdraw-method">{{ $t('Agency.WithdrawMethods') }}</div>
        </div>
        <img class="withdraw-method-arrow" :src="arrowRight" alt="" />
      </div>

      <div class="withdraw-agent">
        <div class="withdraw-agent-label">{{ $t('Agency.Agent') }}</div>
        <div class="withdraw-agent-info" @click="handleSelectAgent">
          <div v-if="selectedAgent?.agentId" class="agent-selected">
            <img
              class="withdraw-agent-avatar"
              :src="
                selectedAgent.agentAvatar?.includes('http')
                  ? selectedAgent.agentAvatar
                  : 'https://file.hamsterdw.com/' + selectedAgent.agentAvatar
              "
              alt=""
            />
            <div>
              <div class="withdraw-agent-name">
                {{ selectedAgent.agentName }}
              </div>
              <div class="withdraw-agent-id">
                {{ $t('Agency.UserId') }} {{ selectedAgent.agentId }}
              </div>
            </div>
          </div>
          <div v-else class="agent-not-selected">
            <div class="agent-placeholder">{{ $t('Agency.SelectAgent') }}</div>
          </div>
          <img class="withdraw-agent-arrow" :src="arrowRight" alt="" />
        </div>
      </div>

      <div class="withdraw-amount-label">
        {{ $t('Agency.Amount') }} 
        <span class="balance-info">
          （{{ $t('Agency.Balance') }}：<img class="balance-diamond-icon" :src="diamondIcon" alt="" /> {{ userWalletData.diamondAmount }}）
        </span>
      </div>
      <div class="withdraw-amount-row">
        <div class="withdraw-amount-info">
          <img class="withdraw-amount-icon" :src="diamondIcon" alt="" />
          <input
            v-model="withdrawAmount"
            type="number"
            class="withdraw-amount-input"
            :placeholder="$t('Agency.EnterAmount')"
            :max="userWalletData.diamondAmount"
            @input="handleAmountInput"
          />
        </div>
      </div>

      <!-- 显示错误提示 -->
      <div v-if="amountError" class="amount-error">
        {{ amountError }}
      </div>

      <img class="withdraw-equal-icon" :src="equalIcon" alt="" />

      <div class="withdraw-usd-row">
        <div class="withdraw-usd-label">= {{ usdAmount }}</div>
        <div class="withdraw-usd-value">USD</div>
      </div>

      <div
        class="withdraw-btn"
        @click="handleWithdraw"
        :class="{ 'withdraw-btn-loading': isWithdrawing, 'withdraw-btn-disabled': !canSubmit }"
        :disabled="!canSubmit || isWithdrawing"
      >
        <div v-if="isWithdrawing" class="withdraw-btn-loading-content">
          <var-loading size="small" color="#443213" />
          <span class="withdraw-btn-text">{{ $t('Agency.Processing') }}</span>
        </div>
        <div v-else class="withdraw-btn-text">{{ $t('Agency.Withdraw') }}</div>
      </div>
    </div>

    <!-- AgentSelectionPopup 弹窗接入 -->
    <AgentSelectionPopup
      v-model:visible="showAgentPopup"
      :selectedAgentId="selectedAgentId"
      :uid="props.uid"
      :ticket="props.ticket"
      @agent-selected="handleAgentSelected"
    />

    <!-- WithdrawMethods 弹窗接入 -->
    <WithdrawMethods
      v-model:visible="showWithdrawMethods"
      :selectedChannelId="selectedWithdrawMethod?.method"
      :uid="props.uid"
      :ticket="props.ticket"
      @channel-selected="handleChannelSelected"
    />
  </Popup>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Dialog, Snackbar , Popup} from '@varlet/ui'
import arrowRight from '@/assets/agency/arrow_right.png'
import diamondIcon from '@/assets/agency/diamond_icon.png'
import equalIcon from '@/assets/agency/equal_icon.png'
import arrowInvite from '@/assets/agency/arrow_invite.png'
import WithdrawMethods from './WithdrawMethods.vue'
import AgentSelectionPopup from './AgentSelectionPopup.vue'
import { useI18n } from 'vue-i18n'

import { WITHDRAW_INFO, WITHDRAW_LAUNCH } from '@/api/withdraw';

const props = defineProps({
  show: Boolean,
  bgImage: String,
  uid: [String, Number],
  ticket: String,
  source: String,
  deviceId: String
})

const emit = defineEmits(['update:show'])

// 获取翻译函数
const { t } = useI18n()

const showAgentPopup = ref(false)
const showWithdrawMethods = ref(false)



onMounted(() => {
  fetchWithdrawInfo()
})


// 内部数据
const selectedAgentId = ref(undefined)
const withdrawAmount = ref('')
const usdAmount = ref('0')
const selectedWithdrawMethod = ref(null)
const selectedAgent = ref(null)

// 用户钱包数据
const userWalletData = ref({
  diamondAmount: '0',
  goldAmount: '0',
})

// 错误提示
const amountError = ref('')

// 提现状态
const isWithdrawing = ref(false)

// 判断是否可以提交
const canSubmit = computed(() => {
  return !!(
    selectedWithdrawMethod.value?.method &&
    selectedWithdrawMethod.value?.accountId &&
    selectedWithdrawMethod.value?.reciplentName &&
    selectedWithdrawMethod.value?.whatsappNumber &&
    selectedWithdrawMethod.value?.channelId &&
    selectedAgent.value?.agentId &&
    selectedAgent.value?.agentName &&
    withdrawAmount.value &&
    parseFloat(withdrawAmount.value) > 0 &&
    parseFloat(withdrawAmount.value) <= parseFloat(userWalletData.value.diamondAmount || '0')
  )
})


// 获取提现初始化信息
const fetchWithdrawInfo = async () => {
  try {
    const res = await WITHDRAW_INFO({
      uid: props.uid,
    })
    
    console.log('提现初始化信息:', res)
    
    if (res) {
      // 更新用户钱包数据
      userWalletData.value = {
        diamondAmount: res.purseDiamondNum?.toString() || '0',
        goldAmount: '0', // 接口没有返回金币数量，保持默认值
        withdrawDiamondExchangeUsdRate: res.cashRate || 100 // 钻石转美金比例
      }
      
      console.log('更新后的钱包数据:', userWalletData.value)
      
      // 如果用户已经输入了金额，重新计算USD金额
      if (withdrawAmount.value && parseFloat(withdrawAmount.value) > 0) {
        calculateUsdAmount(parseFloat(withdrawAmount.value)) || 0
      }
    }
  } catch (error) {
    console.error('获取提现初始化信息失败:', error)
  }
}

// 处理金额输入
const handleAmountInput = () => {
  const amount = parseFloat(withdrawAmount.value)
  const maxAmount = parseFloat(userWalletData.value.diamondAmount || '0')

  // 清除之前的错误
  amountError.value = ''

  if (amount > maxAmount) {
    amountError.value = t('Agency.AmountCannotExceed', { max: maxAmount })
    withdrawAmount.value = maxAmount.toString()
  }

  // 计算USD金额（这里可以根据实际汇率计算）
  calculateUsdAmount(amount)
}

// 计算USD金额
const calculateUsdAmount = (diamondAmount) => {
  // 使用从接口获取的钻石兑换USD比例
  const rate = userWalletData.value.withdrawDiamondExchangeUsdRate || 0
  if (rate > 0) {
    // 钻石数量除以兑换比例，保留小数点后两位
    usdAmount.value = (diamondAmount / rate).toFixed(2)
  } else {
    usdAmount.value = '0.00'
  }
}

// 打开提现方式选择弹窗
const handleSelectWithdrawMethod = () => {
  showWithdrawMethods.value = true
}

// 渠道选择回调
const handleChannelSelected = (withdrawMethodData) => {
  selectedWithdrawMethod.value = withdrawMethodData
  console.log('选中的提现方式:', withdrawMethodData)
}

// 打开代理选择弹窗
const handleSelectAgent = () => {
  showAgentPopup.value = true
}

// 代理选择回调
const handleAgentSelected = (agent) => {
  selectedAgent.value = agent
  selectedAgentId.value = agent.agentId
  showAgentPopup.value = false
}

// 关闭弹窗
const closePopup = () => {
  emit('update:show', false)
}



// 提现
const handleWithdraw = async () => {
  // 验证提现方式数据
  if (!selectedWithdrawMethod.value) {
    Snackbar.error(t('Agency.PleaseSelectWithdrawMethod'))
    return
  }

  if (!selectedWithdrawMethod.value.method) {
    Snackbar.error(t('Agency.PleaseSelectWithdrawMethod'))
    return
  }

  if (!selectedWithdrawMethod.value.accountId) {
    Snackbar.error(t('Agency.PleaseEnterAccountID'))
    return
  }

  if (!selectedWithdrawMethod.value.reciplentName) {
    Snackbar.error(t('Agency.PleaseEnterRecipientName'))
    return
  }

  if (!selectedWithdrawMethod.value.whatsappNumber) {
    Snackbar.error(t('Agency.PleaseEnterWhatsAppNumber'))
    return
  }

  // 验证代理数据
  if (!selectedAgent.value) {
    Snackbar.error(t('Agency.PleaseSelectAgent'))
    return
  }

  if (!selectedAgent.value.agentId) {
    Snackbar.error(t('Agency.PleaseSelectValidAgent'))
    return
  }

  if (!selectedAgent.value.agentName) {
    Snackbar.error(t('Agency.AgentInfoIncomplete'))
    return
  }

  // 验证金额数据
  if (!withdrawAmount.value || parseFloat(withdrawAmount.value) <= 0) {
    Snackbar.error(t('Agency.PleaseEnterValidAmount'))
    return
  }

  const amount = parseFloat(withdrawAmount.value)
  const maxAmount = parseFloat(userWalletData.value.diamondAmount || '0')

  if (amount > maxAmount) {
    Snackbar.error(t('Agency.AmountCannotExceedBalance'))
    return
  }

  // 使用 Varlet Dialog 进行二次确认
  const confirmed = await new Promise(resolve => {
    Dialog({
      title: t('Agency.ConfirmWithdraw'),
      message: t('Agency.ConfirmWithdrawMessage', {
        amount: amount,
        usdAmount: usdAmount.value,
        agentName: selectedAgent.value?.agentName,
        method: selectedWithdrawMethod.value.method,
      }),
      confirmButtonText: t('Agency.Confirm'),
      cancelButtonText: t('Agency.Cancel'),
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    })
  })

  if (confirmed) {
    try {
      isWithdrawing.value = true

      // 构建提现请求数据
      const withdrawData = {
        uid: props.uid,
        ticket: props.ticket,
        agentUid: selectedAgent.value.uid,
        withdrawType: selectedWithdrawMethod.value.channelId,
        diamondNum: amount
      }

      console.log('提现请求数据:', withdrawData)

      // 调用提现接口
      const result = await WITHDRAW_LAUNCH(withdrawData)
      console.log('提现接口返回:', result)
      
      // 提现成功
      Snackbar.success({
        content: t('Agency.WithdrawRequestSubmitted'),
        position: 'center',
      })

      // 刷新钱包数据
      await fetchWithdrawInfo()

      // 重置表单
      resetForm()

      // 关闭弹窗
      emit('update:show', false)
    } catch (error) {
      console.error('提现失败:', error)
    } finally {
      isWithdrawing.value = false
    }
  }
}

// 重置表单
const resetForm = () => {
  withdrawAmount.value = ''
  usdAmount.value = '0'
  selectedWithdrawMethod.value = null
  selectedAgent.value = null
  selectedAgentId.value = undefined
  amountError.value = ''
}

// 监听弹窗显示状态，获取钱包数据
watch(
  () => props.show,
  newVal => {
    if (newVal) {
      fetchWithdrawInfo()
    } else {
      // 弹窗关闭时重置表单
      resetForm()
    }
  }
)

// 组件挂载时获取钱包数据
onMounted(() => {
  fetchWithdrawInfo()
  console.log('WithdrawPopup 接收到的参数:', {
    uid: props.uid,
    ticket: props.ticket,
    source: props.source,
    deviceId: props.deviceId
  })
})
</script>

<style lang="less" scoped>
.withdraw-popup {
  width: 375px;
  background: #fff;
  margin: 0 auto;
  padding: 29px 22px 42px 22px;
  box-sizing: border-box;
  border-radius: 16px 16px 0 0;
  .withdraw-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    margin-bottom: 16px;
    .withdraw-title {
      color: #000;
    }
    & > div {
      text-align: center;
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
      line-height: 19px;
      font-style: normal;
    }
    & > img {
      width: 18px;
      height: 11px;
      position: absolute;
      right: 10px;
      top: 14px;
    }
  }

  .withdraw-method {
    background-color: rgba(130, 130, 130, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 24px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(178, 144, 64, 0.3);
    }

    .withdraw-method-title {
      font-family: Helvetica;
      font-size: 16px;
      color: #ffffff;
      line-height: 19px;
      text-align: left;
      font-style: normal;

      .selected-method-display {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .method-header {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .method-icon {
        font-size: 18px;
        color: #f7cf4a;
      }

      .method-icon-img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }

      .withdraw-method-name {
        font-family: Helvetica;
        font-size: 16px;
        color: #ffffff;
        line-height: 19px;
        text-align: left;
        font-style: normal;
        font-weight: bold;
      }

      .withdraw-method-details {
        font-family: Helvetica;
        font-size: 13px;
        color: #a19b95;
        line-height: 16px;
        text-align: left;
        font-style: normal;
      }

      .default-withdraw-method {
        font-family: Helvetica;
        font-size: 16px;
        color: rgba(161, 155, 148, 1);
        line-height: 19px;
        text-align: left;
        font-style: normal;
      }
    }
    .withdraw-method-arrow {
      width: 12px;
      height: 12px;
    }
  }

  .withdraw-agent {
    background-color: rgba(130, 130, 130, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 24px;
    .withdraw-agent-label {
      font-family: Helvetica;
      font-size: 16px;
      color: rgba(161, 155, 148, 1);
      line-height: 19px;
      text-align: left;
      font-style: normal;
    }
    .withdraw-agent-avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .withdraw-agent-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      .agent-selected {
        display: flex;
        align-items: center;
        margin: 0 12px;
      }

      .agent-not-selected {
        display: flex;
        align-items: center;
        margin: 0 12px;

        .agent-placeholder {
          font-family: Helvetica;
          font-size: 16px;
          color: rgba(161, 155, 148, 1);
          line-height: 19px;
          text-align: left;
          font-style: normal;
        }
      }

      .withdraw-agent-avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 12px;
      }

      .withdraw-agent-name {
        font-family: Helvetica, Helvetica;
        font-weight: bold;
        font-size: 13px;
        color: #ffffff;
        line-height: 16px;
        text-align: left;
        font-style: normal;
      }

      .withdraw-agent-id {
        font-family: Helvetica;
        font-size: 13px;
        color: #a19b95;
        line-height: 16px;
        text-align: left;
        font-style: normal;
      }

      .withdraw-agent-arrow {
        width: 12px;
        height: 12px;
      }
    }
  }

  .withdraw-amount-label {
    font-family: Helvetica, Helvetica;
    font-weight: bold;
    font-size: 16px;
    color: #000;
    line-height: 19px;
    text-align: left;
    font-style: normal;
    margin-bottom: 10px;
    
    .balance-info {
      font-weight: normal;
      font-size: 16px;
      color: #000;
    line-height: 19px;
    text-align: left;
    font-style: normal;
    font-weight: bold;
      .balance-diamond-icon {
        width: 14px;
        height: 14px;
        margin: 0 4px;
        vertical-align: middle;
      }
    }
  }

  .withdraw-amount-row {
    background-color: rgba(130, 130, 130, 0.2);
    border-radius: 16px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    padding: 12px;
    margin-bottom: 16px;
    width: 100%;
    box-sizing: border-box;
    .withdraw-amount-info {
      display: flex;
      align-items: center;
      flex: 1;

      .withdraw-amount-icon {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }

      .withdraw-amount-input {
        background: transparent;
        border: none;
        outline: none;
        font-family: Helvetica, Helvetica;
        font-weight: bold;
        font-size: 16px;
        color: #000;
        line-height: 19px;
        text-align: left;
        font-style: normal;
        flex: 1;

        &::placeholder {
          color: #a19b95;
        }

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        &[type='number'] {
          -moz-appearance: textfield;
        }
      }
    }

    .withdraw-all-btn {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 16px;
      color: #f7cf4a;
      line-height: 19px;
      text-align: center;
      font-style: normal;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
      white-space: nowrap;
    }
  }

  .amount-error {
    color: #ff6b6b;
    font-size: 12px;
    text-align: center;
    margin-bottom: 16px;
    padding: 8px;
    background-color: rgba(255, 107, 107, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 107, 107, 0.3);
  }

  .withdraw-equal-icon {
    width: 12px;
    height: 14px;
    display: block;
    margin-bottom: 16px;
  }

  .withdraw-usd-row {
    background-color: rgba(130, 130, 130, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 24px;
    .withdraw-usd-value {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 16px;
      color: #a19b94;
      line-height: 19px;
      text-align: right;
      font-style: normal;
    }
    .withdraw-usd-label {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 16px;
      color: #a19b94;
      line-height: 19px;
      text-align: right;
      font-style: normal;
    }
  }

  .withdraw-status-info {
    background-color: rgba(130, 130, 130, 0.2);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .status-icon {
        font-size: 18px;
      }

      .status-text {
        font-family: Helvetica;
        font-size: 14px;
        color: #ffffff;
        line-height: 17px;
        text-align: center;
        font-style: normal;
        font-weight: 500;
      }
    }
  }

  .withdraw-btn {
    background: linear-gradient(to bottom, rgba(186, 54, 255, 1) , rgba(90, 0, 255, 1) );
    border-radius: 22px;
    width: 100%;
    padding: 14px 0;
    border: none;
    cursor: pointer;
    margin-top: 24px;
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &.withdraw-btn-disabled {
      background: rgba(216, 216, 216, 1);
      cursor: not-allowed;

      .withdraw-btn-text {
        color: rgba(162, 162, 162, 1);
      }
    }

    .withdraw-btn-text {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 14px;
      color: #fff;
      line-height: 17px;
      text-align: center;
      font-style: normal;
    }

    .withdraw-btn-loading-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  }
}
</style>
