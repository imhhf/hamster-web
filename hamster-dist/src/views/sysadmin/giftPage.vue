<template>
  <div class="createBD-page">
    <!-- 弹窗头部 -->
    <div class="popup-header">
      <h2 class="popup-title">{{ $t('sysadmin.gift') }}</h2>
      <van-icon class="close-icon" @click="handleClose" />
    </div>

    <div class="nav">
      <p class="lable">{{ $t('sysadmin.user') }}</p>
      <!-- 搜索用户 -->
      <div v-if="!closeOFF" class="inp-box f-s">
        <van-search class="van-search" v-model="searchId" :placeholder="$t('sysadmin.pla')" />
        <van-button v-if="searchId" class="action-btn Search f-c" @click="handleSearch()">
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

      <p class="lable lable2">{{ $t('sysadmin.choose') }}</p>

      <div class="list">
        <div class="li" :class="changIndex === index ? 'click' : ''" v-for="(item, index) in getGiftPackData"
          :key="index" @click="clickChange(index)">
          <div class="left">
            <img :src="item.picUrl" alt="等级图标" />
            <p class="" v-html="item.giftPackName"></p>
          </div>
          <div class="right">
            <img v-if="changIndex === index" src="../../assets/img/sysadmin/icon-yuan-yes.png" alt="" />
            <img v-else src="../../assets/img/sysadmin/icon-yuan.png" alt="" />
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮：仅判断「是否搜索到有效用户」+「是否选中礼包等级」 -->
    <div class="action-buttons">
      <van-button class="action-btn ban-btn" @click="handleBanUser"
        :disabled="!(closeOFF && searchInfo !== null) || changIndex === -1">
        {{ $t('sysadmin.Con') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" src="./scss/giftPage.scss" scoped></style>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { searchUser, GetGiftPack, Send } from "@/api/sysadmin";
import { createThrottleClick } from "@/utils";
import i18n from '@/i18n/index.js';

const { t } = i18n.global;
const props = defineProps(["isUid", "ticket", "memberUid"]);
const emit = defineEmits(["success", "close"]);
const router = useRouter();

// 预加载等级图片
const levelImages = import.meta.glob('../../assets/img/sysadmin/lv*.png', {
  eager: true,
  as: 'url'
});

// 变量定义（删除 banReason，优化初始值）
const searchId = ref("");
const searchInfo = ref(null); // 初始值设为 null，便于判断
const closeOFF = ref(false);
const changIndex = ref(0); // 初始-1表示未选中礼包等级

// 搜索用户
function getSearchUser() {
  searchUser({
    uid: props.isUid,
    erbanNo: searchId.value,
    ticket: props.ticket,
    havePermission: true
  })
    .then((data) => {
      searchInfo.value = data;
      closeOFF.value = !!data; // 有数据才设为true
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 获取礼包
const getGiftPackData = ref()
const getGiftPack = () => {
  GetGiftPack({
    uid: props.isUid,
    ticket: props.ticket,
  }).then((data) => {
    getGiftPackData.value = data;
  })
    .catch((err) => {
      showToast(err.message);
    });
}
// 搜索按钮点击
const handleSearch = () => {
  if (!searchId.value.trim()) {
    showToast(t('sysadmin.plea'));
    return;
  }
  getSearchUser();
};

// 关闭搜索
const clickOff = () => {
  closeOFF.value = false;
  searchInfo.value = null; // 重置搜索结果
};

// 选择礼包等级
const clickChange = (ind) => {
  changIndex.value = ind;
};

// 关闭弹窗
const handleClose = () => {
  emit("close");
};


// 赠送礼包
const getSend = () => {
  console.log(searchInfo.value, 'searchInfo.value');
  console.log(getGiftPackData.value, 'getGiftPackData.value');
  Send({
    uid: props.isUid,
    ticket: props.ticket,
    targetUid: searchInfo.value?.uid,
    giftPackId: getGiftPackData.value[changIndex.value]?.giftPackId
  }).then((data) => {
    showToast(t('sysadmin.succ'))
    handleClose()
  })
    .catch((err) => {
      showToast(err.message);
    });
}

// 节流处理绑定按钮点击
const handleBanUser = createThrottleClick(() => {
  getSend();
});

onMounted(() => {
  // 初始化代码
  getGiftPack()
});
</script>