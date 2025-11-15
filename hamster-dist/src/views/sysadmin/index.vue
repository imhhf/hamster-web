<template>
    <div class="index">
        <div class="top">
            <img class="back" src="../../assets/img/sysadmin/icon-back.png" alt="">
            <p class="top-title">Admin Center</p>
        </div>
        <div class="user f">
            <div class="left">
                <img class="user-img" src="@/assets/img/sysadmin/icon-room.png" alt="">
            </div>
            <div class="right">
                <p>namename</p>
                <div class="box f">
                    <img src="@/assets/img/sysadmin/icon-room.png" alt="">
                    <img src="@/assets/img/sysadmin/icon-room.png" alt="">
                </div>
            </div>
        </div>

        <div class="num-box f-c">
            <div class="box f">
                <div class="li" v-for="(item, index) in 3" :key="index">
                    <p class="p1">999</p>
                    <p class="p2">BD</p>
                </div>
            </div>
        </div>

        <p class="lable-title">User Management</p>
        <div class="page-list">
            <div class="li f-s" @click="$router.push('/sysadmin/userInformation?lang=en')">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-infomation.png" alt="">
                    <span>User Information</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
            <div class="li f-s" @click="$router.push('/sysadmin/banList?lang=en')">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-banList.png" alt="">
                    <span>User ban list</span>
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

        <p class="lable-title">Room Management</p>
        <div class="page-list">
            <div class="li f-s" @click="$router.push('/sysadmin/roomInformation?lang=en')">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-room.png" alt="">
                    <span>Room information</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
        </div>

        <p class="lable-title">BD Management</p>
        <div class="page-list">
            <div class="li f-s">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-createBD.png" alt="">
                    <span>Create BD</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
            <div class="li f-s">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-bdData.png" alt="">
                    <span>BD data</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
        </div>
    </div>

</template>
<style lang="scss" src="./scss/index.scss" scoped></style>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import i18n from '@/i18n/index.js';
// import { OpenUserSpace, OpenRoom, OpengetToke } from "@/utils/client";
import { showToast } from "vant";
// import { GET_StarWeek, GET_StarWeek_top, GET_StarWeek_honorHall } from "@/api/weekActivity";
// import { ramadanUrl, ramadanGiftUrl } from "./js/data"
const { t } = i18n.global;
// import Common from '@/utils/common';
const weekActivityUrl = (name) => {
    return new URL(`../../assets/img/weekActivity/${name}.png`, import.meta.url).href;
};
const weekActivityGiftUrl = (name) => {
    return new URL(`../../assets/img/weekActivity/gifts/${name}.png`, import.meta.url).href;
};
// 接收参数
const props = defineProps(["uid", "ticket", "memberUid"]);
const router = useRouter();
const lang = getLang();

const popLastDay = ref(false)


// 跳转到房间
function toRoom(roomId) {
    OpenRoom(roomId);
}

function toOpengetToke() {
    OpengetToke();
}

// 前往用户中心
function toUser(userId) {
    OpenUserSpace(userId);
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


});
</script>