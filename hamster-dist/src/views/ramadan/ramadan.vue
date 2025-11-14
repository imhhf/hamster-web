<template>
    <div class="ramadan" :class="isTabe === 1 ? 'rank1' : ''">
        <div class="banner" @click="OpengetToke()">

        </div>
        <div class="top">
            <div class="title">{{ $t("ramadan.Act") }}</div>
            <div class="tips">{{ $t('ramadan.Wis') }}</div>
            <div class="list">
                <div class="giftBox" v-for="(item, index) in 3" :key="index">
                    <img :src="ramadanGiftUrl('rew' + (index + 1))" alt="">
                    <p>{{ index === 0 ? 1000 : index === 1 ? 9999 : 3999 }}</p>
                </div>
            </div>
        </div>

        <van-count-down class="countdown al-center" :time="outTime - timestamp">
            <template #default="timeData">
                <span class="time days">{{
                    timeData.days > 9 ? timeData.days : "0" + timeData.days
                }}</span>
                <span class="colon">D</span>
                <span class="time hours">{{
                    timeData.hours > 9 ? timeData.hours : "0" + timeData.hours
                }}</span>
                <span class="colon">:</span>
                <span class="time minutes">{{
                    timeData.minutes > 9 ? timeData.minutes : "0" + timeData.minutes
                }}</span>
                <span class="colon">:</span>
                <span class="time seconds">{{
                    timeData.seconds > 9 ? timeData.seconds : "0" + timeData.seconds
                }}</span>
                <!-- <span class="colon">s</span> -->
            </template>
        </van-count-down>

        <div class="tabs">
            <div class="btnBox" @click="clickTab(0)" :class="isTabe === 0 ? 'tab-show' : ''">
                <span>{{ $t('ramadan.Cha') }}</span>
            </div>
            <div class="btnBox" @click="clickTab(1)" :class="isTabe === 1 ? 'tab-show' : ''">
                <span>{{ $t('ramadan.Ran') }}</span>
            </div>
            <div class="btnBox" @click="clickTab(2)" :class="isTabe === 2 ? 'tab-show' : ''">
                <span>{{ $t('ramadan.Rew') }}</span>
            </div>
        </div>

        <div class="tabs2">
            <div class="btnBox" @click="clickTab2(0)" :class="isTabe2 === 0 ? 'tab-show' : ''">
                <span>{{ isTabe === 0 ? $t('ramadan.Cha1') : isTabe === 1 ? $t('ramadan.Roo') : $t('ramadan.Roo')
                    }}</span>
            </div>
            <div class="btnBox" @click="clickTab2(1)" :class="isTabe2 === 1 ? 'tab-show' : ''">
                <span>{{ isTabe === 0 ? $t('ramadan.Dai') : isTabe === 1 ? $t('ramadan.Gif') : $t('ramadan.Gif')
                }}</span>
            </div>
        </div>

        <template v-if="isTabe === 0">
            <!-- 任务 -->
            <template v-if="isTabe2 === 0">
                <div class="task-list">
                    <div class="li" v-for="(item, index) in task" :key="index">
                        <div class="tit">{{ $t('ramadan.Sen', [item.gearValue]) }}</div>
                        <div class="tips">
                            <span>{{ item.currentValue }}</span>/{{ item.gearValue }}
                        </div>
                        <div class="gift-list">
                            <div class="giftBox" :class="taskList[index].gifts.length > 2 ? 'giftBox-long' : ''"
                                v-for="(it, ind) in taskList[index].gifts" :key="ind">
                                <img :src="it.img" alt="">
                                <p>{{ it.day }}</p>
                            </div>
                        </div>
                        <div class="btnBox" @click="item.gearStatus === 1 ? getChallengeRecive(item.gear) : ''"
                            :class="item.gearStatus !== 1 ? 'filter' : ''">
                            <span>{{ item.gearStatus === 2 ? $t('ramadan.Cla') : $t('ramadan.Go') }}</span>
                        </div>
                    </div>
                </div>

            </template>
            <!-- 签到 -->
            <template v-else>
                <div class="sign-box">
                    <div class="sign">
                        <div class="sign-list">
                            <img class="img" v-for="(item, index) in 6" :key="index"
                                :class="checkTask?.rechargeDays <= index ? 'filter' : ''"
                                src="../../assets/img/ramadan/icon-deng.png" alt="">

                            <img :class="checkTask?.rechargeDays < 7 ? 'filter' : ''" class="img img2"
                                src="../../assets/img/ramadan/icon-deng7.png" alt="">

                        </div>
                    </div>
                    <div class="task-list">
                        <div class="li">
                            <div class="tit">{{ $t('ramadan.Rew') }}</div>
                            <div class="tips">
                                <span>{{ checkTask?.rechargeDays ? checkTask?.rechargeDays : 0 }}</span>/7
                            </div>
                            <div class="gift-list">
                                <div class="giftBox">
                                    <img src="../../assets/img/ramadan/gifts/deng.png" alt="">
                                    <p>{{ $t('ramadan.Permanent') }}*1</p>
                                </div>
                            </div>
                            <p class="float">{{ $t('ramadan.flo') }}</p>
                        </div>
                    </div>
                </div>
            </template>
        </template>

        <!-- 榜单 -->
        <template v-else-if="isTabe === 1">

            <div class="rank">
                <div class="top-list">
                    <div class="li li0">
                        <div class="img"
                            @click="isTabe2 === 0 ? toRoom(userRank?.rankList[0]?.roomId) : toUser(userRank?.rankList[0]?.uid)">
                            <img :src="userRank?.rankList[0]?.avatar" alt="">
                        </div>
                        <div class="num-box">
                            {{ setKM(userRank?.rankList[0]?.totalScore) }}
                        </div>
                        <!-- {{ userRank?.rankList[0].title }} -->
                        <div class="name"><van-notice-bar class="user-name"
                                :text="isTabe2 === 0 ? userRank?.rankList[0]?.title : userRank?.rankList[0]?.nick"
                                :speed="20" />
                        </div>
                        <div class="num">
                            ID:{{ isTabe2 === 0 ? userRank?.rankList[0]?.roomNo : userRank?.rankList[0]?.erbanNo }}
                        </div>
                    </div>
                    <div class="li li1">
                        <div class="img"
                            @click="isTabe2 === 0 ? toRoom(userRank?.rankList[1]?.roomId) : toUser(userRank?.rankList[1]?.uid)">
                            <img :src="userRank?.rankList[1]?.avatar" alt="">
                        </div>
                        <div class="num-box">
                            {{ setKM(userRank?.rankList[1]?.totalScore) }}
                        </div>
                        <div class="name"><van-notice-bar class="user-name"
                                :text="isTabe2 === 0 ? userRank?.rankList[1]?.title : userRank?.rankList[1]?.nick"
                                :speed="20" />
                        </div>
                        <div class="num">
                            ID:{{ isTabe2 === 0 ? userRank?.rankList[1]?.roomNo : userRank?.rankList[1]?.erbanNo }}
                        </div>
                    </div>
                    <div class="li li2">
                        <div class="img"
                            @click="isTabe2 === 0 ? toRoom(userRank?.rankList[2]?.roomId) : toUser(userRank?.rankList[2]?.uid)">
                            <img :src="userRank?.rankList[2]?.avatar" alt="">
                        </div>
                        <div class="num-box">
                            {{ setKM(userRank?.rankList[2]?.totalScore) }}
                        </div>
                        <div class="name"><van-notice-bar class="user-name"
                                :text="isTabe2 === 0 ? userRank?.rankList[2]?.title : userRank?.rankList[2]?.nick"
                                :speed="20" />
                        </div>
                        <div class="num">
                            ID:{{ isTabe2 === 0 ? userRank?.rankList[2]?.roomNo : userRank?.rankList[2]?.erbanNo }}
                        </div>
                    </div>
                </div>

                <div class="rank-list" v-if="userRank?.rankList.length > 2">
                    <div class="li" v-for="(item, index) in userRank?.rankList.slice(3)" :key="index">
                        <div class="left">
                            <div class="index"><span>{{ item?.ranking }}</span></div>
                            <div class="img" @click="isTabe2 === 0 ? toRoom(item?.roomId) : toUser(item?.uid)">
                                <img :src="item?.avatar" alt="" />
                            </div>
                            <div class="user-box">
                                <div class="name"><van-notice-bar class="user-name"
                                        :text="isTabe2 === 0 ? item?.title : item?.nick" :speed="20" /></div>
                                <div class="name">ID: {{
                                    isTabe2 === 0 ? item?.roomNo : item?.erbanNo }}</div>
                            </div>
                        </div>
                        <div class="right">
                            <van-notice-bar class="user-num" :text="setKM(item?.totalScore)" :speed="20" />
                        </div>
                    </div>
                </div>

                <!-- <img v-if="rankList?.length > 10 && isMore" @click="isMore = false" class="icon-more"
                    src="@/assets/ramadan/icon-more.png" alt="" /> -->


            </div>
            <!-- 我的 -->
            <div class="rank-list self" v-if="userRank?.userRankInfo">
                <div class="li">
                    <div class="left">
                        <div class="index"><span>{{
                            userRank?.userRankInfo?.ranking ? userRank?.userRankInfo?.ranking : '10+' }}</span>
                        </div>
                        <div class="img">
                            <img :src="userRank?.userRankInfo?.avatar" alt="" />
                        </div>
                        <div class="user-box">
                            <div class="name"><van-notice-bar class="user-name"
                                    :text="isTabe2 === 0 ? userRank?.userRankInfo?.title : userRank?.userRankInfo?.nick"
                                    :speed="20" /></div>
                            <div class="id">ID: {{ isTabe2 === 0 ? userRank?.userRankInfo?.roomNo :
                                userRank?.userRankInfo?.erbanNo }}</div>
                        </div>

                    </div>
                    <div class="right">
                        {{ setKM(userRank?.userRankInfo?.totalScore) }}
                    </div>
                </div>
            </div>

        </template>

        <!-- 奖励 -->
        <template v-else>
            <div class="task-list rew-list">
                <div class="li" v-for="(item, index) in isTabe2 === 0 ? roomRewList : userRewList" :key="index">
                    <div class="tit">{{ $t('ramadan.TOP') }} {{ index + 1 }}</div>
                    <div class="gift-list">
                        <div class="giftBox" v-for="(it, ind) in item.imgs" :key="ind">
                            <img :src="it.img" alt="">
                            <p>{{ it.day }}</p>
                        </div>

                    </div>

                </div>
            </div>
            <div class="task-list">
                <div class="li">
                    <div class="tit">{{ $t('ramadan.room') }}</div>
                    <div class="gift-list gift-list-room">
                        <div class="giftBox giftBox-long" v-for="(it, ind) in 3" :key="ind">
                            <div class="div">{{ ind === 0 ? $t('ramadan.room1') : ind === 1 ? $t('ramadan.room2') :
                                $t('ramadan.room3')
                            }}</div>
                            <img src="../../assets/img/ramadan/gifts/R2.png" alt="">
                            <p>{{ ind === 0 ? '*15D' : ind === 1 ? '*10D' : '*7D' }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </template>

    </div>

</template>
<style lang="scss" src="./scss/ramadan.scss" scoped></style>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import i18n from '@/i18n/index.js';
import { OpenUserSpace, OpenRoom, OpengetToke } from "@/utils/client";
import { showToast } from "vant";
import { GET_UserRank, GET_RoomRank, GET_ChallengeTask, GET_CheckTask, GET_ChallengeRecive, GET_ChargeRecive } from "@/api/ramadan";
// import { ramadanUrl, ramadanGiftUrl } from "./js/data"
const { t } = i18n.global;
const ramadanUrl = (name) => {
    return new URL(`../../assets/img/ramadan/${name}.png`, import.meta.url).href;
};
const ramadanGiftUrl = (name) => {
    return new URL(`../../assets/img/ramadan/gifts/${name}.png`, import.meta.url).href;
};
// 接收参数
const props = defineProps(["uid", "ticket", "memberUid"]);
const router = useRouter();
const lang = getLang();


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

// 任务列表
const taskList = [
    {
        num: 500,
        gifts: [
            // { img: ramadanGiftUrl('rew1'), day: 1 },
            { img: ramadanGiftUrl('H1'), day: '*1D' }
        ]
    },
    {
        num: 1500,
        gifts: [
            // { img: ramadanGiftUrl('rew1'), day: 1 },
            { img: ramadanGiftUrl('H2'), day: '*1D' }
        ]
    },
    {
        num: 5000,
        gifts: [
            { img: ramadanGiftUrl('VIP1'), day: '*1D' },
            { img: ramadanGiftUrl('H1'), day: '*3D' }
        ]
    },
    {
        num: 25000,
        gifts: [
            { img: ramadanGiftUrl('VIP2'), day: '*3D' },
            { img: ramadanGiftUrl('H2'), day: '*3D' }
        ]
    },
    {
        num: 50000,
        gifts: [
            { img: ramadanGiftUrl('VIP2'), day: '*7D' },
            // { img: ramadanGiftUrl('H3'), day: '*30D' }
        ]
    },
    {
        num: 100000,
        gifts: [
            { img: ramadanGiftUrl('VIP3'), day: '*7D' },
            { img: ramadanGiftUrl('H1'), day: '*7D' },
            { img: ramadanGiftUrl('H2'), day: '*7D' }

        ]
    },
    {
        num: 250000,
        gifts: [
            { img: ramadanGiftUrl('VIP4'), day: '*7D' },
            { img: ramadanGiftUrl('H3'), day: t('ramadan.Permanent') }
        ]
    },
]

// 个人奖励
const userRewList = [
    {
        imgs: [
            {
                img: ramadanGiftUrl('U1'), day: t('ramadan.Permanent') + '*1'
            },
            {
                img: ramadanGiftUrl('VIP6'), day: '7D*1'
            },
            {
                img: ramadanGiftUrl('U2'), day: '15D*1'
            },
            {
                img: ramadanGiftUrl('U3'), day: '15D*1'
            },
        ]
    },
    {
        imgs: [
            {
                img: ramadanGiftUrl('U4'), day: t('ramadan.Permanent') + '*1'
            },
            {
                img: ramadanGiftUrl('VIP5'), day: '7D*1'
            },
            {
                img: ramadanGiftUrl('U2'), day: '10D*1'
            },
            {
                img: ramadanGiftUrl('U5'), day: '10D*1'
            },
        ]
    },
    {
        imgs: [
            {
                img: ramadanGiftUrl('U6'), day: t('ramadan.Permanent') + '*1'
            },
            {
                img: ramadanGiftUrl('VIP4'), day: '7D*1'
            },
            {
                img: ramadanGiftUrl('U2'), day: '7D*1'
            },
            {
                img: ramadanGiftUrl('U7'), day: '7D*1'
            },
        ]
    },
]

// 房间奖励
const roomRewList = [
    {
        imgs: [
            {
                img: ramadanGiftUrl('R1'), day: t('ramadan.Permanent') + '*1'
            },
            {
                img: ramadanGiftUrl('VIP6'), day: '7D*1'
            },
            {
                img: ramadanGiftUrl('R2'), day: '15D*1'
            },
            {
                img: ramadanGiftUrl('R3'), day: '15D*1'
            },
        ]
    },
    {
        imgs: [
            {
                img: ramadanGiftUrl('R4'), day: t('ramadan.Permanent') + '*1'
            },
            {
                img: ramadanGiftUrl('VIP5'), day: '7D*1'
            },
            {
                img: ramadanGiftUrl('R2'), day: '10D*1'
            },
            {
                img: ramadanGiftUrl('R5'), day: '10D*1'
            },
        ]
    },
    {
        imgs: [
            {
                img: ramadanGiftUrl('R6'), day: t('ramadan.Permanent') + '*1'
            },
            {
                img: ramadanGiftUrl('VIP4'), day: '7D*1'
            },
            {
                img: ramadanGiftUrl('R2'), day: '7D*1'
            },
            {
                img: ramadanGiftUrl('R7'), day: '7D*1'
            },
        ]
    },
]


const isTabe = ref(1);
const clickTab = (ind) => {
    isTabe.value = ind;
    isTabe2.value = 0
    if (isTabe.value === 0) {
        getChallengeTask()
    } else if (isTabe.value === 1) {
        isTabe2.value = 1
        getUserRank()
    }
}

const isTabe2 = ref(1);
const clickTab2 = (ind) => {
    isTabe2.value = ind
    if (isTabe.value === 1) {
        isTabe2.value === 0 ? getRoomRank() : getUserRank()
    } else if (isTabe.value === 0) {
        isTabe2.value === 0 ? getChallengeTask() : getCheckTask()

    }
}

// 当前时间戳
const timestamp = ref()
const outTime = ref()

// 用户榜单
const userRank = ref()
function getUserRank() {
    GET_UserRank({
        uid: props.uid,
    })
        .then((data) => {
            userRank.value = data
            console.log('userRank==', userRank.value);
            timestamp.value = Date.now();
            outTime.value = data.activityEndTime
            console.log(timestamp.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 房间榜单
// const roomRank = ref()
function getRoomRank() {
    GET_RoomRank({
        uid: props.uid,
    })
        .then((data) => {
            userRank.value = data
            console.log('userRank==', userRank.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 挑战任务
const task = ref()
function getChallengeTask() {
    GET_ChallengeTask({
        uid: props.uid,
    })
        .then((data) => {
            task.value = data
            console.log('userRank==', userRank.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 打卡任务
const checkTask = ref()
function getCheckTask() {
    GET_CheckTask({
        uid: props.uid,
    })
        .then((data) => {
            checkTask.value = data
            if (data.reciveStatus === 1) {
                getChargeRecive()
            }
            console.log('userRank==', userRank.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 挑战任务领取
const challengeRecive = ref()
function getChallengeRecive(gear) {
    GET_ChallengeRecive({
        uid: props.uid,
        // ticket: props.ticket,
        gear: gear
    })
        .then((data) => {
            challengeRecive.value = data
            getChallengeTask()
            getCheckTask()
            console.log('userRank==', userRank.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 打卡任务领取
const chargeRecive = ref()
function getChargeRecive() {
    GET_ChargeRecive({
        uid: props.uid,
        // ticket: props.ticket,
    })
        .then((data) => {
            chargeRecive.value = data
            getChallengeTask()
            getCheckTask()
            console.log('userRank==', userRank.value);
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



onMounted(async () => {
    // console.log(window.WebViewJavascriptBridge.getToken, 'window.WebViewJavascriptBridge');
    if (isTabe.value === 1) {
        isTabe2.value === 0 ? await getRoomRank() : await getUserRank()

    } else if (isTabe.value === 0) {

        isTabe2.value === 0 ? getChallengeTask() : getChallengeTask()
    }
});
</script>
