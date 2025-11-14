<template>
  <div class="detail-page">
    <!-- 顶部导航栏 -->
    <!-- 顶部自定义导航栏，宽度375px，高度125px，背景图可配置 -->
    <div class="nav-bar" :style="{ backgroundImage: `url(${head_bg})` }">
      <!-- 返回按钮区域 -->
      <div class="nav-bar__back" @click="handleBack">
        <img :src="back" alt="返回" class="nav-bar__back-icon" />
      </div>
      <!-- 标题区域 -->
      <div class="nav-bar__title">Agent</div>
    </div>
    <!-- 订单详情卡片 -->
    <div class="detail-card">
      <div class="order-title">
        <div class="order-amount">$ {{ orderData?.amount || orderData?.money || 0 }} USD</div>
        <div class="order-status" :class="getStatusClass(orderData?.status || '0')">
          {{ getStatusText(orderData?.status || '0') }}
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-label">Withdrawal Method</span>
        <div class="detail-value-group">
          <img :src="getChannelIcon(orderData?.channelIcon)" class="channel-icon" />
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-label">Withdrawal Amount</span>
        <div class="detail-value-group">
          <img class="detail-icon" :src="diamond_icon" />
          <span class="detail-value">{{ formatNumber(orderData?.withdrawAmount) }}</span>
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-label">Order Number</span>
        <div class="detail-value-group">
          <span class="detail-value">{{ orderData?.orderNumber || 'N/A' }}</span>
          <img
            class="detail-icon"
            :src="copy_icon"
          />
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-label">Order Time</span>
        <div class="detail-value-group">
          <span class="detail-value">{{ orderData?.orderTime }}</span>
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-label">Account ID</span>
        <div class="detail-value-group">
          <span class="detail-value">{{ orderData?.accountId || '' }}</span>
          <img
            class="detail-icon"
            :src="copy_icon"
          />
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-label">Reciplent's Name</span>
        <span class="detail-value">{{ orderData?.reciplentName || '' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">WhatsApp Number</span>
        <div class="detail-value-group">
          <span class="detail-value">{{ orderData?.whatAppNumber || '' }}</span>
          <img
            class="detail-icon"
            :src="copy_icon"
          />
        </div>
      </div>
    </div>

    <!-- 支付凭证显示 - 所有状态都显示 -->
    <div>
      <h3 class="upload-title">Payment Receipt</h3>
      <div class="upload-section">
        <div class="upload-area">
          <!-- 待处理状态：显示上传区域 -->
          <div v-if="orderData?.status === '0'" class="upload-input-wrapper">
            <!-- 隐藏的文件输入（备用方案） -->
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              class="upload-input"
              style="display: none;"
            />
            <!-- 未上传时显示上传占位符 -->
            <div
              v-if="uploadedImages.length === 0"
              class="upload-placeholder"
              @click="chooseImage"
            >
              <img :src="uploadIcon" alt="Upload" class="upload-icon" />
            </div>
            <!-- 已上传时显示图片预览 -->
            <div v-else class="uploaded-image-preview">
              <var-image
                :src="uploadedImages[0].displayUrl || uploadedImages[0].url"
                alt="Uploaded image"
                class="preview-img"
                fit="cover"
                lazy
                @click="previewImage(uploadedImages[0].displayUrl || uploadedImages[0].url)"
              />
              <div class="image-overlay">
                <button @click="removeImage(0)" class="remove-btn">×</button>
              </div>
            </div>
          </div>

          <!-- 其他状态：只读显示 -->
          <div v-else-if="orderData?.voucherImages" class="readonly-image">
            <var-image
              :src="orderData.voucherImages"
              alt="Payment Receipt"
              class="preview-img"
              fit="cover"
              lazy
              @click="previewImage(orderData.voucherImages)"
            />
            <!-- 如果有上传时间，显示时间信息 -->
            <div v-if="orderData?.voucherUploadTime" class="upload-time">
              Uploaded: {{ formatUploadTime(orderData.voucherUploadTime) }}
            </div>
          </div>

          <!-- 无图片状态 -->
          <div v-else class="no-image">
            <span>No payment receipt</span>
          </div>
        </div>
      </div>
    </div>

    <div class="foot-btn" v-if="orderData?.status === '0'">
      <!-- 拒绝按钮 -->
      <div 
        class="detail-reject-btn" 
        :class="{ 'btn-loading': isRejecting }"
        @click="onRejectOrder"
      >
        <span v-if="isRejecting">Rejecting...</span>
        <span v-else>Reject Order</span>
      </div>
      <!-- 通过按钮 -->
      <div 
        class="detail-confirm-btn" 
        :class="{ 'btn-loading': isConfirming }"
        @click="showConfirmDialog = true"
      >
        <span v-if="isConfirming">Confirming...</span>
        <span v-else>Confirm Payment</span>
      </div>
    </div>

    <!-- <div v-else-if="orderData?.status === '1'" class="order-completed-status">
      <div class="status-icon">✓</div>
      <div class="status-text">Order Completed</div>
    </div>

    <div v-else-if="orderData?.status === '2'" class="order-rejected-status">
      <div class="status-icon">✗</div>
      <div class="status-text">Order Rejected</div>
    </div>

    <div v-else-if="orderData?.status === '3'" class="order-processing-status">
      <div class="status-icon">⏳</div>
      <div class="status-text">Order Processing</div>
    </div> -->

    <div v-if="showConfirmDialog" class="confirm-dialog-mask" @click.self="onCancelConfirm">
      <div class="confirm-dialog">
        <div class="confirm-dialog__content">
          <div class="confirm-dialog__title">Confirm Payment</div>
          <div class="confirm-dialog__message">Are you sure you want to confirm this payment?</div>
        </div>
        <div class="confirm-dialog__actions">
          <button 
            class="confirm-dialog__cancel" 
            @click="onCancelConfirm"
            :disabled="isConfirming"
          >
            Cancel
          </button>
          <button 
            class="confirm-dialog__confirm" 
            :class="{ 'btn-loading': isConfirming }"
            @click="onConfirmPayment"
            :disabled="isConfirming"
          >
            <span v-if="isConfirming">Confirming...</span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import head_bg from '@/assets/reseller/head_bg.png'
import back from '@/assets/reseller/back.png'
import copy_icon from '@/assets/reseller/copy_icon.png'
import diamond_icon from '@/assets/reseller/diamond_icon.png'
import { Image as VarImage, ImagePreview, Snackbar } from '@varlet/ui'
import { AGENCY_WITHDRAWAL_REVIEW } from '@/api/reseller'
import { ShowImageChooser } from '@/utils/client'


const route = useRoute()
const fileInput = ref(null)
const uploadedImages = ref([])

const props = defineProps({
  uid: [String, Number],
  ticket: String,
  source: String,
  deviceId: String
})

// 上传图标（使用一个简单的占位符）
const uploadIcon =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDVWMTlNNSAxMkgxOSIgc3Ryb2tlPSIjOTQ4YzgyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K'
const showConfirmDialog = ref(false)
const orderData = ref(null)
const isRejecting = ref(false) // 拒绝订单加载状态
const isConfirming = ref(false) // 确认支付加载状态

// 获取订单详情 - 使用mock数据
const fetchOrderDetail = async () => {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 从sessionStorage中获取订单数据
    const orderDataStr = sessionStorage.getItem('currentOrderData')
    if (orderDataStr) {
      orderData.value = JSON.parse(orderDataStr)
      // 读取后立即清除，避免数据残留
      sessionStorage.removeItem('currentOrderData')
    }
    
    console.log('Order detail loaded:', orderData.value)
    console.log('Voucher images:', orderData.value?.voucherImages)
  } catch (error) {
    console.error('Failed to load order detail:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  fetchOrderDetail()
})

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    '0': 'Pending',
    '1': 'Processing',
    '2': 'Declined',
    '3': 'Completed',
  }
  return statusMap[status] || 'Unknown'
}

// 获取状态样式类
const getStatusClass = (status) => {
  const statusClassMap = {
    '0': 'status-pending',
    '1': 'status-processing',
    '2': 'status-declined',
    '3': 'status-completed',
  }
  return statusClassMap[status] || ''
}

// 格式化上传时间
const formatUploadTime = (timestamp) => {
  if (!timestamp) return ''
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return timestamp.toString()
  }
}

// 格式化数字，添加千分位逗号
const formatNumber = (num) => {
  if (num === undefined || num === null || num === '') return '0'
  const numStr = num.toString()
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 选择图片 - 使用 ShowImageChooser（推荐方式，与 Create.vue 保持一致）
const chooseImage = () => {
  // 限制只能上传一张图片
  if (uploadedImages.value.length >= 1) {
    Snackbar.error('You can only upload one image')
    return
  }

  ShowImageChooser((url) => {
    if (url) {
      // 清空之前的图片
      uploadedImages.value = []
      
      // 添加新图片
      uploadedImages.value.push({
        url: url,
        imageUrl: url,
        displayUrl: url
      })

      Snackbar.success('Image uploaded successfully')
      console.log('Image uploaded:', url)
    } else {
      Snackbar.error('Failed to select image')
    }
  })
}


// 删除图片
const removeImage = (index) => {
  if (index >= 0 && index < uploadedImages.value.length) {
    const image = uploadedImages.value[index]
    
    // 如果是通过 URL.createObjectURL 创建的本地URL，需要释放
    if (image.url && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url)
    }
    
    // 从数组中移除图片
    uploadedImages.value.splice(index, 1)
    console.log('Image removed successfully, remaining images:', uploadedImages.value.length)
  } else {
    console.error('Invalid index for removeImage:', index)
  }
}

// 预览图片
const previewImage = (url) => {
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

// 获取渠道图标
const getChannelIcon = (channelIcon) => {
  if (channelIcon) {
    return channelIcon
  }
  // 默认图标（使用一个简单的占位符）
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwxOS4xNCA5LjI3TDEzLjA5IDEwLjI4TDEyIDE2LjU0TDEwLjkxIDEwLjI4TDQuODYgOS4yN0wxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjOTQ4YzgyIi8+Cjwvc3ZnPgo='
}

const handleBack = () => {
  window.history.back()
}
// 拒绝订单 - 使用真实API
const onRejectOrder = async () => {
  if (!orderData.value?.id) {
    Snackbar.error('Order ID not found')
    return
  }

  if (isRejecting.value) return // 防止重复点击

  try {
    isRejecting.value = true
    
    // 从路由参数或sessionStorage获取uid
    const sessionLoginInfo = sessionStorage.getItem('loginInfo')
    let uid = props.uid
    
    if (!uid && sessionLoginInfo) {
      try {
        const loginInfo = JSON.parse(sessionLoginInfo)
        uid = loginInfo.userId
      } catch (e) {
        console.error('Failed to parse session login info:', e)
      }
    }
    
    if (!uid) {
      Snackbar.error('User ID not found')
      return
    }

    const data = {
      uid: parseInt(uid), // Long 类型 - 用户uid
      withdrawStatus: 2, // Integer 类型 - 2:拒绝
      ticket: props.ticket,
      withdrawRecordId: parseInt(orderData.value.id) // Integer 类型 - 提现记录ID（对应orderId）
    }

    console.log('拒绝订单请求参数:', data)
    console.log('订单数据详情:', orderData.value)
    console.log('FormData 格式提交 - 拒绝订单')
    const response = await AGENCY_WITHDRAWAL_REVIEW(data)
    console.log('提现审核接口返回:', response)
      // 更新订单状态
    if (orderData.value) {
      orderData.value.status = '2'
    }
    Snackbar.success('Order rejected successfully')
  } catch (error) {
    console.error('Failed to reject order:', error)
    Snackbar.error('Failed to reject order')
  } finally {
    isRejecting.value = false
  }
}

const onCancelConfirm = () => {
  showConfirmDialog.value = false
}

// 确认支付 - 使用真实API
const onConfirmPayment = async () => {
  if (!orderData.value?.id) {
    Snackbar.error('Order ID not found')
    return
  }

  // 检查是否上传了支付凭证
  if (uploadedImages.value.length === 0) {
    Snackbar.error('Please upload payment proof first')
    return
  }

  if (isConfirming.value) return // 防止重复点击

  try {
    isConfirming.value = true
    
    // 从路由参数或sessionStorage获取uid
    const routeUid = route.query.uid
    const sessionLoginInfo = sessionStorage.getItem('loginInfo')
    let uid = routeUid
    
    if (!uid && sessionLoginInfo) {
      try {
        const loginInfo = JSON.parse(sessionLoginInfo)
        uid = loginInfo.userId
      } catch (e) {
        console.error('Failed to parse session login info:', e)
      }
    }
    
    if (!uid) {
      Snackbar.error('User ID not found')
      return
    }

    // 准备交易凭证图片数组 - 确保是字符串数组
    const voucherImageList = uploadedImages.value
      .map(img => img.url || img.imageUrl || img.displayUrl)
      .filter(Boolean)

    if (voucherImageList.length === 0) {
      Snackbar.error('Please upload valid payment proof images')
      return
    }

    const data = {
      uid: parseInt(uid), // Long 类型 - 用户uid
      withdrawStatus: 1, // Integer 类型 - 1:同意
      withdrawRecordId: parseInt(orderData.value.id), // Integer 类型 - 提现记录ID（对应orderId）
      voucherImageList // String[] 类型 - 交易凭证图片数组
    }

    console.log('确认支付请求参数:', data)
    console.log('订单数据详情:', orderData.value)
    console.log('图片凭证列表:', voucherImageList)
    console.log('FormData 格式提交 - 确认支付')
    
    const response = await AGENCY_WITHDRAWAL_REVIEW(data)
    console.log('提现审核接口返回:', response)
    showConfirmDialog.value = false
    // 更新订单状态
    if (orderData.value) {
      orderData.value.status = '3'
    }
    Snackbar.success('Payment confirmed successfully')
  } catch (error) {
    console.error('Failed to confirm payment:', error)
    Snackbar.error('Failed to confirm payment')
  } finally {
    isConfirming.value = false
  }
}
</script>

<style lang="less" scoped>
.detail-page {
  background: #F1F1F1;
  width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  padding-bottom: 40px;
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

/* 加载状态 */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;

  p {
    font-size: 16px;
    color: #a29b94;
    margin: 0;
  }
}

/* 状态样式 */
.status-pending {
  color: rgba(255, 201, 0, 1) !important;
}

.status-completed {
  color: rgba(123, 223, 61, 1) !important;
}

.status-declined {
  color: rgba(242, 107, 77, 1) !important;
}

.status-processing {
  color: #1890ff !important;
}

/* 上传区域样式 */
.upload-section {
  margin: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.upload-title {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin: 16px;
  text-align: left;
}

.upload-area {
  display: flex;
  justify-content: flex-start;
}

.upload-input-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
}

.upload-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  border: 2px dashed #e0e0e0;
  border-radius: 2px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #f7cf4a;
    background: #fefefe;
  }
}

.upload-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.upload-text {
  font-size: 12px;
  font-weight: 500;
  color: #222;
  margin: 0;
}

.uploaded-image-preview {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.readonly-image {
  width: 110px;
  height: 110px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  .upload-time {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 8px;
    padding: 2px 4px;
    text-align: center;
    line-height: 1.2;
  }
}

.no-image {
  width: 110px;
  height: 110px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 12px;
    color: #a29b94;
    text-align: center;
  }
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10; /* 确保在最上层 */
}

.uploaded-image-preview:hover .image-overlay {
  opacity: 1;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 77, 79, 0.9);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 11; /* 确保按钮在最上层 */
  pointer-events: auto; /* 确保按钮可以接收点击事件 */

  &:hover {
    background: rgba(255, 77, 79, 1);
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }
}

/* 顶部导航栏 */
.detail-navbar {
  width: 375px;
  height: 125px;
  background: url(https://lanhu-oss-2537-2.lanhuapp.com/SketchPng7b5c5cec6b716719344ff002e51c8f2b25ad5464e2465d6f39bf544de66546e8)
    no-repeat center/cover;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  padding-bottom: 0;
}
.detail-navbar__back {
  position: absolute;
  top: 48px;
  left: 16px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.detail-navbar__title {
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
.detail-navbar__status {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  z-index: 2;
  span {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-right: auto;
  }
  .detail-navbar__icon {
    height: 12px;
    margin-left: 8px;
  }
}

/* 订单状态显示样式 */
.order-completed-status,
.order-rejected-status,
.order-processing-status {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20px 16px;
  box-sizing: border-box;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.order-completed-status {
  .status-icon {
    font-size: 48px;
    color: rgba(123, 223, 61, 1);
  }
  .status-text {
    font-size: 18px;
    font-weight: bold;
    color: rgba(123, 223, 61, 1);
  }
}

.order-rejected-status {
  .status-icon {
    font-size: 48px;
    color: rgba(242, 107, 77, 1);
  }
  .status-text {
    font-size: 18px;
    font-weight: bold;
    color: rgba(242, 107, 77, 1);
  }
}

.order-processing-status {
  .status-icon {
    font-size: 48px;
    color: #1890ff;
  }
  .status-text {
    font-size: 18px;
    font-weight: bold;
    color: #1890ff;
  }
}

/* 订单详情卡片 */
.detail-card {
  background: #fff;
  border-radius: 12px;
  margin: -25px 16px 0 16px;
  padding: 20px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
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
      color: #ffc900;
      line-height: 19px;
      text-align: right;
      font-style: normal;
    }
  }
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.detail-label {
  color: #000;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}
.detail-value-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.detail-value {
  color: #a29b94;
  font-size: 15px;
  white-space: nowrap;
}
.detail-icon {
  width: 12px;
  height: 12px;
}

.channel-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: contain;
}
.detail-row-channel {
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
.detail-divider {
  width: 100%;
  height: 1px;
  background: #ebebeb;
  margin: 8px 0;
}
.detail-row-status {
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.detail-status {
  color: #948c82;
  font-size: 16px;
}
.detail-status-icon {
  width: 24px;
  height: 24px;
}
.detail-status-time {
  color: #948c82;
  font-size: 16px;
}
.foot-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20px 16px;
  box-sizing: border-box;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  & > div {
    flex: 1;
    padding: 14px 0;
    border-radius: 22px;
    font-family: Helvetica, Helvetica;
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    font-style: normal;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .detail-reject-btn {
    background-color: rgba(216, 216, 216, 1);
    color: #a2a2a2;
    &:hover {
      background-color: rgba(200, 200, 200, 1);
    }
  }
  .detail-confirm-btn {
    background: linear-gradient(to bottom, rgba(186, 54, 255, 1), rgba(90, 0, 255, 1));
    color: #FFFFFF;
    &:hover {
      opacity: 0.9;
    }
  }

  // 加载状态样式
  .btn-loading {
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;
  }
}
.confirm-dialog-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-dialog {
  background: #fff;
  border-radius: 16px;
  width: 300px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 24px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .confirm-dialog__content {
    text-align: center;
    margin-bottom: 18px;
    .confirm-dialog__title {
      font-size: 18px;
      font-weight: bold;
      color: #222;
      margin-bottom: 10px;
    }
    .confirm-dialog__message {
      font-size: 15px;
      color: #443213;
      line-height: 22px;
    }
  }
  .confirm-dialog__actions {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 8px;
    button {
      flex: 1;
      height: 44px;
      border-radius: 22px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      border: none;
      transition: background 0.2s;
      text-align: center;
      font-family: Helvetica, Helvetica;
      line-height: 17px;
    }
    .confirm-dialog__cancel {
      background-color: rgba(216, 216, 216, 1);
      color: #a2a2a2;
      margin-right: 8px;
      &:hover {
        background-color: rgba(200, 200, 200, 1);
      }
    }
    .confirm-dialog__confirm {
      background: linear-gradient(to bottom, rgba(186, 54, 255, 1), rgba(90, 0, 255, 1));
      color: #FFFFFF;
      margin-left: 8px;
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
