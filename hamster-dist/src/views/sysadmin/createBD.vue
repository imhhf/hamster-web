<template>
  <div class="createBD-page">
    <!-- 弹窗头部 -->
    <div class="popup-header">
      <h2 class="popup-title">Create BD</h2>
      <van-icon class="close-icon" @click="handleClose" />
    </div>

    <div class="nav">
      <p class="lable">Please check the user ID</p>
      <!-- 搜索用户 -->
      <div v-if="!closeOFF" class="inp-box f-s">
        <van-search class="van-search" v-model="searchId" placeholder="Search user ID" />
        <van-button class="action-btn Search f-c" @click="handleSearch()">
          Search
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

      <p class="lable lable2">WhatsApp</p>
      <div class="reason-input-container">
        <textarea v-model="banReason" class="reason-input" placeholder="Please enter the WhatsApp" maxlength="30"
          rows="3"></textarea>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <van-button class="action-btn ban-btn" @click="handleBanUser" :disabled="!banReason.trim()">
        Create BD
      </van-button>
    </div>
  </div>
</template>
<style lang="scss" src="./scss/createBD.scss" scoped></style>

<script setup>
import { ref, onMounted, reactive, computed, defineProps } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { searchUser, BindBd } from "@/api/sysadmin";
const props = defineProps(["isUid", "ticket", "memberUid"]);
// 定义发射事件
const emit = defineEmits(["success", "close"]);
const router = useRouter();

// 封禁用户弹窗
const showBanInformation = ref(false);
// 解封状态
const showUnBlock = ref(false);

// 搜索的用户ID
const searchId = ref("");
// 当前选中的用户ID
const selectedUserId = ref("");
// 搜索用户
const searchInfo = ref();
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
      console.log("data==", data !== null);
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 搜索用户
const handleSearch = () => {
  if (!searchId.value.trim()) {
    showToast("Please enter user ID");
    return;
  }
  // closeOFF.value = true;
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
  BindBd({
    uid: props.isUid,
    bdUid: searchInfo.value?.uid,
    whatsApp: banReason.value,
  })
    .then((data) => {
      searchInfo.value = data;
      closeOFF.value = false;
      banReason.value = "";
      showToast('Change successful');

      setTimeout(() => {
        // 成功时发射事件
        emit("success", data);
      }, 1000);

      console.log("data==", searchInfo.value);
    })
    .catch((err) => {
      showToast(err.message);
    });
};
// 关闭弹窗
const handleClose = () => {
  emit("close");
};

const handleBanUser = () => {
  getBindBd();
};

onMounted(() => {
  // 初始化代码
});
</script>
