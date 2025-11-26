<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getLang, minuteToHour } from "@/utils";
import { showToast } from "vant";
import {
  GUILD_HISTORY_DATA_FOR_UID, //公会成员历史明细数据
  GUILD_MEMBER_KICK_OUT, //踢出公会成员
} from "@/api/guild";
import clock from "@/assets/img/guild/clock.png";
import moment from "moment";
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import arSA from '@/i18n/ar-SA';
import nodata from "@/assets/img/guild/nodata.png";
import i18n from '@/i18n/index.js';

const { t } = i18n.global;
// 接收参数
const props = defineProps([
  "uid",
  "ticket",
  "memberUid",
  "memberRole",
  "startDate",
  "endDate",
  "deviceId"
]);
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
  //   diamondNum: 0, //宝石数量
  //   dateTimeStr: "", //数据统计时间
  //   memberErbanNo: 3662942,
  //   memberNick: "", //成员昵称
  //   micBroadcastDuration: 0, //开播时长
  //   statisticsTime: 0, //统计时间(毫秒)
  //   supportersNum: 0, //支持者数量
  //   whetherValidDays: false, //当天开播是否有效
  // },
]);
//公会成员数据
let member = ref({
  uid: null, //用户uid
  avatar: "", //用户头像
  nick: "", //用户昵称
  erbanNo: null, //用户naadi号
  todayCharmValue: 0, //今天收礼数
  yesterdayCharmValue: 0, //昨天收礼数
  thisMonthCharmValue: 0, //本月收礼数
  thisMonthValidDays: 0, //本月有效天数
  thisMonthMicBroadcastDuration: 0, //本月开播时长
  lastMonthCharmValue: 0, //上月收礼数
  lastMonthValidDays: 0, //上月有效天数
  lastMonthMicBroadcastDuration: 0, //上月开播时长
});
let calendar = reactive({
  show: false,
  minDate: new Date(2024, 0, 1),
  maxDate: new Date(),
  date1: props.startDate
    ? props.startDate
    : moment().subtract(1, "day").format("YYYY-MM-DD"),
  date2: props.endDate ? props.endDate : moment().format("YYYY-MM-DD"),
});

// 返回
function goBack() {
  router.go(-1);
}

// 显示日期选择控件
function showCalendar() {
  calendar.show = true;
}

// 获取日期
function getDays(time) {
  if (!time) {
    return "-";
  }

  return moment(time).days();
}

// 日期区间选择
function onCalendar(value) {
  const [start, end] = value;
  calendar.date1 = moment(start).format("YYYY-MM-DD");
  calendar.date2 = moment(end).format("YYYY-MM-DD");
  calendar.show = false;
  refreshGuildHistoryData(); //刷新公会成员历史数据
}

// 刷新公会成员历史数据
function refreshGuildHistoryData() {
  page.value = 1;
  finished.value = false;
  loading.value = true;
  refreshing.value = true;

  getGuildHistoryData();
}

// 获取公会全部成员历史数据
function getGuildHistoryData() {
  GUILD_HISTORY_DATA_FOR_UID({
    uid: props.uid,
    ticket: props.ticket,
    memberUid: props.memberUid,
    startTimeInt: moment(calendar.date1).format("YYYYMMDD"),
    endTimeInt: moment(calendar.date2).format("YYYYMMDD"),
    pageNum: page.value,
    pageSize: size.value,
  })
    .then((data) => {
      if (data) {
        const { memberSummaryData, pageResult } = data;

        if (memberSummaryData) {
          member.value = memberSummaryData;
        }

        if (pageResult) {
          if (refreshing.value) {
            list = [];
            refreshing.value = false;
          }

          let records = [];
          if (pageResult.list && pageResult.list.length > 0) {
            list = records.concat(pageResult.list);
          }

          if (!pageResult.whetherLastPage) {
            page.value += 1;
          } else {
            finished.value = true;
          }
        } else {
          loading.value = false;
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

// 踢出公会成员
function kickOutMember() {
  GUILD_MEMBER_KICK_OUT({
    uid: props.uid,
    ticket: props.ticket,
    memberUid: props.memberUid,
    deviceId: props.deviceId,
  })
    .then(() => {
      showToast(t('sysadmin.succ'));
      setTimeout(() => {
        refreshGuildHistoryData(); //刷新公会成员历史数据
      }, 1000);
    })
    .catch((err) => {
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
            fill="#FFFFFF" p-id="1717"></path>
          <path
            d="M294.25 468.05L617.24 145.07c21.87-21.87 57.33-21.87 79.2 0 21.87 21.87 21.87 57.33 0 79.2l-322.99 322.99c-21.87 21.87-57.33 21.87-79.2 0-21.87-21.88-21.87-57.34 0-79.21z"
            fill="#FFFFFF" p-id="1718"></path>
        </svg>
      </template>
    </nav-bars>

    <div class="container">
      <div class="dates" @click="showCalendar">
        <van-image class="clock" :src="clock" fit="cover" />
        <span class="date">{{ calendar.date1 }}</span>
        <span class="colo"> - </span>
        <span class="date">{{ calendar.date2 }}</span>
      </div>

      <div class="content">
        <div class="info">
          <van-image class="avatar" round :src="member.avatar" fit="cover" />
          <div class="nick clamp-1">{{ member.nick }}</div>
          <!-- memberRole: 3, //成员权限 1会长2管理员3普通成员 -->
          <template v-if="props.uid != props.memberUid">
            <van-button v-if="props.memberRole == 1 || props.memberRole == 2" type="default" class="remove"
              @click="kickOutMember">{{ $t("guild.btn.remove") }}</van-button>
          </template>
        </div>

        <div class="totals">
          <ul class="days">
            <li class="day">
              <div class="val clamp-1">{{ member.todayCharmValue || "0" }}</div>
              <div class="lab clamp-1">{{ $t("guild.label.todayIncome") }}</div>
            </li>
            <li class="day">
              <div class="val clamp-1">
                {{ member.yesterdayCharmValue || "0" }}
              </div>
              <div class="lab clamp-1">
                {{ $t("guild.label.yesterdayIncome") }}
              </div>
            </li>
          </ul>

          <ul class="this_month">
            <li class="month">
              <div class="val clamp-1">
                {{ member.thisMonthCharmValue || "0" }}
              </div>
              <div class="lab clamp-1">
                {{ $t("guild.label.thisMonthIncome") }}
              </div>
            </li>
            <li class="month">
              <div class="val clamp-1">
                {{ minuteToHour(member.thisMonthMicBroadcastDuration) }}
              </div>
              <div class="lab clamp-1">
                {{ $t("guild.label.thisMonthHours") }}
              </div>
            </li>
            <li class="month">
              <div class="val clamp-1">
                {{ member.thisMonthValidDays || "0" }}
              </div>
              <div class="lab clamp-1">
                {{ $t("guild.label.thisMonthDays") }}
              </div>
            </li>
          </ul>

          <ul class="last_month">
            <li class="month">
              <div class="val clamp-1">
                {{ member.lastMonthCharmValue || "0" }}
              </div>
              <div class="lab clamp-1">
                {{ $t("guild.label.lastMonthIncome") }}
              </div>
            </li>
            <li class="month">
              <div class="val clamp-1">
                {{ member.lastMonthMicBroadcastDuration || "0" }}
              </div>
              <div class="lab clamp-1">
                {{ $t("guild.label.lastMonthHours") }}
              </div>
            </li>
            <li class="month">
              <div class="val clamp-1">
                {{ member.lastMonthValidDays || "0" }}
              </div>
              <div class="lab clamp-1">
                {{ $t("guild.label.lastMonthDays") }}
              </div>
            </li>
          </ul>
        </div>

        <div class="tables">
          <div class="th">
            <span class="td">{{ $t("guild.unit.date") }}</span>
            <span class="td">{{ $t("guild.unit.days") }}</span>
            <span class="td">{{ $t("guild.unit.hours") }}</span>
            <span class="td">{{ $t("guild.unit.income") }}</span>
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
                <div class="tr" v-for="(item, idx) in list" :key="idx">
                  <span class="td">{{ item.dateTimeStr }}</span>
                  <span class="td">{{ getDays(item.statisticsTime) }}</span>
                  <span class="td">{{ minuteToHour(item.micBroadcastDuration) }}</span>
                  <span class="td">{{ item.charmValue || '0' }}</span>
                </div>
              </template>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>

    <van-calendar v-model:show="calendar.show" :min-date="calendar.minDate" :max-date="calendar.maxDate" type="range"
      @confirm="onCalendar" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-nav-bar){
  background: linear-gradient(180deg, RGBA(182, 52, 255, 1) 0%, RGBA(90, 0, 255, 1) 100%) !important;
}
:deep(.van-nav-bar__title){
  span{
      color: #FFFFFF !important;
  }
}
.data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .container {
    width: 100%;
    flex: 1;
    padding: 10px 10px 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

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

    .content {
      width: 100%;
      margin: 10px auto 0;
      background: #ffffff;
      border-radius: 6px 6px 0 0;
      padding: 10px 10px 0;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

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

        .remove {
          height: auto;
          background: linear-gradient(180deg, #AC41F6 0%, #520BF5 100%);
          padding: 6px 12px;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 12px;
          color: #FFFFFF;
          font-style: normal;
          border-radius: 22px;
          border: none;
        }
      }

      .totals {
        width: 100%;
        background: #ffffff;
        margin: 0 auto;

        .days {
          border-radius: 6px;
          margin: 0px auto 20px;
          padding: 20px 10px;
          background: linear-gradient(rgba(179, 122, 247, 0.37), rgba(179, 122, 247, 0.14));
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;

          .day {
            flex-basis: 50%;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;

            &:last-child,
            &:nth-last-child(2) {
              margin-bottom: 0;
            }

            .val {
              font-family: Helvetica, Helvetica;
              font-weight: bold;
              font-size: 16px;
              color: #000000;
              line-height: 19px;
              font-style: normal;
              margin-bottom: 4px;
            }

            .lab {
              font-family: Helvetica;
              font-size: 12px;
              line-height: 15px;
              color: #4f3a01;
              font-style: normal;
            }
          }
        }

        .this_month,
        .last_month {
          display: flex;
          justify-content: space-around;
          align-items: center;

          .month {
            width: 108px;
            border-radius: 6px;
            padding: 20px 1px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;

            .val {
              width: 100%;
              font-family: Helvetica, Helvetica;
              font-weight: bold;
              font-size: 16px;
              color: #000000;
              line-height: 19px;
              font-style: normal;
              margin-bottom: 5px;
              text-align: center;
            }

            .lab {
              width: 100%;
              font-family: Helvetica;
              font-size: 11px;
              color: #4f3a01;
              line-height: 13px;
              font-style: normal;
              text-align: center;
            }
          }
        }

        .this_month {
          margin: 20px auto 10px;

          .month {
            background: linear-gradient(#FAE0BE, #FCEDDC);
          }
        }

        .last_month {
          margin: 10px auto 20px;

          .month {
            background: linear-gradient(#F4C1BF, #FBE9E3);
          }
        }
      }

      .tables {
        width: 100%;
        flex: 1;
        overflow: hidden;
        background: #f4f4f4;
        border-radius: 6px 6px 0;
        padding: 0 12px;

        .th {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid rgba(79, 58, 1, 0.1);

          .td {
            flex: 1;
            padding: 10px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 12px;
            color: #000000;
            font-style: normal;
          }
        }

        .refresh {
          width: 100%;
          height: 100%;
          overflow: hidden;

          .list {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;

            .tr {
              display: flex;
              justify-content: center;
              align-items: center;
              border-bottom: 1px solid rgba(79, 58, 1, 0.1);

              .td {
                flex: 1;
                padding: 10px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
                font-family: Helvetica;
                font-size: 12px;
                color: #606060;
                font-style: normal;
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
    .content {
      .totals {
        .days {
          .day {
            &:nth-child(odd) {
              border-left: 0.5px solid rgba(79, 58, 1, 0.2);
            }

            &:nth-child(even) {
              border-right: 0.5px solid rgba(79, 58, 1, 0.2);
            }
          }
        }
      }
    }
  }
}

.en {
  .container {
    .content {
      .totals {
        .days {
          .day {
            &:nth-child(odd) {
              border-right: 0.5px solid rgba(79, 58, 1, 0.2);
            }

            &:nth-child(even) {
              border-left: 0.5px solid rgba(79, 58, 1, 0.2);
            }
          }
        }
      }
    }
  }
}
</style>
