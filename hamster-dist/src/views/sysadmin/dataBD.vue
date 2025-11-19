<template>
  <div class="information-page">
    <div class="top">
      <img
        class="back"
        src="../../assets/img/sysadmin/icon-back.png"
        alt=""
        @click="goBack"
      />
      <p class="top-title">BD data</p>
    </div>

    <div class="search-section">
      <div class="search-container">
        <van-search
          class="van-search"
          @clear="clearApi"
          v-model="searchId"
          placeholder="Enter the user ID"
        />
        <button class="search-btn" @click="handleSearch">Search</button>
      </div>
    </div>

    <div
      class="user-list-container"
      v-if="isSearch !== null && bdList?.length > 0 && !isSearch"
    >
      <div
        class="user-item"
        v-for="(user, index) in bdList"
        :key="user.id"
        :class="{ active: selectedUserId === user.id }"
      >
        <div class="user-info-box f">
          <img class="img" :src="user?.avatar" alt="" />

          <div class="user-info">
            <div class="username f">
              <div class="name">{{ user?.nick }}</div>
              <img
                class="ex"
                v-if="user?.gender === 1"
                src="../../assets/img/sysadmin/ixon-ex.png"
                alt=""
              />
              <img
                class="ex"
                v-else
                src="../../assets/img/sysadmin/ixon-ex.png"
                alt=""
              />
              <img class="count" :src="user?.countryNationalFlag" alt="" />
            </div>
            <p class="user-id">ID:{{ user.erbanNo }}</p>
          </div>
        </div>

        <div class="user-actions">
          <div class="view f" @click="popShowBanInformation(index)">
            View<img
              class="ex"
              src="../../assets/img/sysadmin/icon-right.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <!-- <template v-if="isSearch !==null  && bdList?.length > 0 && bdList">
        <div class="user-item">
          <div class="user-info-box f">
            <img class="img" :src="bdList?.avatar" alt="" />
            <div class="user-info">
              <div class="username f">
                <div class="name">{{ bdList?.nick }}</div>
                <img
                  class="ex"
                  v-if="bdList?.gender === 1"
                  src="../../assets/img/sysadmin/ixon-ex.png"
                  alt=""
                />
                <img
                  class="ex"
                  v-else
                  src="../../assets/img/sysadmin/ixon-ex.png"
                  alt=""
                />
                <img class="count" :src="bdList?.countryNationalFlag" alt="" />
              </div>
              <p class="user-id">ID:{{ bdList?.erbanNo }}</p>
            </div>
          </div>
          <div class="user-actions">
            <div class="view f" @click="popShowBanInformation(0)">
              View<img
                class="ex"
                src="../../assets/img/sysadmin/icon-right.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </template> -->
    </div>
    <!-- 没有数据 -->
    <div
      class="none-data"
      v-if="((isSearch === null?.length) === 0 && !isSearch) || isSearch"
    >
      <img src="../../assets/img/sysadmin/none.png" alt="" />
      <p>No Data</p>
    </div>

    <!-- 用户信息弹窗 -->
    <van-popup
      v-model:show="showBanInformation"
      position="bottom"
      round
      class="showBanInformation"
    >
      <div class="popup-container">
        <!-- 弹窗头部 -->
        <div class="popup-header">
          <h2 class="popup-title">User information</h2>
          <van-icon class="close-icon" @click="showBanInformation = false" />
        </div>
        <div class="ban-box">
          <!-- 用户基本信息 -->
          <div class="user-basic-info">
            <div class="avatar-section">
              <div class="avatar-container">
                <img
                  :src="bdData?.avatar"
                  alt="User Avatar"
                  class="user-avatar"
                />
              </div>
            </div>
            <div class="user-details">
              <h3 class="username">{{ bdData?.nick }}</h3>
              <p class="user-id">ID:{{ bdData?.erbanNo }}</p>
            </div>
            <!-- 原生下拉框（无 Vant 依赖） -->
            <div class="right f">
              <select
                class="native-month-dropdown"
                v-model="selectedMonth"
                @change="handleMonthChange"
              >
                <option
                  v-for="option in monthOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <!-- <img src="../../assets/img/sysadmin/icon-up2.png" alt="" /> -->
            </div>
          </div>

          <div class="cell f-s">
            <div class="left">Total agency</div>
            <div class="right">{{ bdData?.totalAgencyCount }}</div>
          </div>
          <div class="cell f-s">
            <div class="left">New agency</div>
            <div class="right">{{ bdData?.newAgencyCount }}</div>
          </div>
          <div class="cell f-s">
            <div class="left">Agency income</div>
            <div class="right color f">
              <img
                class="ex"
                src="../../assets/img/sysadmin/icon-coins.png"
                alt=""
              />
              {{ bdData?.agencyIncome }}
            </div>
          </div>
          <div class="cell f-s">
            <div class="left">Creation time</div>
            <div class="right">{{ myTimeDay(bdData?.bdBindTime) }}</div>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="action-buttons">
          <van-button class="action-btn ban-btn" @click="handleRemove">
            Remove BD
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 解封弹窗 -->
    <van-popup v-model:show="showUnBlock" round class="showChangeAvatar">
      <p class="pop-tit">Remove BD</p>
      <p class="tips">Are you sure you want to remove BD?</p>
      <!-- 操作按钮区域 -->
      <div class="action-buttons f-c">
        <van-button class="action-btn Cancle f-c" @click="showUnBlock = false">
          Cancle
        </van-button>
        <van-button class="action-btn Confirm f-c" @click="handleChange">
          Confirm
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<style lang="scss" src="./scss/dataBD.scss" scoped></style>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// 仅保留必要的 Vant 组件（弹窗、提示、图标），下拉框用原生
import { showToast } from "vant";

import { searchUser, GetBdList, GetBdData, UnBindBd } from "@/api/sysadmin";
const props = defineProps(["uid", "ticket", "memberUid"]);

const router = useRouter();

// 封禁用户弹窗
const showBanInformation = ref(false);
// 解封状态
const showUnBlock = ref(false);

// 返回上一页
const goBack = () => {
  router.back();
};

// 搜索的用户ID
const searchId = ref("");
// 当前选中的用户ID
const selectedUserId = ref("");

// 搜索用户
const isSearch = ref(false);
const handleSearch = () => {
  if (!searchId.value.trim()) {
    showToast("Please enter user ID");
    return;
  }
  isSearch.value = true;
  getBdList(searchId.value);
};

const banIndex = ref(0);
const popShowBanInformation = (ind) => {
  banIndex.value = ind;
  if (bdList.value !== null) showBanInformation.value = true;
  getBdData();
};

// bd列表
const bdList = ref([]);
function getBdList(getBdListId) {
  GetBdList({
    uid: props.uid,
    searchKey: getBdListId,
    pageNum: 1,
    pageSize: 50,
  })
    .then((data) => {
      bdList.value = data || [];
      console.log("bd list data==", bdList.value);
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// bg数据
const bdData = ref({});
// 月份相关数据
const selectedMonth = ref("");
const monthOptions = ref([]);

// 初始化近6个月下拉选项
// 初始化近6个月下拉选项
function initMonthOptions() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const options = [];

  // 生成近6个月（包含当前月）
  for (let i = 0; i < 6; i++) {
    let year = currentYear;
    let month = currentMonth - i;

    // 跨年处理
    if (month < 1) {
      year--;
      month += 12;
    }

    // 格式化为 YYYYMM（纯数字，月份补零）
    const monthValue = parseInt(`${year}${String(month).padStart(2, "0")}`);
    // 显示格式保持 YYYY/MM 以便用户阅读
    const displayLabel = `${year}/${String(month).padStart(2, "0")}`;

    options.push({ label: displayLabel, value: monthValue });
  }

  monthOptions.value = options;
  selectedMonth.value = options[0].value; // 默认当前月
}

// 原生下拉框change事件
function handleMonthChange() {
  getBdData(); // 切换月份刷新数据
}

// 使用选中的月份作为参数
function getBdData() {
  const targetBdUid = isSearch.value
    ? bdList.value?.uid
    : bdList.value[banIndex.value]?.uid;

  if (!targetBdUid) {
    showToast("User ID not found");
    return;
  }
  console.log("selectedMonth==", selectedMonth.value);
  GetBdData({
    uid: props.uid,
    bdUid: targetBdUid,
    timeMonth: selectedMonth.value, // 下拉选中的月份
  })
    .then((data) => {
      bdData.value = data || {};
      console.log("bd detail data==", bdData.value);
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 移除bd
const handleRemove = () => {
  showUnBlock.value = true;
};

// 移除二次确认
const handleChange = () => {
  const targetBdUid = isSearch.value
    ? bdList.value?.uid
    : bdList.value[banIndex.value]?.uid;

  if (!targetBdUid) {
    showToast("User ID not found");
    showUnBlock.value = false;
    return;
  }

  UnBindBd({
    uid: props.uid,
    bdUid: targetBdUid,
  })
    .then(() => {
      showToast("Remove successfully");
      showBanInformation.value = false;
      showUnBlock.value = false;
      getBdList(null); // 移除后刷新列表
    })
    .catch((err) => {
      showToast(err.message);
    });
};

// 清除搜索
const clearApi = () => {
  searchId.value = "";
  isSearch.value = false;
  //   bdList.value = null;
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
  getBdList(null);
  initMonthOptions(); // 初始化月份下拉框
});
</script>
