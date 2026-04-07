<template>
  <div class="data">
    <nav-bars :is-left="true" :left-slot="true" :title="$t('guild.weekData')" :is-right="true" :right-slot="true" title-color="#be9021"
      bg-color="">
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
      <div class="dates" @click="calendar.show = true">
        <van-image class="clock" :src="clock" fit="cover" />
        <span class="date">{{ calendar.date1 }}</span>
        <span class="colo"> - </span>
        <span class="date">{{ calendar.date2 }}</span>
      </div>

      <!-- 滚动区域：使用 van-pull-refresh 作为滚动容器 -->
      <van-pull-refresh 
        v-model="refreshing" 
        class="refresh-container"
        @refresh="refreshGuildHistoryData"
        :pulling-text="$t('other.pullingText')" 
        :loosing-text="$t('other.loosingText')"
        :loading-text="$t('other.loadingText')"
      >
        <!-- van-list 不再独立滚动，由父容器滚动 -->
        <van-list 
          ref="listRef" 
          v-model:loading="loading" 
          :finished="finished" 
          :finished-text="list.length == 0 ? '' : $t('other.finishedText')"
          :loading-text="' '"
          :offset="100"
          :immediate-check="false"
        >
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
                  <div class="lab clamp-1">{{ $t("guild.label.totalIncome") }}</div>
                </li>
                <li class="total">
                  <div class="val clamp-1">{{ minuteToHour(item.micBroadcastDuration) }}</div>
                  <div class="lab clamp-1">{{ $t("guild.label.hours") }}</div>
                </li>
                <li class="total">
                  <div class="val clamp-1">{{ item.validDays }}</div>
                  <div class="lab clamp-1">{{ $t("guild.label.validDays") }}</div>
                </li>
              </ol>
            </div>
          </template>
        </van-list>
      </van-pull-refresh>

      <!-- 回到顶部按钮 -->
      <transition name="fade">
        <div v-show="showBackTop" class="back-top" @click="scrollToTop">
          <svg viewBox="0 0 1024 1024" width="24" height="24" fill="white">
            <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"/>
          </svg>
        </div>
      </transition>
    </div>

    <van-calendar 
      v-model:show="calendar.show" 
      v-model="calendar.selectedDates"
      :min-date="calendar.minDate" 
      :max-date="calendar.maxDate" 
      type="range"
      @confirm="onCalendar" 
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getLang, minuteToHour } from "@/utils";
import { showToast } from "vant";
import {
  GUILD_HISTORY_DATA_FOR_GUILD_ID,
} from "@/api/guild";
import clock from "@/assets/img/guild/clock.png";
import link from "@/assets/img/guild/link.png";
import moment from "moment";
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import nodata from "@/assets/img/guild/nodata.png";

const props = defineProps(["uid", "ticket", "memberRole", "deviceId"]);
const router = useRouter();
const lang = getLang();
Locale.use("en-US", enUS);

// ---------- 辅助函数 ----------
function getFullNaturalWeekRange() {
  const weekStart = moment().startOf('isoWeek');
  const weekEnd = moment().endOf('isoWeek');
  return {
    start: weekStart.format("YYYY-MM-DD"),
    end: weekEnd.format("YYYY-MM-DD")
  };
}

function getDefaultSelectedDates() {
  const today = moment();
  const weekStart = moment().startOf('isoWeek');
  const weekEnd = moment().endOf('isoWeek');
  if (weekEnd.isSameOrBefore(today, 'day')) {
    return [weekStart.toDate(), weekEnd.toDate()];
  } else {
    return [weekStart.toDate(), today.toDate()];
  }
}

const { start: displayStart, end: displayEnd } = getFullNaturalWeekRange();
const defaultSelected = getDefaultSelectedDates();

let calendar = reactive({
  show: false,
  minDate: new Date(2024, 0, 1),
  maxDate: new Date(),
  date1: displayStart,
  date2: displayEnd,
  selectedDates: defaultSelected
});

let loading = ref(false);
let finished = ref(false);
let refreshing = ref(false);
let page = ref(1);
let size = ref(10);
let list = ref([]);

// 滚动相关
const listRef = ref(null);  // 这里指向 van-list 组件实例，主要用于 scrollToTop
const showBackTop = ref(false);
let scrollElement = null;   // 实际的滚动容器（van-pull-refresh 内部滚动元素）

function goBack() {
  router.go(-1);
}

function onCalendar(value) {
  const [start, end] = value;
  calendar.date1 = moment(start).format("YYYY-MM-DD");
  calendar.date2 = moment(end).format("YYYY-MM-DD");
  calendar.selectedDates = [start, end];
  calendar.show = false;
  refreshGuildHistoryData();
}

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

function refreshGuildHistoryData() {
  page.value = 1;
  finished.value = false;
  loading.value = true;
  refreshing.value = true;
  getGuildHistoryData();
}

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
          list.value = [];
          refreshing.value = false;
        }
        if (data.list && data.list.length > 0) {
          if (page.value === 1) {
            list.value = data.list;
          } else {
            list.value.push(...data.list);
          }
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

// 滚动处理函数（监听外层滚动容器）
function handleScroll() {
  if (!scrollElement) return;
  const scrollTop = scrollElement.scrollTop;
  showBackTop.value = scrollTop > 300;
}

// 滚动到顶部
function scrollToTop() {
  if (!scrollElement) return;
  scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
}

// 获取实际的滚动元素（van-pull-refresh 内部会生成一个滚动容器）
function getScrollElement() {
  // 根据 Vant 的 DOM 结构，滚动元素通常是 .van-pull-refresh 内部的 div
  const pullRefreshEl = document.querySelector('.refresh-container');
  if (pullRefreshEl) {
    // 找到实际滚动元素（Vant 内部使用的滚动容器）
    const scrollDiv = pullRefreshEl.querySelector('.van-pull-refresh__track');
    return scrollDiv || pullRefreshEl;
  }
  return window;
}

onMounted(() => {
  // 延迟获取滚动元素，确保 DOM 渲染完成
  setTimeout(() => {
    scrollElement = getScrollElement();
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }
  }, 100);
});

onUnmounted(() => {
  if (scrollElement) {
    scrollElement.removeEventListener('scroll', handleScroll);
  }
});

// 初始化加载
getGuildHistoryData();
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background: linear-gradient(180deg, RGBA(182, 52, 255, 1) 0%, RGBA(90, 0, 255, 1) 100%) !important;
}
:deep(.van-nav-bar__title) span {
  color: #FFFFFF !important;
}

.data {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

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
      flex-shrink: 0;
      .clock {
        width: 16px;
        height: 16px;
        margin: 0 6px;
      }
      .date, .colo {
        font-family: Helvetica;
        font-size: 14px;
        color: #606060;
        font-style: normal;
      }
      .colo {
        margin: 0 5px;
      }
    }

    // 滚动容器
    .refresh-container {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;  // 提升滚动流畅度
      margin-top: 10px;
      
      // 确保内部列表不产生额外滚动条
      .van-list {
        min-height: 100%;
      }
    }

    .item {
      background: #ffffff;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 10px;

      .info {
        display: flex;
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
          font-weight: bold;
          font-size: 12px;
          color: #121212;
        }
        .link {
          width: 12px;
          height: 12px;
        }
      }
      .totals {
        display: flex;
        justify-content: space-around;
        margin: 10px auto 0;
        .total {
          width: 108px;
          background: linear-gradient(180deg, rgba(179, 122, 247, 0.37) 0%, rgba(179, 122, 247, 0.14) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 10px;
          text-align: center;
          .val {
            font-weight: bold;
            font-size: 16px;
            color: #000000;
            margin-bottom: 4px;
          }
          .lab {
            font-size: 12px;
            color: #4f3a01;
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }

    .empt {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 40px;
      .icon {
        width: 176px;
        height: 176px;
      }
      .text {
        font-size: 16px;
        color: #b7b7b7;
        margin-top: 13px;
      }
    }

    .back-top {
      position: fixed;
      bottom: 60px;
      right: 16px;
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      cursor: pointer;
      backdrop-filter: blur(4px);
      svg {
        width: 24px;
        height: 24px;
        fill: white;
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.3s;
    }
    .fade-enter-from, .fade-leave-to {
      opacity: 0;
    }
  }
}
</style>

<style lang="scss">
.views_wrap, .data {
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
  .van-calendar__footer .van-button {
    background: #f4e19f;
    border-color: #f4e19f;
  }
}
.ara {

          .link {
            transform: rotateZ(180deg);
          }
}
</style>