<template>
    <div class="weekActivity">
        <div class="banner">

        </div>

        <div class="last">
            <p class="title">{{ $t('weekActivity.Las') }}</p>

            <div class="top-list top-list-last">
                <div class="li li0">
                    <template v-if="topRank?.[0]">
                        <div class="img" @click="toUser(topRank?.[0]?.uid)">
                            <img v-if="topRank?.[0]?.avatar" :src="topRank?.[0]?.avatar" alt="">
                        </div>
                        <div class="top-img"></div>
                        <!-- <img class="top-img" src="../../assets/img/weekActivity/top1.png" alt=""> -->
                        <div class="name"><van-notice-bar class="user-name" :text="topRank?.[0]?.nick" :speed="20" />
                        </div>
                        <div class="num">
                            ID:{{ topRank?.[0]?.erbanNo }}
                        </div>

                        <div class="num-box">
                            {{ setKM(topRank?.[0]?.goldNum) }}
                        </div>
                    </template>
                </div>
                <div class="li li1">
                    <template v-if="topRank?.[1]">
                        <div class="img" @click="toUser(topRank?.[1]?.uid)">
                            <img v-if="topRank?.[1]?.avatar" :src="topRank?.[1]?.avatar" alt="">
                            <!-- <img v-else class="top-img" src="../../assets/img/weekActivity/top2.png" alt=""> -->
                        </div>
                        <div class="top-img"></div>
                        <!-- <img class="top-img" src="../../assets/img/weekActivity/top2.png" alt=""> -->
                        <div class="name"><van-notice-bar class="user-name" :text="topRank?.[1]?.nick" :speed="20" />
                        </div>
                        <div class="num">
                            ID:{{ topRank?.[1]?.erbanNo }}
                        </div>
                        <div class="num-box">
                            {{ setKM(topRank?.[1]?.goldNum) }}
                        </div>
                    </template>
                </div>
                <div class="li li2">
                    <template v-if="topRank?.[2]">
                        <div class="img" @click="toUser(topRank?.[2]?.uid)">
                            <img v-if="topRank?.[2]?.avatar" :src="topRank?.[2]?.avatar" alt="">
                        </div>
                        <div class="top-img"></div>
                        <!-- <img class="top-img" src="../../assets/img/weekActivity/top3.png" alt=""> -->
                        <div class="name"><van-notice-bar class="user-name" :text="topRank?.[2]?.nick" :speed="20" />
                        </div>
                        <div class="num">
                            ID:{{ topRank?.[2]?.erbanNo }}
                        </div>
                        <div class="num-box">
                            {{ setKM(topRank?.[2]?.goldNum) }}
                        </div>
                    </template>
                </div>

                <div class="tit" @click="popLastDay = true">
                    <span>{{ $t('weekActivity.Vie') }}</span>
                </div>
            </div>
        </div>

        <!-- tab切换 -->
        <div class="tabs">
            <div class="btnBox" @click="clickTab(0)" :class="isTabe === 0 ? 'tab-show' : ''">
                <span>{{ $t('weekActivity.Las1') }}</span>
            </div>
            <div class="btnBox" @click="clickTab(1)" :class="isTabe === 1 ? 'tab-show' : ''">
                <span>{{ $t('weekActivity.Thi') }}</span>
            </div>
            <div class="btnBox" @click="clickTab(2)" :class="isTabe === 2 ? 'tab-show' : ''">
                <span>{{ $t('weekActivity.Awa') }}</span>
            </div>
        </div>

        <!-- rank -->
        <div v-if="isTabe !== 2" class="rank">
            <van-count-down class="countdown al-center" :time="info?.endTime">
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

            <div class="rew">
                <div class="giftBox" v-for="(item, index) in info?.giftList" :key="index">
                    <img class="top-img" :src="item.picUrl" alt="">
                    <p>
                        <img src="../../assets/img/weekActivity/icon-coins.png" alt="">
                        {{ item.goldPrice }}
                    </p>
                </div>
            </div>
            <div class="rank-top-list">
                <div class="top-list">
                    <div class="li li0">
                        <template v-if="info?.rankList[0]">
                            <div class="img" @click="toUser(info?.rankList[0]?.uid)">
                                <img v-if="info?.rankList[0]?.avatar" :src="info?.rankList[0]?.avatar" alt="">
                            </div>
                            <div class="top-img"></div>
                            <!-- <img class="top-img" src="../../assets/img/weekActivity/top1-1.png" alt=""> -->
                            <div class="name"><van-notice-bar class="user-name" :text="info?.rankList[0]?.nick"
                                    :speed="20" />
                            </div>
                            <div class="num">
                                ID:{{ info?.rankList[0]?.erbanNo }}
                            </div>

                            <div class="num-box">
                                {{ setKM(info?.rankList[0]?.goldNum) }}
                            </div>
                        </template>
                    </div>
                    <div class="li li1">
                        <template v-if="info?.rankList[1]">
                            <div class="img" @click="toUser(info?.rankList[1]?.uid)">
                                <img v-if="info?.rankList[1]?.avatar" :src="info?.rankList[1]?.avatar" alt="">
                            </div>
                            <div class="top-img"></div>
                            <!-- <img class="top-img" src="../../assets/img/weekActivity/top2-2.png" alt=""> -->
                            <div class="name"><van-notice-bar class="user-name" :text="info?.rankList[1]?.nick"
                                    :speed="20" />
                            </div>
                            <div class="num">
                                ID:{{ info?.rankList[1]?.erbanNo }}
                            </div>
                            <div class="num-box">
                                {{ setKM(info?.rankList[1]?.goldNum) }}
                            </div>
                        </template>
                    </div>
                    <div class="li li2">
                        <template v-if="info?.rankList[2]">
                            <div class="img" @click="toUser(info?.rankList[2]?.uid)">
                                <img v-if="info?.rankList[2]?.avatar" :src="info?.rankList[2]?.avatar" alt="">
                            </div>
                            <div class="top-img"></div>
                            <!-- <img class="top-img" src="../../assets/img/weekActivity/top3-3.png" alt=""> -->
                            <div class="name"><van-notice-bar class="user-name" :text="info?.rankList[2]?.nick"
                                    :speed="20" />
                            </div>
                            <div class="num">
                                ID:{{ info?.rankList[2]?.erbanNo }}
                            </div>
                            <div class="num-box">
                                {{ setKM(info?.rankList[2]?.goldNum) }}
                            </div>
                        </template>
                    </div>
                </div>

                <div class="rank-list" v-if="info?.rankList.length > 2">
                    <div class="li" v-for="(item, index) in info?.rankList.slice(3)" :key="index">
                        <div class="left">
                            <div class="index"><span>{{ index + 4 }}</span></div>
                            <div class="img" @click="toUser(item?.uid)">
                                <img :src="item?.avatar" alt="" />
                            </div>
                            <div class="user-box">
                                <div class="name"><van-notice-bar class="user-name" :text="item?.nick" :speed="20" />
                                </div>
                                <div class="name">ID: {{
                                    item?.erbanNo }}</div>
                            </div>
                        </div>
                        <div class="right">
                            <van-notice-bar class="user-num" :text="setKM(item?.goldNum)" :speed="20" />
                        </div>
                    </div>
                </div>

            </div>
            <!-- 我的 -->
            <div class="rank-list self">
                <div class="li">
                    <div class="left">
                        <div class="index"><span>{{
                            info?.index > 0 ? info?.index : '10+' }}</span>
                        </div>
                        <div class="img">
                            <img :src="info?.avatar" alt="" />
                        </div>
                        <div class="user-box">
                            <div class="name"><van-notice-bar class="user-name" :text="info?.nick" :speed="20" /></div>
                            <div class="id">ID: {{ info?.erbanNo }}</div>
                        </div>

                    </div>
                    <div class="right">
                        {{ setKM(info?.userGold) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- 奖励 -->
        <template v-else>
            <div class="reward">
                <div class="tit">{{ $t('weekActivity.TOP') }}</div>

                <div class="list">
                    <div class="giftBox" :class="'giftBox' + ind" v-for="(it, ind) in rewardList.rewardTop1" :key="ind">
                        <img class="top-img" :src="it.rewardPicUrl" alt="">
                        <p>
                            {{ it.rewardDesc }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="reward">
                <div class="tit">{{ $t('weekActivity.TOP2') }}</div>

                <div class="list">
                    <div class="giftBox" :class="'giftBox' + ind" v-for="(it, ind) in rewardList.rewardTop2" :key="ind">
                        <img class="top-img" :src="it.rewardPicUrl" alt="">
                        <p>
                            {{ it.rewardDesc }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="reward">
                <div class="tit">{{ $t('weekActivity.TOP3') }}</div>

                <div class="list">
                    <div class="giftBox" :class="'giftBox' + ind" v-for="(it, ind) in rewardList.rewardTop3" :key="ind">
                        <img class="top-img" :src="it.rewardPicUrl" alt="">
                        <p>
                            {{ it.rewardDesc }}
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <!-- 荣耀墙 -->
        <van-popup class="popLastDay" v-model:show="popLastDay" position="center">
            <div class="popLastDay-box">
                <div class="title">{{ $t('weekActivity.Las') }}</div>

                <div class="top-list-box" v-if="honorHall?.length > 0 || honorHall !== null">
                    <div class="top-list" v-for="(item, index) in honorHall" :key="index">
                        <div class="btnBox">
                            <span>{{ myTimeDay(item.startWeekDay) }}-{{ myTimeDay(item.endWeekDay) }}</span>
                        </div>
                        <div class="top-list top-list-last" @click="popLastDay = true">
                            <div class="li" :class="'li' + ind" v-for="(it, ind) in item.starWeekRank" :key="ind">
                                <div class="img" @click="toUser(it?.uid)">
                                    <img :src="it?.avatar" alt="">
                                </div>
                                <div class="name"><van-notice-bar class="user-name" :text="it?.nick" :speed="20" />
                                </div>
                                <!-- <div class="num">
                                    ID:{{ it?.erbanNo }}
                                </div> -->

                                <div class="num-box">
                                    {{ setKM(it?.goldNum) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </van-popup>

    </div>

</template>
<style lang="scss" src="./scss/weekActivity.scss" scoped></style>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import i18n from '@/i18n/index.js';
import { OpenUserSpace, OpenRoom, OpengetToke } from "@/utils/client";
import { showToast } from "vant";
import { GET_StarWeek, GET_StarWeek_top, GET_StarWeek_honorHall, GET_StarWeek_reward } from "@/api/weekActivity";
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

const rewList = [
    {
        imgs: [
            { img: weekActivityGiftUrl('rew1'), day: '*7D' },
            { img: weekActivityGiftUrl('rew2'), day: '*7D' },
            { img: weekActivityGiftUrl('vip5'), day: '*7D' },
            { img: weekActivityGiftUrl('rew3'), day: '*7D' },
        ]
    },
    {
        imgs: [
            { img: weekActivityGiftUrl('rew4'), day: '*7D' },
            { img: weekActivityGiftUrl('rew2'), day: '*7D' },
            { img: weekActivityGiftUrl('vip4'), day: '*7D' },
            { img: weekActivityGiftUrl('rew5'), day: '*7D' },
        ]
    },
    {
        imgs: [
            { img: weekActivityGiftUrl('rew6'), day: '*7D' },
            { img: weekActivityGiftUrl('vip3'), day: '*7D' },
            { img: weekActivityGiftUrl('rew6'), day: '*7D' },
            { img: weekActivityGiftUrl('rew7'), day: '*7D' },
        ]
    },
]


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


const isTabe = ref(1);
const clickTab = (ind) => {
    isTabe.value = ind;
    if (isTabe.value === 0) {
        getStarWeek(1)
        console.log(111);

    } else if (isTabe.value === 1) {
        console.log(232);
        getStarWeek(2)
    } else {
        console.log(888);
        getReward()
    }

}

// 周榜单
const info = ref()
function getStarWeek(type) {
    GET_StarWeek({
        uid: props.uid,
        rankType: type
    })
        .then((data) => {
            info.value = data
            // if (data) {

            // } else {
            //     // showToast(t('weekActivity.no'));
            // }
            console.log('data==', info.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 上周top3
const topRank = ref()
function getStarWeek_top() {
    GET_StarWeek_top({
        uid: props.uid,
        // rankType: type
    })
        .then((data) => {
            topRank.value = data
            console.log(topRank);
            // if (data) {

            // } else {
            //     // showToast(t('weekActivity.no'));
            // }
            console.log('data==', info.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

const honorHall = ref()
function getStarWeek_honorHall() {
    GET_StarWeek_honorHall({
        uid: props.uid,
        // rankType: type
    })
        .then((data) => {
            honorHall.value = data
            console.log(topRank);
            // if (data) {

            // } else {
            //     // showToast(t('weekActivity.no'));
            // }
            console.log('data==', info.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 获取榜单奖励
const rewardList = ref()
function getReward() {
    GET_StarWeek_reward({
        uid: props.uid,
        // rankType: type
    })
        .then((data) => {
            rewardList.value = data
            console.log(rewardList.value);
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
    getStarWeek(2)
    getStarWeek_top()
    getStarWeek_honorHall()

});
</script>