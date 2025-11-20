<template>
  <div class="createBD-page">
    <!-- 弹窗头部 -->
    <div class="popup-header">
      <h2 class="popup-title">{{ $t('sysadmin.crea') }}</h2>
      <van-icon class="close-icon" @click="handleClose" />
    </div>

    <!-- 公会信息 -->
    <template v-if="props.clickCreate === 2">
      <div class="ban-box">
        <!-- 用户基本信息 -->
        <div class="user-basic-info">
          <div class="avatar-section">
            <div class="avatar-container">
              <img :src="agencyData?.coverPicUrl" alt="User Avatar" class="user-avatar">
            </div>
          </div>
          <div class="user-details">
            <h3 class="username">{{ agencyData?.guildName }}</h3>
            <p class="user-id">ID:{{ agencyData?.guildNo }}</p>
          </div>
        </div>

        <div class="cell f-s">
          <div class="left">{{ $t('sysadmin.agency') }}</div>
          <div class="right">{{ agencyData?.founderNick }}</div>
        </div>
        <div class="cell f-s">
          <div class="left">{{ $t('sysadmin.host') }}</div>
          <div class="right">{{ agencyData?.host }}</div>
        </div>
        <div class="cell f-s">
          <div class="left">{{ $t('sysadmin.income') }}</div>
          <div class="right color f-c">
            <img src="../../assets/img/sysadmin/icon-coins.png" alt="" />
            {{ agencyData?.income }}
          </div>
        </div>
        <div class="cell f-s">
          <div class="left">{{ $t('sysadmin.time') }}</div>
          <div class="right ">
            <span>{{ myTimeDay(agencyData?.createTime) }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 创建公会 -->
    <template v-else>
      <div class="nav">
        <p class="lable">{{ $t('sysadmin.angId') }}</p>
        <!-- 搜索用户 -->
        <div v-if="!closeOFF" class="inp-box f-s">
          <van-search class="van-search" v-model="searchId" :placeholder="$t('sysadmin.Sea21')" />
          <van-button class="action-btn Search f-c" @click="handleSearch()">
            {{ $t('sysadmin.Sea') }}
          </van-button>
        </div>
        <!-- 有搜索用户 -->
        <div v-if="closeOFF && searchInfo !== null" class="user-box f-s">
          <div class="user-basic-info">
            <div class="avatar-section">
              <div class="avatar-container">
                <img :src="searchInfo?.avatar" alt="User Avatar" class="user-avatar" />
              </div>
            </div>
            <div class="user-details">
              <h3 class="username">{{ searchInfo?.nick }}</h3>
              <p class="user-id">ID:{{ searchInfo?.erbanNo }}</p>
            </div>
          </div>
          <img @click="clickOff" class="right" src="../../assets/img/sysadmin/off.png" alt="" />
        </div>

        <p class="lable lable2">{{ $t('sysadmin.angName') }}</p>
        <div class="reason-input-container">
          <textarea v-model="banReason" class="reason-input" :placeholder="$t('sysadmin.please')" maxlength="30"
            rows="3"></textarea>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button class="action-btn ban-btn" @click="handleBanUser" :disabled="!banReason.trim()">
          {{ $t('sysadmin.Create') }}
        </van-button>
      </div>
    </template>
  </div>
</template>
<style lang="scss" src="./scss/createBD.scss" scoped></style>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits, nextTick } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { searchUser, CreateAgency, AgencyData } from "@/api/bdCenter";
import i18n from '@/i18n/index.js';
const { t } = i18n.global;

const props = defineProps(["isUid", "ticket", "guildId", "selectedMonth", "clickCreate"]);
// 定义发射事件
const emit = defineEmits(["success", "close"]);
const router = useRouter();

console.log('子组件接收到的参数:', {
  guildId: props.guildId,
  selectedMonth: props.selectedMonth,
  clickCreate: props.clickCreate
});

// 搜索的用户ID
const searchId = ref("");
// 当前选中的用户ID
const selectedUserId = ref("");
// 搜索用户
const searchInfo = ref();

// 封禁用户弹窗
const showBanInformation = ref(false);
// 解封状态
const showUnBlock = ref(false);

function getSearchUser() {
  searchUser({
    uid: props.isUid,
    erbanNo: searchId.value,
  })
    .then((data) => {
      searchInfo.value = data;
      if (data !== null) {
        closeOFF.value = true
      }
      console.log("搜索用户结果:", data);
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 搜索用户
const handleSearch = () => {
  if (!searchId.value.trim()) {
    showToast(t('sysadmin.plea'));
    return;
  }
  getSearchUser();
};

// 关闭搜索
const closeOFF = ref(false);
const clickOff = () => {
  closeOFF.value = false;
};

// 返回上一页
const goBack = () => {
  router.back();
};

const banReason = ref("");

// 绑定
const getBindBd = () => {
  CreateAgency({
    uid: props.isUid,
    agencyUid: searchInfo.value?.uid,
    guildName: banReason.value
  })
    .then((data) => {
      searchInfo.value = data;
      closeOFF.value = false;
      banReason.value = "";
      showToast(t('sysadmin.succ'));

      setTimeout(() => {
        // 成功时发射事件
        emit("success", data);
      }, 1000);

      console.log("创建公会成功:", data);
    })
    .catch((err) => {
      showToast(err.message);
    });
};

// 工会数据
const agencyData = ref()

const getAgencyData = () => {
  // 添加参数验证
  if (!props.guildId || !props.selectedMonth) {
    console.warn('缺少必要参数:', {
      guildId: props.guildId,
      selectedMonth: props.selectedMonth
    });
    return;
  }

  console.log('请求公会数据参数:', {
    uid: props.isUid,
    guildId: props.guildId,
    timeMonth: props.selectedMonth
  });

  AgencyData({
    uid: props.isUid,
    guildId: props.guildId,
    timeMonth: props.selectedMonth
  })
    .then((data) => {
      agencyData.value = data;
      console.log('公会数据加载成功:', data);
    })
    .catch((err) => {
      console.error('加载公会数据失败:', err);
      showToast(err.message);
    });
};

// 监听 props 变化，当 guildId 或 selectedMonth 变化时重新获取数据
watch(
  [() => props.guildId, () => props.selectedMonth, () => props.clickCreate],
  ([newGuildId, newSelectedMonth, newClickCreate], [oldGuildId, oldSelectedMonth, oldClickCreate]) => {
    console.log('子组件props变化:', {
      guildId: { old: oldGuildId, new: newGuildId },
      selectedMonth: { old: oldSelectedMonth, new: newSelectedMonth },
      clickCreate: { old: oldClickCreate, new: newClickCreate }
    });

    // 只有当点击类型为2（查看公会数据）且相关参数有变化时才重新获取数据
    if (newClickCreate === 2 && newGuildId && newSelectedMonth) {
      // 使用nextTick确保DOM更新完成后再获取数据
      nextTick(() => {
        getAgencyData();
      });
    }
  },
  { immediate: true }
);

// 关闭弹窗
const handleClose = () => {
  emit("close");
};

const handleBanUser = () => {
  getBindBd();
};

// 年.月.日 时间格式
function myTimeDay(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

onMounted(() => {
  console.log('子组件挂载完成，当前props:', {
    guildId: props.guildId,
    selectedMonth: props.selectedMonth,
    clickCreate: props.clickCreate
  });

  if (props.clickCreate === 2 && props.guildId && props.selectedMonth) {
    // 组件挂载时获取数据
    getAgencyData();
  }
});
</script>