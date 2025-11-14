<template>
  <div class="test-page">
    <h1>提现组件测试页面</h1>
    
    <button @click="showWithdrawPopup = true" class="test-btn">
      打开提现弹窗
    </button>
    
    <div class="test-section">
      <h2>完成订单接口测试</h2>
      <div class="test-form">
        <input 
          v-model="testUid" 
          placeholder="用户UID" 
          class="test-input"
        />
        <input 
          v-model="testOrderId" 
          placeholder="订单ID" 
          class="test-input"
        />
        <button @click="testCompleteOrder" class="test-btn">
          测试完成订单
        </button>
      </div>
      <div v-if="testResult" class="test-result">
        <h3>测试结果:</h3>
        <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
      </div>
    </div>
    
    <!-- 提现弹窗 -->
    <WithdrawPopup
      v-model:show="showWithdrawPopup"
      :bg-image="testBgImage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WithdrawPopup from '@/components/WithdrawPopup.vue'
import { WITHDRAW_ORDER_COMPLETE } from '@/api/withdraw'
import { showToast } from 'vant'

const showWithdrawPopup = ref(false)
const testBgImage = 'https://via.placeholder.com/375x505/443213/ffffff?text=Withdraw+Background'

// 测试完成订单接口
const testUid = ref('')
const testOrderId = ref('')
const testResult = ref(null)

async function testCompleteOrder() {
  if (!testUid.value || !testOrderId.value) {
    showToast('请填写用户UID和订单ID')
    return
  }

  try {
    console.log('开始测试完成订单接口...')
    console.log('参数:', { uid: testUid.value, orderId: testOrderId.value })
    
    const response = await WITHDRAW_ORDER_COMPLETE({
      uid: testUid.value,
      orderId: testOrderId.value
    })
    
    console.log('完成订单接口返回:', response)
    testResult.value = {
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    }
    
    showToast('接口调用成功！')
    
  } catch (error) {
    console.error('完成订单接口调用失败:', error)
    testResult.value = {
      success: false,
      error: error.message || '未知错误',
      timestamp: new Date().toISOString()
    }
    
    showToast('接口调用失败: ' + (error.message || '未知错误'))
  }
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  text-align: center;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.test-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.test-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.test-btn {
  background: #f7cf4a;
  color: #443213;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin: 10px;
}

.test-btn:hover {
  background: #e6c23a;
}

.test-result {
  margin-top: 20px;
  padding: 15px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: left;
}

.test-result pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
