<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import { OpenUserSpace } from "@/utils/client";
import { showToast } from "vant";
import {
  GET_TAB_BEST_CP, //获取全服CP等级最高的3对CP
  GET_WEEK_RANK, //获取周排行榜
} from "@/api/cp";
import i18n from "@/i18n";
import moment from "moment";
import unknown from "@/assets/img/cp/unknown.png";
import icon_cup from "@/assets/img/cp/cup.png";
import heartbeat from "@/assets/img/cp/best/heartbeat.png";

// 勋章
import medal_1 from "@/assets/img/medal/TOP1.png";
import medal_2 from "@/assets/img/medal/TOP2.png";
import medal_3 from "@/assets/img/medal/TOP3.png";

// 头饰
import headwear_1 from "@/assets/img/headwear/TOP1.png";
import headwear_2 from "@/assets/img/headwear/TOP2.png";
import headwear_3 from "@/assets/img/headwear/TOP3.png";

// 座驾
import car_1 from "@/assets/img/car/TOP1.png";
import car_2 from "@/assets/img/car/TOP2.png";

// BestCP
import best_cp_1 from "@/assets/img/cp/reward/CP1.png";
import best_cp_2 from "@/assets/img/cp/reward/CP2.png";
import best_cp_3 from "@/assets/img/cp/reward/CP3.png";

// 证书
import certificates from "@/assets/img/cp/reward/certificates.png";

// VIP
import vip3 from "@/assets/img/cp/reward/VIP3.jpg";
import vip4 from "@/assets/img/cp/reward/VIP4.jpg";
import vip5 from "@/assets/img/cp/reward/VIP5.jpg";

// 接收参数
const props = defineProps(["uid"]);
const router = useRouter();
const lang = getLang();

let tabs = ref({
  current: 1,
  list: [
    {
      label: "Best CP",
      value: 0,
    },
    {
      label: "Weekly Rank",
      value: 1,
    },
    {
      label: "Rewards",
      value: 2,
    },
  ],
});
let weeks = ref({
  current: 1,
  list: [
    {
      label: "Last Week",
      value: 1,
    },
    {
      label: "This Week",
      value: 2,
    },
  ],
});
let timer = ref({
  interval: null,
  rate: 5, //秒
});
let countdown = ref(0); //倒计时
let tops5 = ref([
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
]);
let rewards = ref({
  current: 0,
  list: [
    {
      label_en: "Best CP",
      label_ara: "أفضل CP",
      value: 1,
      list: [
        {
          prizes: [
            {
              id: 114,
              day: 7,
              name_en: "Medals",
              name_ar: "الميدالية",
              icon: best_cp_1,
            },
          ],
        },
        {
          prizes: [
            {
              id: 115,
              day: 7,
              name_en: "Medals",
              name_ar: "الميدالية",
              icon: best_cp_2,
            },
          ],
        },
        {
          prizes: [
            {
              id: 116,
              day: 7,
              name_en: "Medals",
              name_ar: "الميدالية",
              icon: best_cp_3,
            },
          ],
        },
      ],
    },
    {
      label_en: "Weekly Rank",
      label_ara: "التقييم الأسبوعي",
      value: 2,
      list: [
        {
          prizes: [
            {
              id: 111,
              day: 7,
              name_en: "Medals",
              name_ar: "الميدالية",
              icon: medal_1,
            },
            {
              id: 106,
              day: 7,
              name_en: "Mount",
              name_ar: "الدخولية",
              icon: car_1,
            },
            {
              id: null,
              day: 7,
              name_en: "Headwear",
              name_ar: "أغطية الرأس",
              icon: headwear_1,
            },
            {
              id: null,
              day: 7,
              name_en: "VIP5",
              name_ar: "VIP5",
              icon: vip5,
            },
            // {
            //   id: null,
            //   day: 7,
            //   name_en: "Certificates",
            //   name_ar: "الشهادة",
            //   icon: certificates,
            // },
          ],
        },
        {
          prizes: [
            {
              id: 112,
              day: 7,
              name_en: "Medals",
              name_ar: "الميدالية",
              icon: medal_2,
            },
            {
              id: 107,
              day: 7,
              name_en: "Mount",
              name_ar: "الدخولية",
              icon: car_2,
            },
            {
              id: null,
              day: 7,
              name_en: "Headwear",
              name_ar: "أغطية الرأس",
              icon: headwear_2,
            },
            {
              id: null,
              day: 7,
              name_en: "VIP4",
              name_ar: "VIP4",
              icon: vip4,
            },
            // {
            //   id: null,
            //   day: 7,
            //   name_en: "Certificates",
            //   name_ar: "الشهادة",
            //   icon: certificates,
            // },
          ],
        },
        {
          prizes: [
            {
              id: 113,
              day: 7,
              name_en: "Medals",
              name_ar: "الميدالية",
              icon: medal_3,
            },
            {
              id: null,
              day: 7,
              name_en: "Headwear",
              name_ar: "أغطية الرأس",
              icon: headwear_3,
            },
            {
              id: null,
              day: 7,
              name_en: "VIP3",
              name_ar: "VIP3",
              icon: vip3,
            },
            // {
            //   id: null,
            //   day: 7,
            //   name_en: "Certificates",
            //   name_ar: "الشهادة",
            //   icon: certificates,
            // },
          ],
        },
      ],
    },
  ],
});
//全服CP等级最高的3对CP
let bestCP = ref([]);
//排行榜前三名
let top3 = ref([
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
]);
// 排行榜（除前三名）
let list = ref([]);
// 我的排行榜
let mine = ref(null);

// 前往荣耀殿堂
function toHonor() {
  router.push({
    path: "/cp/honor",
    query: {
      lang: lang,
      uid: props.uid,
    },
  });
}

// 前往用户中心
function toUser(userId) {
  OpenUserSpace(userId);
}

// 获取全服CP等级最高的3对CP
function getTabBestCP() {
  let params = {
    uid: props.uid,
  };
  GET_TAB_BEST_CP(params)
    .then((data) => {
      bestCP.value = data;
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 获取周排行榜
function getWeekRank() {
  const weekType = weeks.value.list[weeks.value.current].value;
  let params = {
    weekType: weekType,
    uid: props.uid,
  };
  // if (weekType == 2) {
  //   params.uid = props.uid;
  // }
  GET_WEEK_RANK(params)
    .then((data) => {
      const { endTime, myRank, weekRank } = data;
      let template = {
        nick: "",
        avatar: unknown,
        cpNick: "",
        cpAvatar: unknown,
        loveValue: 0,
        allLoveValue: 0,
      };
      let beforeThree = [];
      let afterThree = [];

      // 排行榜赋值
      if (weekRank) {
        let len = weekRank.length;

        if (len > 3) {
          beforeThree = weekRank.slice(0, 3);
          afterThree = weekRank.slice(3, len);
        } else {
          for (let i = 0; i < 3; i++) {
            if (weekRank[i]) {
              beforeThree.push(weekRank[i]);
            } else {
              beforeThree.push(template);
            }
          }
        }
      } else {
        for (let i = 0; i < 3; i++) {
          beforeThree.push(template);
        }
      }

      if (myRank) {
        myRank.self_today = moment(myRank.now).format("YYYY.MM.DD"); //当前时间
      }

      top3.value = beforeThree; //排行榜前三名赋值
      list.value = afterThree; //排行榜（除前三名）赋值
      mine.value = myRank; // 我的排行榜赋值
      countdown.value = endTime; // 倒计时赋值
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 获取上周排行榜TOP1-5
function getWeekRankTopFive() {
  GET_WEEK_RANK({ weekType: 1, uid: props.uid })
    .then((data) => {
      const weekRank = data.weekRank || []; // 判空并默认空数组
      let template = { nick: "", avatar: unknown, cpNick: "", cpAvatar: unknown, loveValue: 0, allLoveValue: 0 };
      let list = [];
      for (let i = 0; i < 5; i++) {
        list.push(weekRank[i] || template); // 直接取数组项，不存在则用模板
      }
      tops5.value = list;
    })
    .catch((err) => {
      console.log(err, 'err');
      showToast(err.message);
    });
}

// 切换tab
function onTabChange(index) {
  tabs.value.current = index;

  getWeekRankTopFive(); //获取上周排行榜TOP1-5数据

  if (index != 0) {
    clearTimer(); //清除计时器
  }

  if (index == 0) {
    getTabBestCP(); //获取全服CP等级最高的3对CP数据

    timer.value.interval = setInterval(() => {
      getTabBestCP(); //获取全服CP等级最高的3对CP数据
    }, timer.value.rate * 1000);
  } else if (index == 1) {
    weeks.value.current = 1;
    getWeekRank(); //获取周排行榜数据
  } else if (index == 2) {
    rewards.value.current = 0;
  }
}

// 切换周榜
function onWeekChange(index) {
  weeks.value.current = index;
  getWeekRank(); //获取周排行榜数据
}

// 切换奖励榜
function onRewardChange(index) {
  rewards.value.current = index;
}

// 初始化数据
function init() {
  tabs.value.list = i18n.global.tm("cp.ranking.tabList"); //tabs列表赋值
  weeks.value.list = i18n.global.tm("cp.ranking.weekList"); //weeks列表赋值
  getWeekRank(); //获取周排行榜数据
  getWeekRankTopFive(); //获取上周排行榜TOP1-5数据
}

// 清除计时器
function clearTimer() {
  if (timer.value.interval) {
    clearInterval(timer.value.interval);
    timer.value.interval = null;
  }
}

onUnmounted(() => {
  clearTimer(); //清除计时器
});

init(); //初始化
</script>
<template>
  <div class="cp_ranking"
    :class="[mine && tabs.current == 1 ? 'pdb114' : '', tabs.current == 0 && bestCP?.length === 0 ? 'cp-ranking_none' : '']">
    <div class="poster">
      <van-image :src="icon_cup" fit="cover" class="cup btn_active" @click="toHonor" />

      <ul class="tops5">
        <li class="top5" v-for="(item, idx) in tops5" :key="idx" :class="'top5_' + (idx + 1)">
          <div class="users">
            <div class="avatar_box al-center">
              <van-image :src="item.cpAvatar" round fit="cover" class="avatar" />
            </div>
            <div class="avatar_box al-center">
              <van-image :src="item.avatar" round fit="cover" class="avatar" />
            </div>
          </div>
          <div class="loves al-center">
            <div class="love_val">***</div>
          </div>
        </li>
      </ul>

      <van-count-down class="countdown al-center" :time="countdown">
        <template #default="timeData">
          <span class="time days">{{
            timeData.days > 9 ? timeData.days : "0" + timeData.days
          }}</span>
          <span class="colon">d</span>
          <span class="time hours">{{
            timeData.hours > 9 ? timeData.hours : "0" + timeData.hours
          }}</span>
          <span class="colon">h</span>
          <span class="time minutes">{{
            timeData.minutes > 9 ? timeData.minutes : "0" + timeData.minutes
          }}</span>
          <span class="colon">m</span>
          <span class="time seconds">{{
            timeData.seconds > 9 ? timeData.seconds : "0" + timeData.seconds
          }}</span>
          <span class="colon">s</span>
        </template>
      </van-count-down>
    </div>

    <ul class="tabs">
      <li class="tab" :class="tabs.current == idx ? 'tab_act' : 'tab_def'" v-for="(item, idx) in tabs.list" :key="idx"
        @click="onTabChange(idx)">
        {{ item.label }}
      </li>
    </ul>

    <template v-if="tabs.current == 0">
      <p class="minds">{{ $t("cp.ranking.tips.tab1") }}</p>

      <ul class="bests">
        <li class="best" :class="'best_' + (idx + 1)" v-for="(item, idx) in bestCP" :key="idx">
          <div class="title"></div>
          <ol class="users al-center">
            <li class="user">
              <div class="icon_box al-center">
                <van-image :src="item.cpAvatar ? item.cpAvatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ item.cpNick }}</div>
            </li>
            <li class="heartbeat">
              <van-image :src="heartbeat" class="icon" />
            </li>
            <li class="user">
              <div class="icon_box al-center">
                <van-image :src="item.avatar ? item.avatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ item.nick }}</div>
            </li>
            <li class="love al-center">{{ item.loveValue }}</li>
          </ol>
        </li>
      </ul>
    </template>

    <template v-if="tabs.current == 1">
      <ul class="weeks">
        <li class="week" :class="weeks.current == idx ? 'week_act' : 'week_def'" v-for="(item, idx) in weeks.list"
          :key="idx" @click="onWeekChange(idx)">
          {{ item.label }}
        </li>
      </ul>

      <p class="minds">{{ $t("cp.ranking.tips.tab2") }}</p>

      <ul class="tops">
        <li class="top top2">
          <div class="users">
            <div class="user">
              <div class="avatar_box al-center">
                <van-image :src="top3[1].cpAvatar ? top3[1].cpAvatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ top3[1].cpNick }}</div>
            </div>
            <div class="user">
              <div class="avatar_box al-center">
                <van-image :src="top3[1].avatar ? top3[1].avatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ top3[1].nick }}</div>
            </div>
          </div>
          <div class="loves al-center">
            <div class="love_val">{{ top3[1].loveValue }}</div>
          </div>
        </li>
        <li class="top top1">
          <div class="users">
            <div class="user">
              <div class="avatar_box al-center">
                <van-image :src="top3[0].cpAvatar ? top3[0].cpAvatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ top3[0].cpNick }}</div>
            </div>
            <div class="user">
              <div class="avatar_box al-center">
                <van-image :src="top3[0].avatar ? top3[0].avatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ top3[0].nick }}</div>
            </div>
          </div>
          <div class="loves al-center">
            <div class="love_val">{{ top3[0].loveValue }}</div>
          </div>
        </li>
        <li class="top top3">
          <div class="users">
            <div class="user">
              <div class="avatar_box al-center">
                <van-image :src="top3[2].cpAvatar ? top3[2].cpAvatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ top3[2].cpNick }}</div>
            </div>
            <div class="user">
              <div class="avatar_box al-center">
                <van-image :src="top3[2].avatar ? top3[2].avatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ top3[2].nick }}</div>
            </div>
          </div>
          <div class="loves al-center">
            <div class="love_val">{{ top3[2].loveValue }}</div>
          </div>
        </li>
      </ul>

      <ul class="list">
        <li class="item al-center" v-for="(item, idx) in list" :key="idx">
          <div class="sort al-center" :class="{ morethan9: idx + 1 > 9 }">
            {{ idx + 4 }}
          </div>
          <div class="info al-center">
            <div class="user">
              <div class="icon_box al-center">
                <van-image :src="item.cpAvatar ? item.cpAvatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ item.cpNick }}</div>
            </div>
            <div class="love">
              <div class="val al-center clamp-1">
                <div class="love_val">{{ item.loveValue }}</div>
              </div>
            </div>
            <div class="user">
              <div class="icon_box al-center">
                <van-image :src="item.avatar ? item.avatar : unknown" round fit="cover" class="avatar" />
              </div>
              <div class="nick clamp-1">{{ item.nick }}</div>
            </div>
          </div>
        </li>
      </ul>
    </template>

    <template v-if="tabs.current == 2">
      <ul class="weeks">
        <li class="week" :class="rewards.current == idx ? 'week_act' : 'week_def'" v-for="(item, idx) in rewards.list"
          :key="idx" @click="onRewardChange(idx)">
          {{ item['label_' + lang] }}
        </li>
      </ul>

      <ul class="rewards" :class="'rewards_' + rewards.list[rewards.current].value">
        <li class="reward" :class="'reward' + (idx + 1)" v-for="(item, idx) in rewards.list[rewards.current].list"
          :key="idx">
          <div class="title al-center">{{ "TOP" + (idx + 1) }}</div>
          <ol class="prizes">
            <li class="prize" v-for="(prize, pIdx) in item.prizes" :key="pIdx">
              <div class="icon_box al-center">
                <van-image :src="prize.icon" fit="contain" class="icon" />
              </div>
              <div class="info">
                <template v-if="lang == 'en'">
                  {{ prize.name_en + "*" + (prize.day ? prize.day + "D" : "") }}
                </template>
                <template v-else>
                  <span>{{ prize.name_ar }}</span>
                  <span>*</span>
                  <span>{{ (prize.day ? prize.day + "أيام" : "") }}</span>
                </template>
              </div>
            </li>
          </ol>
        </li>
      </ul>
    </template>

    <div v-if="mine && tabs.current == 1" class="mine al-center">
      <div class="sort al-center morethan9" :class="{ morethan9: mine.rankIndex > 9 }">
        {{
          mine.rankIndex == -1 ? "30+" : mine.rankIndex ? mine.rankIndex : "30+"
        }}
      </div>
      <div class="info al-center">
        <div class="user">
          <div class="icon_box al-center" @click="toUser(mine.cpUid)">
            <van-image :src="mine.cpAvatar ? mine.cpAvatar : unknown" round fit="cover" class="avatar" />
          </div>
          <div class="nick clamp-1">{{ mine.cpNick || "--" }}</div>
        </div>
        <div class="love">
          <div class="date">
            {{ mine.self_today + ":" + mine.loveValue }}
          </div>
          <div class="val al-center clamp-1">
            <div class="love_val">{{ mine.loveValue || 0 }}</div>
          </div>
        </div>
        <div class="user">
          <div class="icon_box al-center" @click="toUser(mine.uid)">
            <van-image :src="mine.avatar ? mine.avatar : unknown" round fit="cover" class="avatar" />
          </div>
          <div class="nick clamp-1">{{ mine.nick || "--" }}</div>
        </div>
      </div>
    </div>

    <p class="tips">{{ $t("cp.ranking.tips.explain") }}</p>
  </div>
</template>

<style lang="scss" scoped>
.pdb114 {
  padding-bottom: 114px;
}

app {
  min-width: 100vw;
  min-height: 100vh;
  background: #ff779d;
}

.cp_ranking {
  position: relative;

  &.cp-ranking_none {
    padding-bottom: 150px;
  }


  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: url("@/assets/img/cp/bg.png") no-repeat;
    background-position: center;
    background-size: cover;
  }

  .poster {
    width: 100%;
    height: 528px;
    position: relative;

    .cup {
      width: 39px;
      height: 37px;
      position: absolute;
      left: 12px;
      top: 58px;
      z-index: 1;
    }
  }

  .tops5 {
    position: relative;
    top: 100px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;

    .top5 {
      position: relative;
      flex-basis: 50%;

      .users {
        display: flex;
        justify-content: center;
      }

      .loves {
        font-family: PingFang-SC, PingFang-SC;
        color: #ffffff;
        font-weight: 800;
        font-style: normal;
        text-transform: none;
      }
    }

    .top5_1 {
      flex-basis: 100%;
      padding-top: 16px;

      .users {
        .avatar_box {
          width: 76px;
          height: 83.5px;
          position: relative;
          overflow: hidden;

          .avatar {
            width: 70px;
            height: 70px;
            position: relative;
            top: 6px;
          }
        }

        .avatar_box:nth-child(1) {
          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/cp/top5_1-1.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          }
        }

        .avatar_box:nth-child(2) {
          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/cp/top5_1-2.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          }
        }
      }

      .loves {
        width: 152px;
        height: 36px;
        padding-top: 4px;
        margin: 33px auto 0;
        background: url("@/assets/img/cp/bg_val-1.png") no-repeat;
        background-position: center;
        background-size: cover;

        .love_val {
          position: relative;
          font-size: 18px;
          padding-left: 27px;

          &::before {
            content: "";
            width: 24px;
            height: 21px;
            background: url("@/assets/img/cp/heart.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 50%;
            margin-top: -10.5px;
            left: 0px;
            z-index: 1;
          }
        }
      }
    }

    .top5_2,
    .top5_3,
    .top5_4,
    .top5_5 {
      .users {
        width: 80px;
        height: 67px;
        margin: 0 auto 0;

        .avatar_box {
          width: 36px;
          height: 36px;
          background: url("@/assets/img/cp/circle.png") no-repeat;
          background-position: center;
          background-size: cover;
          position: relative;
          top: 15px;
          overflow: hidden;

          .avatar {
            width: 33px;
            height: 33px;
          }
        }
      }

      .loves {
        width: 73px;
        height: 20.5px;
        margin: 0 auto;
        background: url("@/assets/img/cp/bg_val-2.png") no-repeat;
        background-position: center;
        background-size: cover;

        .love_val {
          position: relative;
          font-size: 12px;
          padding-left: 18px;

          &::before {
            content: "";
            width: 15.5px;
            height: 13.5px;
            background: url("@/assets/img/cp/heart.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 50%;
            margin-top: -5.5px;
            left: 0px;
            z-index: 1;
          }
        }
      }
    }

    .top5_2 {
      left: -30px;
      top: -35px;

      .users {
        background: url("@/assets/img/cp/top_2.png") no-repeat;
        background-position: center;
        background-size: cover;
      }
    }

    .top5_3 {
      right: -30px;
      top: -35px;

      .users {
        background: url("@/assets/img/cp/top_3.png") no-repeat;
        background-position: center;
        background-size: cover;
      }
    }

    .top5_4 {
      top: -40px;
      left: 35px;

      .users {
        background: url("@/assets/img/cp/top_4.png") no-repeat;
        background-position: center;
        background-size: cover;
      }
    }

    .top5_5 {
      top: -40px;
      right: 35px;

      .users {
        background: url("@/assets/img/cp/top_5.png") no-repeat;
        background-position: center;
        background-size: cover;
      }
    }
  }

  .tabs {
    display: flex;
    justify-content: center;
    align-items: center;

    .tab {
      font-family: Impact;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }

    .tab_def {
      width: 123px;
      height: 43px;
      font-size: 14px;
      line-height: 33px;
      color: #c49292;
      background: url("@/assets/img/cp/tab_def.png") no-repeat;
      background-position: center;
      background-size: cover;
    }

    .tab_act {
      width: 133px;
      height: 54px;
      font-size: 15px;
      line-height: 54px;
      color: #ffffff;
      background: url("@/assets/img/cp/tab_act.png") no-repeat;
      background-position: center;
      background-size: cover;
      margin-top: -11px;
    }
  }

  .weeks {
    display: flex;
    justify-content: center;
    align-items: center;

    .week {
      font-family: Impact;
      text-align: center;
      font-style: normal;
      text-transform: none;
      width: 123px;
      height: 43px;
      font-size: 14px;
      line-height: 33px;
    }

    .week_def {
      color: #c49292;
      background: url("@/assets/img/cp/tab_def.png") no-repeat;
      background-position: center;
      background-size: cover;
    }

    .week_act {
      color: #ffffff;
      background: url("@/assets/img/cp/week_act.png") no-repeat;
      background-position: center;
      background-size: cover;
    }
  }

  .bests {
    .best {
      position: relative;

      .title {
        width: 203.5px;
        height: 30.5px;
        margin: 10px auto 5px;
      }

      .users {
        width: 100%;
        height: 261px;
        padding-top: 32px;

        .user {
          position: relative;
          z-index: 1;

          &:nth-child(1) {
            margin-right: -20px;
          }

          &:nth-child(3) {
            margin-left: -20px;
          }

          .icon_box {
            width: 124.5px;
            height: 148.5px;
            position: relative;
            overflow: hidden;

            .avatar {
              width: 85px;
              height: 85px;
              position: relative;
              top: 7px;
            }
          }

          .nick {
            font-family: PingFang-SC, PingFang-SC;
            font-weight: bold;
            font-size: 18px;
            color: #ffffff;
            text-align: center;
            font-style: normal;
            text-transform: none;
          }
        }

        .heartbeat {
          width: 96px;
          height: 87px;

          .icon {
            width: 100%;
          }
        }

        .love {
          width: 151px;
          height: 30px;
          background: url("@/assets/img/cp/best/love.png") no-repeat;
          background-position: center;
          background-size: cover;
          position: absolute;
          left: 50%;
          margin-left: -75.5px;
          bottom: 40px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 800;
          font-size: 16px;
          color: #ffffff;
          text-align: center;
          font-style: normal;
          text-transform: none;
          padding-left: 25px;
        }
      }
    }

    .best_1 {
      .title {
        background: url("@/assets/img/cp/best/top1_flag.png") no-repeat;
        background-position: center;
        background-size: cover;
      }

      .users {
        background: url("@/assets/img/cp/best/top1_wrap.png") no-repeat;
        background-position: center;
        background-size: cover;

        .user {
          .icon_box {
            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/cp/best/top1_box.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }
          }
        }
      }
    }

    .best_2 {
      .title {
        background: url("@/assets/img/cp/best/top2_flag.png") no-repeat;
        background-position: center;
        background-size: cover;
      }

      .users {
        background: url("@/assets/img/cp/best/top2_wrap.png") no-repeat;
        background-position: center;
        background-size: cover;

        .user {
          .icon_box {
            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/cp/best/top2_box.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }
          }
        }
      }
    }

    .best_3 {
      .title {
        background: url("@/assets/img/cp/best/top3_flag.png") no-repeat;
        background-position: center;
        background-size: cover;
      }

      .users {
        background: url("@/assets/img/cp/best/top3_wrap.png") no-repeat;
        background-position: center;
        background-size: cover;

        .user {
          .icon_box {
            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/cp/best/top3_box.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }
          }
        }
      }
    }
  }

  .rewards {
    .reward {
      width: 370px;
      height: 355px;
      background: url("@/assets/img/cp/reward/item.png") no-repeat;
      background-position: center;
      background-size: cover;
      position: relative;
      display: flex;
      flex-direction: column;
      margin: 10px auto;
      padding: 0px 10px 20px;

      .title {
        width: 174px;
        height: 60px;
        background: url("@/assets/img/cp/reward/title.png") no-repeat;
        background-position: center;
        background-size: cover;
        position: relative;
        margin: 0 auto 10px;
        padding-top: 15px;
        font-family: Impact;
        font-size: 23px;
        color: #ffffff;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }

      .prizes {
        flex: 1;
        padding: 0 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        overflow-x: hidden;
        overflow-y: auto;

        .prize {
          width: 98px;

          .icon_box {
            width: 98px;
            height: 108px;
            position: relative;
            overflow: hidden;

            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/cp/reward/box.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
            }

            .icon {
              width: 60px;
              height: 60px;
              position: relative;
              top: 8px;
            }
          }

          .info {
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 400;
            font-size: 13px;
            color: #ffffff;
            line-height: 16px;
            text-align: center;
            font-style: normal;
            text-transform: none;
            margin: 4px auto;

            span {
              display: inline-block;
            }
          }
        }
      }
    }
  }

  .rewards_1 {
    .reward {
      .prizes {
        overflow: hidden;

        .prize {
          width: 196px;

          .icon_box {
            width: 196px;
            height: 216px;

            .icon {
              width: 120px;
              height: 120px;
              top: 16px;
            }
          }
        }
      }
    }
  }

  .tops {
    display: flex;
    position: relative;
    padding-top: 127px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 145px;
      background: url("@/assets/img/cp/crown.png") no-repeat;
      background-position: center;
      background-size: cover;
    }

    .top {
      text-align: center;

      .users {
        display: flex;

        .user {
          margin: 0 auto;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;

          .nick {
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            font-style: normal;
            text-transform: none;
          }
        }
      }

      .loves {
        background: url("@/assets/img/cp/bg_val-2.png") no-repeat;
        background-position: center;
        background-size: cover;

        .love_val {
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 800;
          color: #ffffff;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }
      }
    }

    .top1 {
      width: 151px;
      height: 206px;
      background: url("@/assets/img/cp/top1.png") no-repeat;
      background-position: center;
      background-size: 115%;
      margin-top: -40px;

      .users {
        margin-top: 12px;

        .user {
          &:nth-child(1) {
            margin-right: -5px;
          }

          &:nth-child(2) {
            margin-left: -5px;
          }

          .avatar_box {
            width: 75px;
            height: 90px;
            position: relative;
            overflow: hidden;

            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/cp/top3_1.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }

            .avatar {
              width: 50px;
              height: 50px;
            }
          }

          .nick {
            width: 80%;
            margin: -8px auto 0;
            font-size: 12px;
          }
        }
      }

      .loves {
        width: 73px;
        height: 20px;
        margin: 6px auto 0;

        .love_val {
          position: relative;
          font-size: 12px;
          padding-left: 18px;

          &::before {
            content: "";
            width: 16px;
            height: 14px;
            background: url("@/assets/img/cp/heart.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 50%;
            margin-top: -6px;
            left: 0px;
            z-index: 1;
          }
        }
      }
    }

    .top2 {
      background: url("@/assets/img/cp/top2.png") no-repeat;
      background-position: center;
      background-size: 105%;

      .users {
        .user {
          .avatar_box {
            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/cp/top3_2.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }
          }
        }
      }
    }

    .top3 {
      background: url("@/assets/img/cp/top3.png") no-repeat;
      background-position: center;
      background-size: 105%;

      .users {
        .user {
          .avatar_box {
            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/cp/top3_3.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }
          }
        }
      }
    }

    .top2,
    .top3 {
      width: 112px;
      height: 181px;

      .users {
        margin-top: 15px;

        .user {
          &:nth-child(1) {
            margin-right: -4px;
          }

          &:nth-child(2) {
            margin-left: -4px;
          }

          .avatar_box {
            width: 57px;
            height: 68px;
            position: relative;
            overflow: hidden;

            .avatar {
              width: 37px;
              height: 37px;
            }
          }

          .nick {
            width: 80%;
            margin: -5px auto 0;
            font-size: 9px;
          }
        }
      }

      .loves {
        width: 55px;
        height: 16px;
        margin: 6px auto 0;

        .love_val {
          position: relative;
          font-size: 9px;
          padding-left: 15px;

          &::before {
            content: "";
            width: 13px;
            height: 11px;
            background: url("@/assets/img/cp/heart.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 50%;
            margin-top: -4px;
            left: 0px;
            z-index: 1;
          }
        }
      }
    }
  }

  .list {
    .item {
      width: 100%;
      height: 92px;
      background: url("@/assets/img/cp/item.png") no-repeat;
      background-position: center;
      background-size: cover;
      margin: 0px auto 4px;

      .sort {
        width: 36.5px;
        height: 36.5px;
        background: url("@/assets/img/cp/sort.png") no-repeat;
        background-position: center;
        background-size: cover;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: bold;
        font-size: 21px;
        color: #ffffff;
        font-style: normal;
        text-transform: none;
      }

      .info {
        margin: 0 10px;

        .user {
          width: 70px;
          margin: 4px auto 0;
          overflow: hidden;

          .icon_box {
            width: 70px;
            height: 69px;
            position: relative;
            overflow: hidden;

            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/cp/icon_box.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }

            .avatar {
              width: 52px;
              height: 52px;
            }
          }

          .nick {
            font-family: PingFang-SC, PingFang-SC;
            font-weight: bold;
            font-size: 12px;
            color: #ffffff;
            text-align: center;
            font-style: normal;
            text-transform: none;
            margin-top: -5px;
          }
        }

        .love {
          width: 169px;
          height: 72px;
          margin: 0 -10px;
          background: url("@/assets/img/cp/love.png") no-repeat;
          background-position: center;
          background-size: cover;
          position: relative;

          .val {
            width: 55px;
            height: 16px;
            position: absolute;
            left: 50%;
            bottom: 0;
            margin-left: -31px;
            background: url("@/assets/img/cp/bg_val-2.png") no-repeat;
            background-position: center;
            background-size: cover;

            .love_val {
              position: relative;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 800;
              font-size: 9px;
              color: #ffffff;
              text-align: center;
              font-style: normal;
              text-transform: none;
              padding-left: 15px;

              &::before {
                content: "";
                width: 13px;
                height: 11px;
                background: url("@/assets/img/cp/heart.png") no-repeat;
                background-position: center;
                background-size: cover;
                position: absolute;
                top: 50%;
                margin-top: -5px;
                left: 0px;
                z-index: 1;
              }
            }
          }
        }
      }
    }
  }

  .morethan9 {
    font-size: 12px !important;
  }

  .mine {
    width: 100%;
    height: 114px;
    background: url("@/assets/img/cp/mine.png") no-repeat;
    background-position: center;
    background-size: cover;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    padding-top: 28px;

    .sort {
      width: 36.5px;
      height: 36.5px;
      background: url("@/assets/img/cp/sort.png") no-repeat;
      background-position: center;
      background-size: cover;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: bold;
      font-size: 21px;
      color: #ffffff;
      font-style: normal;
      text-transform: none;
    }

    .info {
      margin: 0 10px;

      .user {
        .icon_box {
          width: 70px;
          height: 67px;
          position: relative;

          overflow: hidden;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/cp/icon_box.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          }

          .avatar {
            width: 52px;
            height: 52px;
            position: relative;
          }
        }

        .nick {
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 12px;
          color: #ffffff;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }
      }

      .love {
        width: 169px;
        height: 72px;
        margin: -10px -10px 0;
        background: url("@/assets/img/cp/love.png") no-repeat;
        background-position: center;
        background-size: cover;
        position: relative;

        .date {
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 12px;
          color: #ffffff;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .val {
          width: 55px;
          height: 16px;
          position: absolute;
          left: 50%;
          bottom: 0;
          margin-left: -31px;
          background: url("@/assets/img/cp/bg_val-2.png") no-repeat;
          background-position: center;
          background-size: cover;

          .love_val {
            position: relative;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 800;
            font-size: 9px;
            color: #ffffff;
            text-align: center;
            font-style: normal;
            text-transform: none;
            padding-left: 15px;

            &::before {
              content: "";
              width: 13px;
              height: 11px;
              background: url("@/assets/img/cp/heart.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 50%;
              margin-top: -5px;
              left: 0px;
              z-index: 1;
            }
          }
        }
      }
    }
  }

  .tips {
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 400;
    font-size: 9px;
    color: #ececec;
    text-align: center;
    font-style: normal;
    text-transform: none;
    padding: 30px 0 20px;
  }

  .minds {
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 400;
    font-size: 10px;
    color: #ececec;
    text-align: center;
    font-style: normal;
    text-transform: none;
    padding: 10px 0 20px;
  }
}
</style>
<style lang="scss">
.countdown {
  width: 225px;
  height: 37px;
  position: absolute;
  left: 50%;
  margin-left: -112.5px;
  bottom: 10px;
  background: url("@/assets/img/cp/countdown.png") no-repeat;
  background-position: center;
  background-size: cover;

  .time {
    width: 44px;
    height: 29px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFang-SC, PingFang-SC;
    font-weight: bold;
    font-size: 18px;
    font-style: normal;
    text-transform: none;
    letter-spacing: 12px;
    text-indent: 12px;
  }

  .days {
    background: url("@/assets/img/cp/countdown_d.png") repeat-x;
    background-size: 50% 100%;
    color: #ffffff;
  }

  .hours,
  .minutes,
  .seconds {
    background: url("@/assets/img/cp/countdown_s.png") repeat-x;
    background-size: 50% 100%;
    color: #3c010b;
  }

  .colon {
    font-family: PingFang-SC, PingFang-SC;
    font-weight: bold;
    font-size: 15px;
    color: #ffffff;
    font-style: normal;
  }
}

.ara {
  .poster {
    background: url("@/assets/img/cp/poster_ar.png") no-repeat;
    background-position: center;
    background-size: cover;
  }

  .countdown,
  .tops,
  .list .item,
  .mine {
    flex-direction: row-reverse
  }

  .countdown {
    .time {
      text-indent: -12px !important;
    }
  }
}

.en {
  .poster {
    background: url("@/assets/img/cp/poster.png") no-repeat;
    background-position: center;
    background-size: cover;
  }
}
</style>
