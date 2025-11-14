<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getLang, minuteToHour } from "@/utils";
import { showToast } from "vant";
import {
  GUILD_HISTORY_DATA_FOR_GUILD_ID, //公会全部成员历史数据
} from "@/api/guild";
import clock from "@/assets/img/guild/clock.png";
import link from "@/assets/img/guild/link.png";
import moment from "moment";
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import arSA from '@/i18n/ar-SA';
import nodata from "@/assets/img/guild/nodata.png";

// 接收参数
const props = defineProps(["uid", "ticket", "memberRole", "deviceId"]);
const router = useRouter();
const title = document.title;
const lang = getLang();
// 强制使用英语版本
Locale.use("en-US", enUS);
let loading = ref(false); //是否加载中
let finished = ref(false); //是否加载完成
let refreshing = ref(false); //是否刷新中
let page = ref(1); //页码
let size = ref(10); //每页数量
let list = reactive([
  // {
  //   uid: null, //成员uid
  //   avatar: "", //成员头像
  //   nick: "", //成员昵称
  //   charmValue: 0, //宝石数
  //   micBroadcastDuration: 0, //开播时长
  //   validDays: 0, //有效天数
  // },
]);
let calendar = reactive({
  show: false,
  minDate: new Date(2024, 0, 1),
  maxDate: new Date(),
  date1: moment().subtract(1, "day").format("YYYY-MM-DD"),
  date2: moment().format("YYYY-MM-DD"),
});

// 返回
function goBack() {
  router.go(-1);
}

// 日期区间选择
function onCalendar(value) {
  const [start, end] = value;
  calendar.date1 = moment(start).format("YYYY-MM-DD");
  calendar.date2 = moment(end).format("YYYY-MM-DD");
  calendar.show = false;
  refreshGuildHistoryData();
}

// 前往成员数据页
function toMemberData(memberUid) {
  router.push({
    path: "/guild/data/member",
    query: {
      lang: lang,
      uid: props.uid,
      ticket: props.ticket,
      memberUid: memberUid,
      memberRole: props.memberRole,
      deviceId: props.deviceId,
      startDate: calendar.date1,
      endDate: calendar.date2,
    },
  });
}

// 刷新公会全部成员历史数据
function refreshGuildHistoryData() {
  page.value = 1;
  finished.value = false;
  loading.value = true;
  refreshing.value = true;

  getGuildHistoryData();
}

// 获取公会全部成员历史数据
function getGuildHistoryData() {
  GUILD_HISTORY_DATA_FOR_GUILD_ID({
    uid: props.uid,
    ticket: props.ticket,
    startTimeInt: moment(calendar.date1).format("YYYYMMDD"),
    endTimeInt: moment(calendar.date2).format("YYYYMMDD"),
    pageNum: page.value,
    pageSize: size.value,
  })
    .then((data) => {
      if (data) {
        if (refreshing.value) {
          list = [];
          refreshing.value = false;
        }

        let records = [];
        if (data.list && data.list.length > 0) {
          list = records.concat(data.list);
        }

        if (!data.whetherLastPage) {
          page.value += 1;
        } else {
          finished.value = true;
        }
      } else {
        loading.value = false;
        finished.value = true;
      }
    })
    .catch((err) => {
      loading.value = false;
      finished.value = true;
      showToast(err.message);
    });
}

getGuildHistoryData(); //获取公会全部成员历史数据
</script>

<template>
  <div class="data">
    <nav-bars :is-left="true" :left-slot="true" :title="title" :is-right="true" :right-slot="true" title-color="#be9021"
      bg-color="#efd29c">
      <template #left_slot>
        <svg @click="goBack" t="1735394484907" class="back" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="1716" width="200" height="200">
          <path
            d="M705.43 800.05000001l-322.99000001-322.99000001c-21.87-21.87-57.33-21.87-79.2 0-21.87 21.87-21.87 57.33 0 79.2l323.00000001 322.99c21.87 21.87 57.33 21.87 79.2 0 21.86-21.87 21.86-57.33-0.01-79.19999999z"
            fill="#BE9021" p-id="1717"></path>
          <path
            d="M294.25 468.05L617.24 145.07c21.87-21.87 57.33-21.87 79.2 0 21.87 21.87 21.87 57.33 0 79.2l-322.99 322.99c-21.87 21.87-57.33 21.87-79.2 0-21.87-21.88-21.87-57.34 0-79.21z"
            fill="#BE9021" p-id="1718"></path>
        </svg>
      </template>
    </nav-bars>

    <div class="container">
      <div class="dates" @click="calendar.show = true">
        <van-image class="clock" :src="clock" fit="cover" />
        <span class="date">{{ calendar.date1 }}</span>
        <span class="colo"> - </span>
        <span class="date">{{ calendar.date2 }}</span>
      </div>

      <van-pull-refresh v-model="refreshing" class="refresh" @refresh="refreshGuildHistoryData"
        :pulling-text="$t('other.pullingText')" :loosing-text="$t('other.loosingText')"
        :loading-text="$t('other.loadingText')">
        <van-list class="list" v-model:loading="loading" :finished="finished" :immediate-check="false"
          :finished-text="list.length == 0 ? '' : $t('other.finishedText')" :loading-text="' '">
          <template v-if="list.length == 0">
            <div class="empt">
              <van-image fit="cover" class="icon" :src="nodata" />
              <p class="text">{{ $t("guild.tips.nodata") }}</p>
            </div>
          </template>
          <template v-else>
            <div class="item" v-for="(item, idx) in list" :key="idx">
              <div class="info" @click="toMemberData(item.uid)">
                <van-image class="avatar" round :src="item.avatar" fit="cover" />
                <div class="nick clamp-1">{{ item.nick }}</div>
                <van-image class="link" :src="link" fit="cover" />
              </div>
              <ol class="totals">
                <li class="total">
                  <div class="val clamp-1">{{ item.charmValue }}</div>
                  <div class="lab clamp-1">
                    {{ $t("guild.label.totalIncome") }}
                  </div>
                </li>
                <li class="total">
                  <div class="val clamp-1">{{ minuteToHour(item.micBroadcastDuration) }}</div>
                  <div class="lab clamp-1">{{ $t("guild.label.hours") }}</div>
                </li>
                <li class="total">
                  <div class="val clamp-1">{{ item.validDays }}</div>
                  <div class="lab clamp-1">
                    {{ $t("guild.label.validDays") }}
                  </div>
                </li>
              </ol>
            </div>
          </template>
        </van-list>
      </van-pull-refresh>
    </div>

    <van-calendar v-model:show="calendar.show" :min-date="calendar.minDate" :max-date="calendar.maxDate" type="range"
      @confirm="onCalendar" />
  </div>
</template>

<style lang="scss" scoped>
.data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .container {
    flex: 1;
    padding: 10px 10px 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .dates {
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      .clock {
        width: 16px;
        height: 16px;
        margin: 0 6px;
      }

      .date,
      .colo {
        font-family: Helvetica;
        font-size: 14px;
        color: #606060;
        font-style: normal;
      }

      .colo {
        margin: 0 5px;
      }
    }

    .refresh {
      width: 100%;
      flex: 1;
      margin: 10px auto 0;
      overflow: hidden;

      .list {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

        .item {
          background: #ffffff;
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 10px;

          .info {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;

            .avatar {
              width: 30px;
              height: 30px;
            }

            .nick {
              flex: 1;
              overflow: hidden;
              padding: 0 10px;
              font-family: Helvetica, Helvetica;
              font-weight: bold;
              font-size: 12px;
              color: #121212;
              font-style: normal;
            }

            .link {
              width: 12px;
              height: 12px;
            }
          }

          .totals {
            width: 100%;
            background: #ffffff;
            border-radius: 6px;
            display: flex;
            justify-content: space-around;
            margin: 10px auto 0;

            .total {
              width: 108px;
              background: linear-gradient(180deg, #f4e19f 0%, #fff8ca 100%);
              border-radius: 6px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px 10px;
              overflow: hidden;
              text-align: center;

              .val {
                width: 100%;
                font-family: Helvetica, Helvetica;
                font-weight: bold;
                font-size: 16px;
                color: #000000;
                line-height: 19px;
                font-style: normal;
                margin-bottom: 4px;
              }

              .lab {
                width: 100%;
                font-family: Helvetica;
                font-size: 12px;
                color: #4f3a01;
                line-height: 15px;
                font-style: normal;
              }
            }
          }

          &:last-child {
            margin-bottom: 0;
          }
        }

        .empt {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          .icon {
            width: 176px;
            height: 176px;
            margin-top: 40px;
          }

          .text {
            font-family: Helvetica;
            font-size: 16px;
            color: #b7b7b7;
            line-height: 19px;
            text-align: center;
            font-style: normal;
            margin: 13px auto;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.views_wrap,
.data {
  background: #f1f1f1;
}

.data {
  .van-calendar__day--middle {
    color: #f4e19f;
  }

  .van-calendar__day--end,
  .van-calendar__day--start {
    background: #f4e19f;
  }

  .van-calendar__footer {
    .van-button {
      background: #f4e19f;
      border-color: #f4e19f;
    }
  }
}

.ara {
  .container {
    .list {
      .item {
        .info {
          .link {
            transform: rotateZ(180deg);
          }
        }
      }
    }
  }
}
</style>
