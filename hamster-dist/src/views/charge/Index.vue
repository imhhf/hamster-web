<script setup>
import { reactive, ref } from "vue";
// import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import { AppClose, OpenCoinRecharge } from "@/utils/client";
import { showToast } from "vant";
import {
  CHARGE_RANK, //排行榜
  // HONOR_HALL, //荣耀殿堂
  MISSION_CONF, //任务配置
} from "@/api/charge";
import i18n from "@/i18n";

import ques1 from "@/assets/img/charge/ques_1.png";
import ques2 from "@/assets/img/charge/ques_2.png";
import ques3 from "@/assets/img/charge/ques_3.png";
import top1 from "@/assets/img/charge/TOP1.png";
import top2 from "@/assets/img/charge/TOP2.png";
import top3 from "@/assets/img/charge/TOP3.png";
// import cup from "@/assets/img/charge/cup.png";
import medal1 from "@/assets/img/charge/medal1.png";

// 接收参数
const props = defineProps(["uid"]);
// const router = useRouter();
const lang = getLang();
const icons = reactive({
  top1: top1,
  top2: top2,
  top3: top3,
});
let loading = ref(false); //是否加载中
let loaded = ref(false); //是否加载完成
let countdown = ref(0); //倒计时
let tabs = reactive({
  current: 0,
  list: [
    {
      label: "任务",
      value: 0,
    },
    {
      label: "榜单",
      value: 1,
    },
    // {
    //   label: "荣耀殿堂",
    //   value: 2,
    // },
  ],
});
let days = reactive({
  current: 0,
  list: [
    {
      label: "今天",
      value: 2,
    },
    {
      label: "昨天",
      value: 1,
    },
  ],
});
let daily = reactive({
  list: [
    {
      nick: "", //昵称
      avatar: ques1, //头像
      uid: null, //用户id
      totalMoney: 0, //总金额
    },
    {
      nick: "", //昵称
      avatar: ques2, //头像
      uid: null, //用户id
      totalMoney: 0, //总金额
    },
    {
      nick: "", //昵称
      avatar: ques3, //头像
      uid: null, //用户id
      totalMoney: 0, //总金额
    },
  ],
});
let monthly = reactive({
  list: [
    // {
    //   nick: "", //昵称
    //   avatar: ques1, //头像
    //   uid: null, //用户id
    //   totalMoney: 0, //总金额
    // },
  ],
});
const rank = ref(10); //
let mine = reactive({
  index: null, //排名
  avatar: "", //头像
  totalMoney: 0, //总金额
  upgradeMoney: 0, //升级所需金额
  nick: "", //昵称
  uid: null, //用户id
});
let task = reactive({
  current: 0,
  amount: 0, //总金额
  diffAmount: 0, //差额
  level: 0,
  levels: [
    // {
    //   current: 0,
    //   level: 1,
    //   totalMoney: 0, //总金额
    //   rewardS: [
    //     {
    //       day: 7,
    //       goodsId: 1,
    //       goodsName: "LV1",
    //       picUrl: "https://file.hamsterdw.com/system/vip/level1_icon_232_100.png", //图标
    //       effectUrl:
    //         "https://tres.hamima.live/admineffectIcon/17068562321668056.png", //大图/动效
    //     },
    //   ],
    // },
  ],
});
let honor = reactive({
  // 荣耀墙
  honorHallList: [],
  moreThan1wList: [],
  moreThan2wList: [],
  moreThan5kList: [],
});

// 预览
function onReview(indexP, indexS) {
  task.current = indexP;
  task.levels[indexP].current = indexS;
}

// 充值
function onRecharge() {
  OpenCoinRecharge();
}

// 返回
function goBack() {
  AppClose();
}

// // 前往荣誉证书
// function toCertificate() {
//   router.push({
//     path: "/charge/certificate",
//     query: {
//       lang: lang,
//       uid: props.uid,
//     },
//   });
// }

// 切换tab
function onTabChange(index) {
  tabs.current = index;

  switch (index) {
    case 0: //任务
      getMissionConf(); //获取任务配置
      break;

    case 1: //榜单
      getChargeRank(); //获取榜单
      break;

    // case 2: //荣耀殿堂
    //   getHonorHall(); //获取荣耀殿堂
  }
}

// 切换day
function onDayChange(idx) {
  days.current = idx;

  getChargeRank(); //获取榜单
}

// 获取任务配置
function getMissionConf() {
  loading.value = true;
  MISSION_CONF({
    uid: props.uid,
  })
    .then((data) => {
      loading.value = false;
      const { amount, diffAmount, level, levels } = data;

      task.amount = amount;
      task.diffAmount = diffAmount;
      task.level = level;
      levels.forEach((item) => {
        item.current = 0;
      });
      task.levels = levels;
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 获取榜单
function getChargeRank() {
  loading.value = true;
  CHARGE_RANK({
    dateType: days.list[days.current].value,
    uid: props.uid,
  })
    .then((data) => {
      loading.value = false;
      const { endTime, myRank, dayRankList = [], weekRankList = [] } = data;

      // 日榜赋值 - 安全版本
      daily.list = [
        {
          nick: dayRankList[0]?.nick || "",
          avatar: dayRankList[0]?.avatar || ques1,
          uid: dayRankList[0]?.uid || null,
          totalMoney: dayRankList[0]?.totalMoney || 0,
        },
        {
          nick: dayRankList[1]?.nick || "",
          avatar: dayRankList[1]?.avatar || ques2,
          uid: dayRankList[1]?.uid || null,
          totalMoney: dayRankList[1]?.totalMoney || 0,
        },
        {
          nick: dayRankList[2]?.nick || "",
          avatar: dayRankList[2]?.avatar || ques3,
          uid: dayRankList[2]?.uid || null,
          totalMoney: dayRankList[2]?.totalMoney || 0,
        },
      ];

      // 月榜赋值
      monthly.list = weekRankList;

      // 个人信息赋值
      if (myRank) {
        Object.assign(mine, {
          index: myRank.index ?? null,
          avatar: myRank.avatar || "",
          totalMoney: myRank.totalMoney || 0,
          upgradeMoney: myRank.upgradeMoney || 0,
          nick: myRank.nick || "",
          uid: myRank.uid || null,
        });
      } else {
        Object.assign(mine, {
          index: null,
          avatar: "",
          totalMoney: 0,
          upgradeMoney: 0,
          nick: "",
          uid: null,
        });
      }

      countdown.value = endTime;
      loaded.value = true;
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 倒计时结束
function countdownFinish() {
  if (loaded.value) {
    onTabChange(tabs.current);
    getChargeRank(); //获取榜单
  }
}

// 初始化数据
function init() {
  tabs.list = i18n.global.tm("charge.index.tabList"); //tabs列表赋值
  days.list = i18n.global.tm("charge.index.dayList"); //days列表赋值
  getChargeRank(); //获取榜单
  onTabChange(tabs.current);
}

init(); //初始化
</script>
<template>
  <div class="charge">
    <div class="poster">
      <div class="back" @click="goBack"></div>
      <!-- <div class="link al-center" @click="toCertificate">
        {{ $t("charge.index.honorOfCertircate") }}
      </div> -->

      <div class="times al-center">
        <van-count-down
          class="countdown al-center"
          :time="countdown"
          @finish="countdownFinish"
        >
          <template #default="timeData">
            <div class="days">
              <span class="nums">{{
                timeData.days > 9 ? timeData.days : "0" + timeData.days
              }}</span>
              <span class="colon">d</span>
            </div>
            <div class="hours">
              <span class="nums">{{
                timeData.hours > 9 ? timeData.hours : "0" + timeData.hours
              }}</span>
              <span class="colon">h</span>
            </div>
            <div class="minutes">
              <span class="nums">{{
                timeData.minutes > 9 ? timeData.minutes : "0" + timeData.minutes
              }}</span>
              <span class="colon">m</span>
            </div>
            <div class="seconds">
              <span class="nums">{{
                timeData.seconds > 9 ? timeData.seconds : "0" + timeData.seconds
              }}</span>
              <span class="colon">s</span>
            </div>
          </template>
        </van-count-down>
      </div>
    </div>

    <div class="container">
      <ul class="tabs">
        <li
          class="tab"
          v-for="(item, idx) in tabs.list"
          :key="idx"
          :class="tabs.current === idx ? 'tab_act' : 'tab_def'"
          @click="onTabChange(idx)"
        >
          {{ item.label }}
        </li>
      </ul>

      <!-- Task -->
      <template v-if="tabs.current === 0">
        <div class="task" :class="task ? 'mgb_progress' : ''">
          <div
            class="box1 levels"
            :style="{ order: task.levels.length - idx }"
            v-for="(item, idx) in task.levels"
            :key="idx"
          >
            <h1 class="title">
              {{
                $t("charge.index.lv") +
                item.level +
                " " +
                $t("charge.index.giftPack")
              }}
            </h1>
            <p class="tips">
              {{
                $t("charge.index.reached") +
                item.totalMoney +
                $t("charge.index.coins")
              }}
            </p>
            <div class="content" v-if="item.rewardS && item.rewardS.length > 0">
              <div
                class="rewards"
                :class="item.rewardS.length >= 5 ? '' : 'al-center'"
              >
                <ul class="clearfix">
                  <li
                    class="reward"
                    :class="[
                      lang == 'ara' ? 'fr' : 'fl',
                      rIdx == item.rewardS.length - 1 && rIdx % 2 === 0
                        ? 'lst'
                        : '',
                    ]"
                    v-for="(reward, rIdx) in item.rewardS"
                    :key="rIdx"
                    @click="onReview(idx, rIdx)"
                  >
                    <div class="effect al-center">
                      <van-image
                        class="icon"
                        :src="reward.picUrl"
                        fit="contain"
                      />
                    </div>
                    <div class="name">
                      <span>{{ reward.goodsName }}</span>
                      <template v-if="reward.day && reward.day > 0">
                        <span>*</span>
                        <span>{{ reward.day }}</span>
                        <span>{{ $t("charge.index.day") }}</span>
                      </template>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="review al-center">
                <div class="effect al-center">
                  <img
                    class="icon"
                    :src="
                      task.levels[idx].rewardS[task.levels[idx].current]
                        .effectUrl
                        ? task.levels[idx].rewardS[task.levels[idx].current]
                            .effectUrl
                        : task.levels[idx].rewardS[task.levels[idx].current]
                            .picUrl
                    "
                  />
                </div>
                <div class="name clamp-1">
                  <span>{{
                    task.levels[idx].rewardS[task.levels[idx].current].goodsName
                  }}</span>
                  <template
                    v-if="
                      task.levels[idx].rewardS[task.levels[idx].current].day &&
                      task.levels[idx].rewardS[task.levels[idx].current].day > 0
                    "
                  >
                    <span>*</span>
                    <span>{{
                      task.levels[idx].rewardS[task.levels[idx].current].day
                    }}</span>
                    <span>{{ $t("charge.index.day") }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="task.levels.length > 0" class="progress al-center">
          <ul class="lines al-center">
            <li
              class="line"
              :class="{
                line_act: task.level >= 0,
                line_cur: task.level == 0,
              }"
            >
              LV0
            </li>
            <li
              class="line"
              :class="{
                line_act: task.level > idx,
                line_cur: task.level == item.level,
              }"
              v-for="(item, idx) in task.levels"
              :key="idx"
            >
              {{ "LV" + item.level }}
            </li>
          </ul>

          <div class="ctrl al-center">
            <div class="btn_charge" @click="onRecharge"></div>
            <div class="info al-center">
              <div class="diff">
                {{ $t("charge.index.levelingUp") + task.diffAmount
                }}{{ $t("charge.index.coins") }}
              </div>
              <div class="total">
                {{ $t("charge.index.rechargedThisMonth") + task.amount
                }}{{ $t("charge.index.coins") }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Rank -->
      <template v-if="tabs.current === 1">
        <div class="rank" :class="mine.uid ? 'mgb_mine' : ''">
          <div class="box1 daily">
            <h1 class="title">{{ $t("charge.index.rankings.daily") }}</h1>
            <p class="tips">{{ $t("charge.index.tips.daily") }}</p>
            <div class="content">
              <ul class="days">
                <li
                  class="day"
                  v-for="(item, idx) in days.list"
                  :key="idx"
                  :class="days.current === idx ? 'day_act' : 'day_def'"
                  @click="onDayChange(idx)"
                >
                  {{ item.label }}
                </li>
              </ul>
              <ul class="tops">
                <li
                  class="top al-center"
                  :class="'top_' + (idx + 1)"
                  v-for="(top, idx) in daily.list"
                  :key="idx"
                >
                  <div class="icon_box al-center">
                    <van-image
                      class="bgs"
                      :src="icons['top' + (idx + 1)]"
                      fit="cover"
                    />
                    <van-image
                      class="avatar"
                      :src="top.avatar"
                      round
                      fit="cover"
                    />
                  </div>
                  <div class="nick">{{ top.nick || "***" }}</div>
                  <div class="id">***</div>
                </li>
              </ul>
            </div>
          </div>

          <div class="monthly">
            <h1 class="title">{{ $t("charge.index.rankings.monthly") }}</h1>
            <div class="gift al-center">
              <van-image class="icon" :src="medal1" fit="cover" />
              <p class="text">{{ $t("charge.index.tips.reward") }}</p>
            </div>
            <ul v-if="monthly.list.length > 0" class="list">
              <li class="first">
                <van-image
                  class="avatar"
                  :src="monthly.list[0].avatar"
                  round
                  fit="cover"
                />
                <div class="nick">{{ monthly.list[0].nick || "***" }}</div>
                <div class="val al-center">******</div>
              </li>
              <li
                class="item al-center"
                v-for="(item, idx) in monthly.list.slice(1)"
                :key="idx"
              >
                <div
                  class="sort al-center"
                  :class="idx < 3 ? 'sort_' + (idx + 2) : ''"
                >
                  {{ idx + 2 > 3 ? idx + 2 : "" }}
                </div>
                <div class="avatar_box al-center">
                  <van-image
                    class="avatar"
                    :src="item.avatar"
                    round
                    fit="cover"
                  />
                </div>
                <div class="nick clamp-1">{{ item.nick || "***" }}</div>
                <div class="val">******</div>
              </li>
            </ul>
          </div>

          <div
            v-if="mine.uid"
            class="al-center"
            :class="mine.upgradeMoney ? 'upgrade' : 'mine'"
          >
            <div
              class="sort al-center"
              :class="mine.index < rank && mine.index > 0 ? '' : 'morethan10'"
            >
              <span v-if="mine.index <= rank && mine.index > 0">{{
                mine.index
              }}</span>
              <div v-else>
                <span>{{ rank }}</span>
                <span>+</span>
              </div>
            </div>
            <div class="avatar_box al-center">
              <van-image class="avatar" :src="mine.avatar" round fit="cover" />
            </div>
            <div class="nick clamp-1">{{ mine.nick || "***" }}</div>
            <!-- <div v-if="mine.upgradeMoney" class="diff">
              <span>{{ $t("charge.index.tips.upgrade") }}</span>
              <span>{{ mine.upgradeMoney }}{{ $t('charge.index.coins') }}</span>
            </div> -->
            <div class="val">******</div>
          </div>
        </div>
      </template>

      <!-- Hall of Honor -->
      <!-- <template v-if="tabs.current === 2">
        <div class="hall" :class="mine.uid ? 'mgb_mine' : ''">
          <van-image class="cup" :src="cup" fit="cover" />
          <p class="remind">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
            asperiores doloremque deserunt ea! Corrupti a excepturi doloremque,
            laudantium expedita nesciunt voluptate pariatur asperiores cum
            adipisci ea dolores magnam praesentium ipsa.
          </p>

          <ul v-if="honor.honorHallList.length > 0" class="honors">
            <li class="honor" :class="'honor' + (idx + 1)" v-for="(item, idx) in honor.honorHallList" :key="idx">
              <van-image class="avatar" round :src="item.avatar" fit="cover" />
              <div class="nick clamp-1">{{ item.nick || "***" }}</div>
              <div class="val al-center">{{ item.totalMoney || "***" }}</div>
              <div v-if="idx >= 3" class="sort">{{ "TOP" + (idx + 1) }}</div>
            </li>
          </ul>

          <div class="box2 users">
            <h1 class="title">
              {{ $t("charge.index.tips.upto.20000.title") }}
            </h1>
            <p class="tips">
              {{ $t("charge.index.tips.upto.20000.text") }}
            </p>
            <div class="content">
              <ul class="richs">
                <li class="rich" v-for="(item, idx) in honor.moreThan2wList" :key="idx">
                  <div class="avatar_box al-center">
                    <van-image class="avatar" :src="item.avatar" round fit="cover" />
                  </div>
                  <div class="nick clamp-1">{{ item.nick || "***" }}</div>
                  <div class="id clamp-1">ID:{{ item.uid || "***" }}</div>
                </li>
              </ul>
            </div>
          </div>

          <div class="box2 users">
            <h1 class="title">
              {{ $t("charge.index.tips.upto.10000.title") }}
            </h1>
            <p class="tips">
              {{ $t("charge.index.tips.upto.10000.text") }}
            </p>
            <div class="content">
              <ul class="richs">
                <li class="rich" v-for="(item, idx) in honor.moreThan1wList" :key="idx">
                  <div class="avatar_box al-center">
                    <van-image class="avatar" :src="item.avatar" round fit="cover" />
                  </div>
                  <div class="nick clamp-1">{{ item.nick || "***" }}</div>
                  <div class="id clamp-1">ID:{{ item.uid || "***" }}</div>
                </li>
              </ul>
            </div>
          </div>

          <div class="box2 users">
            <h1 class="title">
              {{ $t("charge.index.tips.upto.5000.title") }}
            </h1>
            <p class="tips">
              {{ $t("charge.index.tips.upto.5000.text") }}
            </p>
            <div class="content">
              <ul class="richs">
                <li class="rich" v-for="(item, idx) in honor.moreThan5kList" :key="idx">
                  <div class="avatar_box al-center">
                    <van-image class="avatar" :src="item.avatar" round fit="cover" />
                  </div>
                  <div class="nick clamp-1">{{ item.nick || "***" }}</div>
                  <div class="id clamp-1">ID:{{ item.uid || "***" }}</div>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="mine.uid" class="mine al-center">
            <div class="sort al-center" :class="mine.index < 10 ? '' : 'morethan10'">
              <span v-if="mine.index <= 10">{{ mine.index }}</span>
              <div v-else>
                <span>10</span>
                <span>+</span>
              </div>
            </div>
            <div class="avatar_box al-center">
              <van-image class="avatar" :src="mine.avatar" round fit="cover" />
            </div>
            <div class="nick clamp-1">{{ mine.nick || "***" }}</div>
            <div class="val">{{ mine.totalMoney || "***" }}</div>
          </div>
        </div>
      </template> -->
    </div>

    <Loading :show="loading" color="#fff" bg-color="transparent" />
  </div>
</template>

<style lang="scss" scoped>
.charge {
  width: 100%;
  position: relative;
  background: #c4973a;

  .poster {
    width: 100%;
    height: 404px;
    position: relative;

    .back {
      width: 35px;
      height: 35px;
      position: absolute;
      top: 9px;
      left: 6px;
      background: url("@/assets/img/charge/back.png") no-repeat;
      background-position: center;
      background-size: cover;

      &:active {
        transform: scale(0.9);
      }
    }

    .link {
      width: 92px;
      height: 32px;
      position: absolute;
      right: 0;
      top: 169px;
      z-index: 1;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 400;
      font-size: 8px;
      color: #fff68e;
      font-style: normal;
      text-transform: none;

      &::before {
        content: "";
        width: 100%;
        height: 100%;
        background: url("@/assets/img/charge/honorOfCertircate.png") no-repeat;
        background-position: center;
        background-size: cover;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
      }
    }

    .times {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1;
      width: 375px;
      height: 75px;
      background: url("@/assets/img/charge/countdown.png") no-repeat;
      background-position: center;
      background-size: cover;

      .countdown {
        width: 365px;
        height: 48px;
        margin-top: 24px;

        .days,
        .hours,
        .minutes,
        .seconds {
          width: 45px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 18px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 400;
          font-size: 19px;
          color: #ffffff;
          font-style: normal;
          text-transform: none;
          background: url("@/assets/img/charge/times.png") no-repeat;
          background-position: center;
          background-size: cover;
        }

        .days,
        .hours,
        .minutes {
          position: relative;

          &::before {
            content: "";
            width: 1px;
            height: 23px;
            background: #5e3b00;
            position: absolute;
            right: -19px;
            top: 50%;
            margin-top: -11.5px;
          }
        }
      }
    }
  }

  .container {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: -25px;

    &::before {
      content: "";
      width: 100%;
      height: 833px;
      position: absolute;
      left: 0;
      top: 0;
      background: url("@/assets/img/charge/bg_container.png") no-repeat;
      background-position: center;
      background-size: cover;
    }

    .tabs {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: relative;
      margin: 7px auto;
      margin-left: -1.5px;
      padding-top: 25px;

      .tab {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 800;
        font-style: normal;
        text-transform: none;
      }

      .tab_act {
        width: 134px;
        height: 49px;
        background: url("@/assets/img/charge/tab_act.png") no-repeat;
        background-position: center;
        background-size: cover;
        font-size: 16px;
        color: #ffffff;
      }

      .tab_def {
        width: 110px;
        height: 34px;
        background: url("@/assets/img/charge/tab_def.png") no-repeat;
        background-position: center;
        background-size: cover;
        font-size: 15px;
        color: #b6ad81;
      }
    }

    .box1 {
      width: 375px;
      height: 534px;
      margin: 0 auto;
      background: url("@/assets/img/charge/box_1.png") no-repeat;
      background-position: center;
      background-size: cover;
      border: 1px solid transparent;
      display: flex;
      flex-direction: column;

      .title {
        width: 314px;
        height: 122px;
        background: url("@/assets/img/charge/title_1.png") no-repeat;
        background-position: center;
        background-size: cover;
        margin: 11px auto;
        padding-top: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 800;
        font-size: 18px;
        color: #ffffff;
        font-style: normal;
        text-transform: none;
      }

      .tips {
        font-family: PingFang-SC, PingFang-SC;
        font-weight: bold;
        font-size: 12px;
        color: #ffea5c;
        line-height: 16px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-top: -10px;
      }
    }

    .box2 {
      width: 100%;
      margin: 50px auto 0;
      position: relative;

      &::before {
        content: "";
        width: 375px;
        height: 457px;
        position: absolute;
        left: 0;
        top: 0;
        background: url("@/assets/img/charge/box_2.png") no-repeat;
        background-position: center;
        background-size: cover;
      }

      .title {
        position: relative;
        top: -23px;
        width: 289px;
        height: 115px;
        background: url("@/assets/img/charge/title_2.png") no-repeat;
        background-position: center;
        background-size: cover;
        margin: 0px auto 11px;
        padding-top: 47px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 800;
        font-size: 24px;
        color: #ffffff;
        font-style: normal;
        text-transform: none;
      }

      .tips {
        position: relative;
        width: 300px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: bold;
        font-size: 11px;
        color: #ffea5c;
        line-height: 16px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin: -25px auto 0;
      }
    }

    .task {
      position: relative;
      margin-top: 120px;
      display: flex;
      flex-direction: column;

      .levels {
        .content {
          width: 320px;
          margin: 10px auto 30px;
          flex: 1;
          overflow: hidden;
          display: flex;

          .rewards {
            flex: 1;
            padding: 0 5px 0 0;
            overflow-x: hidden;
            overflow-y: auto;

            .clearfix {
              width: 100%;

              .reward {
                width: 50%;
                margin: 0 auto;

                .effect {
                  width: 84px;
                  height: 83px;
                  margin: 0 auto;
                  background: url("@/assets/img/charge/box_3.png") no-repeat;
                  background-position: center;
                  background-size: cover;

                  .icon {
                    width: 53px;
                    height: 53px;
                    margin-top: 15px;
                  }
                }

                .name {
                  height: 30px;
                  font-family: PingFang-SC, PingFang-SC;
                  font-weight: 400;
                  font-size: 13px;
                  color: #ffea5c;
                  line-height: 16px;
                  text-align: center;
                  font-style: normal;
                  text-transform: none;
                  margin: 10px auto 30px;

                  span {
                    display: inline-block;
                  }
                }
              }

              .lst {
                float: none !important;
              }
            }
          }

          .review {
            width: 133px;
            flex-direction: column;

            .effect {
              width: 100%;
              height: 224px;
              position: relative;

              &::before {
                content: "";
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                background: url("@/assets/img/charge/box_4.png") no-repeat;
                background-position: center;
                background-size: cover;
              }

              .icon {
                width: 95%;
                position: relative;
              }
            }

            .name {
              font-family: PingFang-SC, PingFang-SC;
              font-weight: 400;
              font-size: 13px;
              color: #ffea5c;
              line-height: 16px;
              text-align: center;
              font-style: normal;
              text-transform: none;
              margin: 10px auto;

              span {
                display: inline-block;
              }
            }
          }
        }
      }
    }

    .progress {
      width: 375px;
      height: 130px;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 10;
      background: url("@/assets/img/charge/bg_progress.png") no-repeat;
      background-position: center;
      background-size: cover;
      flex-direction: column;

      .lines {
        width: 100%;
        height: 13px;
        background: url("@/assets/img/charge/lines.png") no-repeat;
        background-position: center;
        background-size: cover;
        margin: 25px auto;

        .line {
          flex: 1;
          font-family: HarmonyOS_Sans_SC_Bold;
          font-size: 11px;
          color: #88703c;
          font-style: normal;
          text-transform: none;
          text-align: center;
          padding-top: 40px;
          position: relative;

          &:before {
            content: "";
            width: 20px;
            height: 20px;
            position: absolute;
            left: 50%;
            margin-left: -10px;
            top: 50%;
            margin-top: -10px;
            background: url("@/assets/img/charge/point_def.png") no-repeat;
            background-position: center;
            background-size: cover;
          }
        }

        .line_act {
          &:before {
            content: "";
            width: 24px;
            height: 24px;
            position: absolute;
            left: 50%;
            margin-left: -12px;
            top: 50%;
            margin-top: -12px;
            background: url("@/assets/img/charge/point_act.png") no-repeat;
            background-position: center;
            background-size: cover;
          }
        }

        .line_cur {
          &:before {
            transform: scale(1.2);
          }
        }
      }

      .ctrl {
        flex: 1;
        overflow: hidden;
        width: 100%;

        .btn_charge {
          width: 145px;
          height: 43px;
          margin: 0 5px;

          &:active {
            transform: scale(0.98);
          }
        }

        .info {
          flex: 1;
          padding: 0 5px;
          height: 100%;
          overflow: hidden;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 400;
          font-size: 12px;
          color: #2c2400;
          font-style: normal;
          text-transform: none;
          flex-direction: column;

          .diff {
            width: 100%;
            height: 20px;
            margin-bottom: 10px;
          }

          .total {
            width: 100%;
          }
        }
      }
    }

    .rank {
      position: relative;

      .daily {
        margin-top: 130px;

        .content {
          width: 330px;
          flex: 1;
          margin: 0 auto 25px;

          .days {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            margin: 10px auto;

            .day {
              flex-shrink: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              font-family: Impact;
              font-style: normal;
              text-transform: none;
              width: 86px;
              height: 24px;
              margin: 0 10px;
            }

            .day_act {
              background: url("@/assets/img/charge/day_act.png") no-repeat;
              background-position: center;
              background-size: cover;
              font-size: 15px;
              color: #ffffff;
            }

            .day_def {
              background: url("@/assets/img/charge/day_def.png") no-repeat;
              background-position: center;
              background-size: cover;
              font-size: 14px;
              color: #cac4a0;
            }
          }

          .tops {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;

            .top {
              width: 119px;
              font-family: Impact;
              color: #ffef65;
              text-align: center;
              font-style: normal;
              text-transform: none;
              flex-direction: column;
              margin-top: -15px;

              .icon_box {
                width: 100%;
                height: 114px;
                margin: 0 auto;
                position: relative;

                .bgs {
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  left: 0;
                  top: 0;
                  z-index: 2;
                }

                .avatar {
                  width: 68px;
                  height: 68px;
                  margin-top: -8px;
                }
              }

              .nick {
                font-size: 11px;
              }

              .id {
                font-size: 8px;
              }
            }

            .top_1 {
              width: 100%;
              margin-top: 0;

              .icon_box {
                width: 201px;
                height: 141px;

                .avatar {
                  width: 84px;
                  height: 84px;
                  margin-top: -10px;
                }
              }

              .nick {
                font-size: 14px;
              }

              .id {
                font-size: 9px;
              }
            }

            .top_2 {
              // border: 1px solid blue;
            }

            .top_3 {
              // border: 1px solid #fff;
            }
          }
        }
      }

      .monthly {
        width: 100%;
        margin: 20px auto 0;
        position: relative;

        &::before {
          content: "";
          width: 375px;
          height: 457px;
          position: absolute;
          left: 0;
          top: 0;
          background: url("@/assets/img/charge/box_2.png") no-repeat;
          background-position: center;
          background-size: cover;
        }

        .title {
          position: relative;
          top: -15px;
          width: 314px;
          height: 122px;
          background: url("@/assets/img/charge/title_1.png") no-repeat;
          background-position: center;
          background-size: cover;
          margin: 0px auto 11px;
          padding-top: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 800;
          font-size: 18px;
          color: #ffffff;
          font-style: normal;
          text-transform: none;
        }

        .tips {
          position: relative;
          width: 300px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 11px;
          color: #ffea5c;
          line-height: 16px;
          text-align: center;
          font-style: normal;
          text-transform: none;
          margin: -20px auto 0;
        }

        .gift {
          position: relative;
          width: 300px;
          margin: -15px auto 0;

          .icon {
            width: 83px;
            height: 83px;
          }

          .text {
            flex: 1;
            overflow: hidden;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: bold;
            font-size: 11px;
            color: #ffea5c;
            line-height: 16px;
            font-style: normal;
            text-transform: none;
          }
        }

        .list {
          position: relative;
          width: 330px;
          width: 100%;
          margin: 0 auto;

          .first {
            width: 306px;
            height: 202px;
            border: 1px solid transparent;
            margin: 10px auto;
            position: relative;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            font-style: normal;
            text-transform: none;

            &::before {
              content: "";
              width: 100%;
              height: 100%;
              background: url("@/assets/img/charge/sort_1.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 1;
            }

            .avatar {
              width: 83px;
              height: 84px;
              display: block;
              margin: 15px auto 5px;
            }

            .nick {
              color: #ffea5c;
              line-height: 16px;
              margin: 10px auto 5px;
              position: relative;
              z-index: 1;
            }

            .val {
              width: 88px;
              height: 21px;
              background: url("@/assets/img/charge/value.png") no-repeat;
              background-position: center;
              background-size: cover;
              margin: 0 auto;
              position: relative;
              z-index: 1;
              color: #624921;
            }
          }

          .item {
            width: 375px;
            height: 86px;
            background: url("@/assets/img/charge/bg_item.png") no-repeat;
            background-position: center;
            background-size: cover;
            margin: 5px auto;
            padding: 0 35px 0 40px;
            position: relative;

            .sort {
              width: 38px;
              height: 38px;
              position: absolute;
              left: 0;
              top: 0;
              background: url("@/assets/img/charge/sort_def.png") no-repeat;
              background-position: center;
              background-size: cover;
              font-family: HarmonyOS_Sans_SC_Bold;
              font-size: 27px;
              color: #ffffff;
              text-align: center;
              font-style: normal;
              text-transform: none;
            }

            .sort_2 {
              background: url("@/assets/img/charge/sort_2.png") no-repeat;
              background-position: center;
              background-size: cover;
            }

            .sort_3 {
              background: url("@/assets/img/charge/sort_3.png") no-repeat;
              background-position: center;
              background-size: cover;
            }

            .avatar_box {
              width: 65px;
              height: 65px;
              position: relative;
              top: -2px;

              &::before {
                content: "";
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
                background: url("@/assets/img/charge/avatar_box.png") no-repeat;
                background-position: center;
                background-size: cover;
              }

              .avatar {
                width: 50px;
                height: 50px;
                margin-top: 3px;
              }
            }

            .nick {
              margin: 0 10px;
              max-width: 100px;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: bold;
              font-size: 12px;
              color: #ffea5c;
              font-style: normal;
              text-transform: none;
            }

            .val {
              flex: 1;
              overflow: hidden;
              text-align: right;
              font-family: PingFang-SC, PingFang-SC;
              font-weight: bold;
              font-size: 12px;
              color: #ffea5c;
              font-style: normal;
              text-transform: none;
            }
          }
        }
      }

      .upgrade {
        width: 375px;
        height: 78px;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
        background: url("@/assets/img/charge/bg_mine.png") no-repeat;
        background-position: center;
        background-size: cover;
        padding: 0 5px 0 40px;

        .sort {
          width: 38px;
          height: 38px;
          position: absolute;
          left: 0;
          top: 5px;
          background: url("@/assets/img/charge/sort_def.png") no-repeat;
          background-position: center;
          background-size: cover;
          font-family: HarmonyOS_Sans_SC_Bold;
          font-size: 27px;
          color: #ffffff;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .morethan10 {
          font-size: 17px !important;
        }

        .avatar_box {
          width: 65px;
          height: 65px;
          position: relative;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            background: url("@/assets/img/charge/avatar_box.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 50px;
            height: 50px;
            margin-top: 3px;
          }
        }

        .nick {
          margin: 0 10px;
          // max-width: 100px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 15px;
          color: #6e5425;
          font-style: normal;
          text-transform: none;
          flex: 1;
          overflow: hidden;
        }

        .diff {
          width: 140px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 400;
          font-size: 12px;
          color: #2c2400;
          font-style: normal;
          text-transform: none;
        }

        .val {
          text-align: right;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 15px;
          color: #624921;
          font-style: normal;
          text-transform: none;
        }
      }

      .mine {
        width: 375px;
        height: 78px;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
        background: url("@/assets/img/charge/bg_mine.png") no-repeat;
        background-position: center;
        background-size: cover;
        padding: 0 35px 0 40px;

        .sort {
          width: 38px;
          height: 38px;
          position: absolute;
          left: 0;
          top: 5px;
          background: url("@/assets/img/charge/sort_def.png") no-repeat;
          background-position: center;
          background-size: cover;
          font-family: HarmonyOS_Sans_SC_Bold;
          font-size: 27px;
          color: #ffffff;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .morethan10 {
          font-size: 17px !important;
        }

        .avatar_box {
          width: 65px;
          height: 65px;
          position: relative;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            background: url("@/assets/img/charge/avatar_box.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 50px;
            height: 50px;
            margin-top: 3px;
          }
        }

        .nick {
          margin: 0 10px;
          max-width: 100px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 15px;
          color: #6e5425;
          font-style: normal;
          text-transform: none;
        }

        .val {
          flex: 1;
          overflow: hidden;
          text-align: right;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 15px;
          color: #624921;
          font-style: normal;
          text-transform: none;
        }
      }
    }

    .hall {
      position: relative;

      .cup {
        width: 130px;
        height: 106px;
        display: block;
        margin: 75px auto 0;
      }

      .remind {
        width: 287px;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: bold;
        font-size: 11px;
        color: #ffea5c;
        line-height: 16px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin: 10px auto;
      }

      .honors {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;

        .honor {
          width: 156px;
          height: 170px;
          margin: 5px auto;
          position: relative;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/charge/honor.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
          }

          .avatar {
            width: 80px;
            height: 80px;
            display: block;
            margin: 10px auto 10px;
            position: relative;
            left: -3px;
            z-index: 1;
          }

          .nick {
            width: 100%;
            padding: 0 10px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 800;
            font-size: 16px;
            color: #ffc900;
            text-align: left;
            font-style: normal;
            text-transform: none;
            position: relative;
            z-index: 1;
            text-align: center;
          }

          .val {
            width: 50px;
            height: 18px;
            margin: 0 auto;
            background: url("@/assets/img/charge/react.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: relative;
            z-index: 1;
            text-align: center;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 800;
            font-size: 11px;
            color: #ffc900;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }

          .sort {
            width: 100%;
            font-family: Impact;
            font-size: 22px;
            color: #352003;
            text-align: left;
            font-style: normal;
            text-transform: none;
            text-align: center;
            position: absolute;
            left: 0;
            bottom: 0px;
            z-index: 1;
          }
        }

        .honor1 {
          width: 311px;
          height: 237px;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/charge/honor1.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 94px;
            height: 94px;
            margin: 42px auto 15px;
            position: relative;
            left: 1px;
          }

          .nick {
            font-size: 19px;
            margin: 4px auto;
          }

          .val {
            width: 59px;
            height: 21px;
            font-size: 13px;
          }
        }

        .honor2 {
          width: 183px;
          height: 199px;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/charge/honor2.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 80px;
            height: 80px;
            margin: 32px auto 13px;
            position: relative;
            left: 0px;
          }

          .nick {
            font-size: 16px;
            margin: 4px auto;
          }
        }

        .honor3 {
          width: 183px;
          height: 199px;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/charge/honor3.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 80px;
            height: 80px;
            margin: 32px auto 13px;
            position: relative;
            left: 0px;
          }

          .nick {
            font-size: 16px;
            margin: 4px auto;
          }
        }
      }

      .users {
        .content {
          position: relative;
          width: 365px;
          margin: 10px auto;

          .richs {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            .rich {
              flex-basis: 25%;
              overflow: hidden;
              flex-shrink: 0;
              margin: 5px auto;

              .avatar_box {
                width: 87px;
                height: 87px;
                position: relative;

                &::before {
                  content: "";
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  left: 0;
                  top: 0;
                  z-index: 1;
                  background: url("@/assets/img/charge/avatar_box.png")
                    no-repeat;
                  background-position: center;
                  background-size: cover;
                }

                .avatar {
                  width: 66px;
                  height: 66px;
                  margin: 4px auto 0;
                }
              }

              .nick {
                font-family: PingFang-SC, PingFang-SC;
                font-weight: 400;
                font-size: 12px;
                color: #fff09d;
                line-height: 15px;
                text-align: center;
                font-style: normal;
                text-transform: none;
              }

              .id {
                font-family: PingFang-SC, PingFang-SC;
                font-weight: 400;
                font-size: 9px;
                color: #fff09d;
                line-height: 15px;
                text-align: center;
                font-style: normal;
                text-transform: none;
              }
            }
          }
        }
      }

      .mine {
        width: 375px;
        height: 78px;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
        background: url("@/assets/img/charge/bg_mine.png") no-repeat;
        background-position: center;
        background-size: cover;
        padding: 0 15px;

        .sort {
          font-family: HarmonyOS_Sans_SC_Bold;
          font-size: 18px;
          color: #6e5425;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .morethan10 {
          font-size: 17px !important;
        }

        .avatar_box {
          width: 72px;
          height: 72px;
          margin: 0 0 0 10px;
          position: relative;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            background: url("@/assets/img/charge/avatar_box.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 57px;
            height: 57px;
            margin-top: 3px;
          }
        }

        .nick {
          margin: 0 10px;
          max-width: 123px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 15px;
          color: #6e5425;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        .val {
          flex: 1;
          overflow: hidden;
          text-align: right;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 18px;
          color: #624921;
          font-style: normal;
          text-transform: none;
        }
      }
    }
  }

  .mgb_mine {
    margin-bottom: 83px !important;
  }

  .mgb_progress {
    margin-bottom: 135px !important;
  }
}

.ara {
  .poster {
    background: url("@/assets/img/charge/poster_ar.png") no-repeat;
    background-position: center;
    background-size: cover;

    .back {
      left: auto !important;
      right: 6px;
    }

    .link {
      font-size: 11px;
      right: auto !important;
      left: 0;

      &::before {
        transform: rotateZ(180deg);
      }
    }

    .times {
      .countdown {
        .days,
        .hours,
        .minutes,
        .seconds {
          display: flex;
          flex-direction: row-reverse;
        }
      }
    }
  }

  .container {
    .task {
      .levels {
        .content {
          .rewards {
            padding: 0 0 0 5px;
          }
        }
      }
    }

    .rank {
      .monthly {
        .gift {
          .icon {
            margin-left: 10px;
          }
        }

        .list {
          .item {
            padding: 0 40px 0 35px;

            .sort {
              left: auto !important;
              right: 0;
            }

            .val {
              text-align: left;
            }
          }
        }
      }

      .mine {
        padding: 0 40px 0 35px;

        .sort {
          left: auto !important;
          right: 0;

          span {
            display: inline-block;
          }

          div {
            display: flex;
            flex-direction: row-reverse;
          }
        }

        .val {
          text-align: left;
        }
      }

      .upgrade {
        padding: 0 40px 0 5px;

        .sort {
          left: auto !important;
          right: 0;

          span {
            display: inline-block;
          }

          div {
            display: flex;
            flex-direction: row-reverse;
          }
        }

        .val {
          text-align: left;
        }
      }
    }

    .hall {
      .mine {
        .avatar_box {
          margin: 0 10px 0 0;
        }

        .nick {
          text-align: right;
        }

        .val {
          text-align: left;
        }
      }
    }

    .progress {
      .ctrl {
        .btn_charge {
          background: url("@/assets/img/charge/recharge_ar.png") no-repeat;
          background-position: center;
          background-size: cover;
        }
      }
    }
  }
}

.en {
  .poster {
    background: url("@/assets/img/charge/poster_en.png") no-repeat;
    background-position: center;
    background-size: cover;
  }

  .container {
    .rank {
      .monthly {
        .gift {
          .icon {
            margin-right: 10px;
          }
        }
      }
    }

    .progress {
      .ctrl {
        .btn_charge {
          background: url("@/assets/img/charge/recharge_en.png") no-repeat;
          background-position: center;
          background-size: cover;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.views_wrap {
  background: #c4973a;
}
</style>
