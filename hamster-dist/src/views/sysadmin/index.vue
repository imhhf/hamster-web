<template>
    <div class="index">
        <div class="top">
            <img @click="AppClose()" class="back" src="../../assets/img/sysadmin/icon-back.png" alt="">
            <p class="top-title">{{ $t('sysadmin.Adm') }}</p>
        </div>
        <div class="user f">
            <div class="left">
                <van-image class="user-img" style="border-radius: 50%" :key="picIdx" :src="info?.avatar" />
            </div>
            <div class="right">
                <p>{{ info?.nick }}</p>
                <div class="box f">
                    <van-image v-if="info?.vipLevelIcon" :key="picIdx" :src="info?.vipLevelIcon" />
                    <van-image v-if="info?.experLevelIcon" :key="picIdx" :src="info?.experLevelIcon" />
                    <van-image v-if="info?.charmLevelIcon" :key="picIdx" :src="info?.charmLevelIcon" />

                </div>
            </div>
        </div>

        <div class="num-box f-c">
            <div class="box f">
                <div class="li">
                    <p class="p1">{{ info?.bdCount }}</p>
                    <p class="p2">{{ $t('sysadmin.BD') }}</p>
                </div>
                <div class="li">
                    <p class="p1">{{ info?.agencyCount }}</p>
                    <p class="p2">{{ $t('sysadmin.Age') }}</p>
                </div>
                <div class="li">
                    <p class="p1">{{ info?.hostCount }}</p>
                    <p class="p2">{{ $t('sysadmin.Host') }}</p>
                </div>
            </div>
        </div>

        <p class="lable-title">{{ $t('sysadmin.Use') }}</p>
        <div class="page-list">
            <div class="li f-s" @click="$router.push(`/sysadmin/userInformation?uid=${props.uid}&lang=en`)">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-infomation.png" alt="">
                    <span>{{ $t('sysadmin.Use1') }}</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
            <div class="li f-s" @click="$router.push(`/sysadmin/banList?uid=${props.uid}&lang=en`)">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-banList.png" alt="">
                    <span>{{ $t('sysadmin.Use2') }}</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
            <div class="li f-s">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-free.png" alt="">
                    <span>Free gift package</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
        </div>

        <p class="lable-title">{{ $t('sysadmin.Roo') }}</p>
        <div class="page-list">
            <div class="li f-s" @click="$router.push(`/sysadmin/roomInformation?uid=${props.uid}&lang=en`)">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-room.png" alt="">
                    <span>{{ $t('sysadmin.Roo3') }}</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
        </div>

        <p class="lable-title">{{ $t('sysadmin.BDM') }}</p>
        <div class="page-list">
            <div class="li f-s" @click="showCreateBD = true">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-createBD.png" alt="">
                    <span>{{ $t('sysadmin.Cre') }}</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
            <div class="li f-s" @click="$router.push(`/sysadmin/dataBD?uid=${props.uid}&lang=en`)">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-bdData.png" alt="">
                    <span>{{ $t('sysadmin.BDd') }}</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
        </div>

        <!-- create BD -->
        <van-popup v-model:show="showCreateBD" position="bottom" round class="showCreateBD">
            <createBD :isUid="props.uid" @success="handleCreateBDSuccess" @close="handleCreateBDClose"></createBD>
        </van-popup>
    </div>

</template>
<style lang="scss" src="./scss/index.scss" scoped></style>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import i18n from '@/i18n/index.js';
// import { OpenUserSpace, OpenRoom, OpengetToke } from "@/utils/client";
import { showToast } from "vant";
import { home } from "@/api/sysadmin";
// import { ramadanUrl, ramadanGiftUrl } from "./js/data"
import createBD from './createBD.vue'
import { getLang } from "@/utils";
import { AppClose } from "@/utils/client";

const { t } = i18n.global;
// import Common from '@/utils/common';

// 接收参数
const props = defineProps(["uid", "ticket", "memberUid"]);
const lang = getLang();

// create BD 
const showCreateBD = ref(false)
// 处理创建BD成功
const handleCreateBDSuccess = (data) => {
  console.log("Create BD success:", data);
  // 关闭弹窗
  showCreateBD.value = false;
  getHome()
  // 可以在这里添加其他成功后的逻辑，比如刷新列表等
};

// 处理关闭弹窗
const handleCreateBDClose = () => {
  showCreateBD.value = false;
};

// 首页
const info = ref()
function getHome() {
    home({
        uid: props.uid,
    })
        .then((data) => {
            info.value = data
            console.log('data==', info.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 单位换算
function setKM(num, decimal = 1) {

    num = Number(num);
    if (isNaN(num)) return 0;
    const k = 1000,
        m = 1000000;
    if (num < k) {
        if (String(num).indexOf('.') != -1) {
            return Number(num).toFixed(decimal);
        } else {
            return num;
        }
    }
    let count = num >= k && num < m ? (((num / k) * 10 ** decimal) | 0) / 10 ** decimal : (((num / m) * 10 ** decimal) | 0) / 10 ** decimal;
    if (Number.isInteger(count)) count = Number(count.toFixed(decimal));
    return num >= k && num < m ? count + 'k' : count + 'M';
}

// xx.xx 时间格式
function myTimeDay(timestamp) {
    const date = new Date(timestamp);
    // 获取月份（0-11，需 +1）并补零
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // 获取日期并补零
    const day = String(date.getDate()).padStart(2, '0');
    // 组合成 "月.日" 格式
    return `${month}.${day}`;
}

onMounted(async () => {
    await getHome()
});
</script>