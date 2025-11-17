<template>
  <div class="information-page">
    <div class="top">
      <img class="back" src="../../assets/img/sysadmin/icon-back.png" alt="" @click="goBack" />
      <p class="top-title">User ban list</p>
    </div>

    <div class="search-section">
      <div class="search-container">
        <van-search class="van-search" @clear="clearApi" v-model="searchId" placeholder="Enter the user ID" />
        <button class="search-btn" @click="handleSearch">Search</button>
      </div>
    </div>

    <div class="user-list-container">
      <template v-if="userBanList?.length > 0 && !isSearch">
        <div class="user-item" v-for="(user, index) in userBanList" :key="user.id"
          :class="{ active: selectedUserId === user.id }">
          <div class="user-info-box f">
            <img class="img" :src="user.avatar" alt="" />

            <div class="user-info">
              <div class="username f">
                <div class="name">{{ user.nick }}</div>
                <img class="ex" v-if="user?.gender === 1" src="../../assets/img/sysadmin/ixon-ex.png" alt="" />
                <img class="ex" v-else src="../../assets/img/sysadmin/ixon-ex.png" alt="" />
                <img class="count" :src="user?.countryNationalFlag" alt="" />
              </div>
              <p class="user-id">ID:{{ user.erbanNo }}</p>
            </div>
          </div>

          <div class="user-actions">
            <p class="banned" :class="user.blockStatus === 1 ? '' : 'Unblocked'">
              {{ user.blockStatus === 1 ? "Banned" : "Unblocked" }}
            </p>
            <div class="view f" @click="popShowBanInformation(index)">
              View<img class="ex" src="../../assets/img/sysadmin/icon-right.png" alt="" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="user-item">
          <div class="user-info-box f">
            <img class="img" :src="searchInfo?.avatar" alt="" />

            <div class="user-info">
              <div class="username f">
                <div class="name">{{ searchInfo?.nick }}</div>
                <img class="ex" v-if="searchInfo?.gender === 1" src="../../assets/img/sysadmin/ixon-ex.png" alt="" />
                <img class="ex" v-else src="../../assets/img/sysadmin/ixon-ex.png" alt="" />
                <img class="count" :src="searchInfo?.countryNationalFlag" alt="" />
              </div>
              <p class="user-id">ID:{{ searchInfo?.erbanNo }}</p>
            </div>
          </div>
          <div class="user-actions">
            <p class="banned" :class="searchInfo?.blockStatus === 1 ? '' : 'Unblocked'">
              {{ searchInfo?.blockStatus === 1 ? "Banned" : "Unblocked" }}
            </p>
            <div class="view f" @click="popShowBanInformation(index)">
              View<img class="ex" src="../../assets/img/sysadmin/icon-right.png" alt="" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 没有数据 -->
    <div class="none-data" v-if="
      (userBanList?.length < 0 && !isSearch) ||
      (searchInfo === null && isSearch)
    ">
      <img src="../../assets/img/sysadmin/none.png" alt="" />
      <p>No Data</p>
    </div>

    <!-- 用户信息弹窗 -->
    <van-popup v-model:show="showBanInformation" position="bottom" round class="showBanInformation">
      <div class="popup-container">
        <!-- 弹窗头部 -->
        <div class="popup-header">
          <h2 class="popup-title">Ban information</h2>
          <van-icon class="close-icon" @click="showBanInformation = false" />
        </div>
        <div class="ban-box">
          <!-- 用户基本信息 -->
          <div class="user-basic-info">
            <div class="avatar-section">
              <div class="avatar-container">
                <img :src="banInfo[banIndex].avatar" alt="User Avatar" class="user-avatar" />
              </div>
            </div>
            <div class="user-details">
              <h3 class="username">{{ banInfo[banIndex].nick }}</h3>
              <p class="user-id">ID:{{ banInfo[banIndex].erbanNo }}</p>
            </div>
            <div class="right">
              Ban time: {{ myTimeDay(banInfo[banIndex].blockStartTime) }}
            </div>
          </div>

          <div class="ban-tit">Ban time</div>
          <div class="day">{{ banInfo[banIndex].blockTime }}</div>

          <div class="ban-tit">Reason for ban</div>
          <div class="tit">
            {{ banInfo[banIndex].blockDesc }}
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <van-button class="action-btn ban-btn" @click="handleBanUser" :disabled="!banReason.trim()">
            Unblock this User
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 解封弹窗 -->
    <van-popup v-model:show="showUnBlock" round class="showChangeAvatar">
      <p class="pop-tit">Unblock this user</p>
      <p class="tips">Whether to confirm the unblocking of this user?</p>
      <!-- 操作按钮区域 -->
      <div class="action-buttons f-c">
        <van-button class="action-btn Cancle f-c" @click="showUnBlock = false">
          Cancle
        </van-button>
        <van-button class="action-btn Confirm f-c" @click="handleChangeName">
          Confirm
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<style lang="scss" src="./scss/banList.scss" scoped></style>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { GetUserBanList, GetBanInfo, searchUser } from "@/api/sysadmin";
const props = defineProps(["uid", "ticket", "memberUid"]);

// xx.xx.xx 时间格式
function myTimeDay(timestamp) {
  const date = new Date(timestamp);
  // 获取年份
  const year = date.getFullYear();
  // 获取月份（0-11，需 +1）并补零
  const month = String(date.getMonth() + 1).padStart(2, "0");
  // 获取日期并补零
  const day = String(date.getDate()).padStart(2, "0");
  // 组合成 "年.月.日" 格式
  return `${year}.${month}.${day}`;
}

const router = useRouter();

// 封禁用户弹窗
const showBanInformation = ref(false);
// 解封状态
const showUnBlock = ref(false);

// 搜索的用户ID
const searchId = ref("");
// 当前选中的用户ID
const selectedUserId = ref("");

const userBanList = ref();
// 封禁记录
function getUserBanList(targetUid) {
  GetUserBanList({
    uid: props.uid,
    pageNum: 1,
    pageSize: 50,
  })
    .then((data) => {
      userBanList.value = data;
    })
    .catch((err) => {
      //   loading.value = false;
      showToast(err.message);
    });
}

// 封禁记录详情
const banInfo = ref();
function getBanInfo(targetUid) {
  GetBanInfo({
    uid: props.uid,
    blockId: isSearch.value ? searchInfo.value.blockId : userBanList.value[banIndex.value].blockId,
  })
    .then((data) => {
      banInfo.value = data;
    })
    .catch((err) => {
      //   loading.value = false;
      showToast(err.message);
    });
}

const banIndex = ref();
const popShowBanInformation = (ind) => {
  banIndex.value = ind;
  showBanInformation.value = true;
  getBanInfo();
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 搜索用户
const searchInfo = ref()
function getSearchUser() {
  searchUser({
    uid: props.uid,
    erbanNo: searchId.value
  })
    .then((data) => {
      searchInfo.value = data
      console.log('data==', searchInfo.value);
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 搜索用户
const isSearch = ref(false);
const handleSearch = () => {
  if (!searchId.value.trim()) {
    showToast("Please enter user ID");
    return;
  }
  isSearch.value = true;
  getSearchUser();
};

// 封禁原因
const banReason = ref("");

onMounted(() => {
  // 初始化代码
  getUserBanList();
});
</script>
