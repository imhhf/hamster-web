<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getLang, minuteToHour } from "@/utils";
import { AppClose, OpenRoom } from "@/utils/client";
import { showToast } from "vant";
import {
  GUILD_MY_DETAIL, //用户公会主页
  GUILD_MEMBER_APPLY_LIST, //公会成员申请加入列表(消息列表)
  GUILD_MEMBER_APPLY_AUDIT, //公会成员申请加入审核
  GUILD_DISSOLVE, //公会解散
  GUILD_MEMBER_QUIT, //公会成员退出
  GUILD_MEMBER_QUIT_COST, //公会成员退出费用
  GUILD_INVITE_SEARCH, //邀请搜索用户
  GUILD_JOIN_INVITE, //加入公会邀请
} from "@/api/guild";
import moment from "moment";
import i18n from "@/i18n";
import link from "@/assets/img/guild/link.png";
import date from "@/assets/img/guild/date.png";
import card from "@/assets/img/guild/card.png";
import tops from "@/assets/img/guild/tops.png";
import moire from "@/assets/img/guild/moire.png";
import fans from "@/assets/img/guild/fans.png";
import nodata from "@/assets/img/guild/nodata.png";
import WithdrawPopup from "@/components/WithdrawPopup.vue";

// 接收参数
const props = defineProps(["uid", "ticket", "source", "deviceId"]);
const router = useRouter();
const lang = getLang();
let loading = ref(false); //是否加载中
let showWithdrawPopup = ref(false); //提现弹窗显示状态
let infos = reactive({
  guildId: null, //公会ID
  guildName: "", //公会名称
  coverPicUrl: "", //公会封面
  guildNo: null, //公会号
  memberCount: 0, //成员数量"
  memberRole: 3, //成员权限 1会长2管理员3普通成员
  // 我的公会卡片
  memberCard: {
    memberNick: "", //成员昵称
    memberAvatar: "", //成员头像
    memberExperLevelIcon: "", //成员财富等级
    memberCharmLevelIcon: "", //成员魅力等级
    vipIcon: "", //VIP图标
  },
  // 公会数据
  guildData: {
    charmValue: 0, //收礼价值
    micBroadcastDuration: 0, //开播时长(分钟)
    validDays: 0, //有效天数
  },
  // 房间列表
  roomList: [
    // {
    //   roomId: "",//房间id
    //   roomNo: "",//房间号
    //   avatar: "",//房间封面
    //   title: "",//房间名称
    //   heatScore: 0,//房间热度值
    // }
  ],
});
let pops = reactive({
  show: false, //是否弹窗
  type: -1, //类型 1-更多操作，2-消息，3-邀请，4-解散，5-退出
  position: "bottom", //弹窗位置
  // 消息
  mess: {
    page: 1,
    size: 10,
    loading: false,
    finished: false,
    refreshing: false,
    list: [
      // {
      //   applyId: null, //申请id
      //   uid: null, //用户id
      //   nick: "", //用户昵称
      //   avatar: "", //用户头像
      //   applyTime: 0, //申请时间
      //   experLevelIcon: "", //用户财富等级图标
      //   charmLevelIcon: "", //用户魅力等级图标
      //   auditStatus: 0, //审核状态 0未审核 1已通过 2未通过
      // },
      // {
      //   applyId: 1, //申请id
      //   uid: 1010, //用户id
      //   nick: "3662942", //用户昵称
      //   avatar: "https://file.hamsterdw.com/User/1722412875962.jpg", //用户头像
      //   applyTime: 1735630920661, //申请时间
      //   experLevelIcon:
      //     "https://meta-static.yinyou.live/meta/medalLevel/1693911121958.png", //用户财富等级图标
      //   charmLevelIcon:
      //     "https://meta-static.yinyou.live/meta/medalLevel/1693911041998.png", //用户魅力等级图标
      //   auditStatus: 0, //审核状态 0未审核 1已通过 2未通过
      // },
    ],
  },
  // 邀请
  invite: {
    searchKey: "", //搜索关键字 8674012
    target: null, //目标用户信息
    // target: {
    //   avatar: "", //用户头像
    //   erbanNo: null,
    //   inviteStatus: 0, //邀请状态 0-可邀请 1-巳邀请
    //   nick: "", //用户昵称
    //   uid: null, //用户id
    // },
  },
});

// 返回
function goBack() {
  if (props.source === "h5") {
    router.go(-1);
  } else {
    AppClose();
  }
}

// 打开弹窗
function openPops(type) {
  if (type == 1 || type == 2) {
    pops.position = "bottom";
  } else {
    pops.position = "center";
  }
  pops.type = type;
  pops.show = true;
}

// 关闭弹窗
function closePops() {
  pops.type = -1;
  pops.show = false;
  pops.mess.page = 1;
  pops.mess.loading = false;
  pops.mess.finished = false;
  pops.mess.refreshing = false;
  pops.mess.list = [];
  pops.invite.searchKey = "";
  pops.invite.target = null;
}

// 显示更多
function showMore() {
  openPops(1);
}

// 更多操作
function onCtrl(key) {
  switch (key) {
    case "information": //消息
      getMemberApplyList(() => {
        openPops(2);
      });
      break;

    case "invite": //邀请成员
      openPops(3);
      break;

    case "order": //订单
      toOrder();
      break;

    case "withdraw": //提现
      toWithdraw();
      break;

    case "dissolve": //解散公会
      openPops(4);
      break;

    case "quit": //退出公会
      openPops(5);
      break;

    case "cancel": //取消
      closePops();
      break;

    default:
      break;
  }
}

// 前往数据页
function toData() {
  const role = infos.memberRole;

  if (role == 1 || role == 2) {
    // 公会长和管理员可以查看所有成员数据
    router.push({
      path: "/guild/data/monthly",
      query: {
        lang: lang,
        uid: props.uid,
        ticket: props.ticket,
        memberRole: role,
        deviceId: props.deviceId,
      },
    });
  } else {
    router.push({
      path: "/guild/data/member",
      query: {
        lang: lang,
        uid: props.uid,
        ticket: props.ticket,
        memberUid: props.uid,
        memberRole: role,
        deviceId: props.deviceId,
        startDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
      },
    });
  }
}

// 前往名片页
function toCard() {
  router.push({
    path: "/guild/card",
    query: {
      lang: lang,
      uid: props.uid,
      ticket: props.ticket,
    },
  });
}

// 前往订单页
function toOrder() {
  router.push({
    path: "/guild/order",
    query: {
      lang: lang,
      uid: props.uid,
      ticket: props.ticket,
      deviceId: props.deviceId,
    },
  });
}

// 前往提现页
function toWithdraw() {
  showWithdrawPopup.value = true;
}

// 获取用户公会主页
function getMyGuildDetail() {
  loading.value = true;
  GUILD_MY_DETAIL({
    uid: props.uid,
    ticket: props.ticket,
  })
    .then((data) => {
      loading.value = false;
      infos = data;
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 刷新消息列表
function onMsgsRefresh() {
  pops.mess.page = 1;
  pops.mess.finished = false;
  pops.mess.loading = true;
  pops.mess.refreshing = true;

  getMemberApplyList();
}

// 获取公会成员申请加入列表(消息列表)
function getMemberApplyList(cb) {
  GUILD_MEMBER_APPLY_LIST({
    uid: props.uid,
    ticket: props.ticket,
    pageNum: pops.mess.page,
    pageSize: pops.mess.size,
  })
    .then((data) => {
      const { list, whetherLastPage } = data;

      if (pops.mess.refreshing) {
        pops.mess.list = [];
        pops.mess.refreshing = false;
      }

      let msgArr = pops.mess.list;
      if (list && list.length > 0) {
        pops.mess.list = msgArr.concat(list);
      }

      if (!whetherLastPage) {
        pops.mess.page += 1;
      } else {
        pops.mess.finished = true;
      }

      cb && cb();
    })
    .catch((err) => {
      pops.mess.loading = false;
      pops.mess.finished = true;
      showToast(err.message);
    });
}

// 成员申请加入审核处理
function handleApplyAudit(applyId, auditStatus) {
  loading.value = true;
  GUILD_MEMBER_APPLY_AUDIT({
    uid: props.uid,
    ticket: props.ticket,
    applyId: applyId, //审核id
    auditStatus: auditStatus, //审核状态 1同意 2拒绝
  })
    .then(() => {
      loading.value = false;
      closePops();
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 解散公会
function dissolveGuild() {
  loading.value = true;
  GUILD_DISSOLVE({
    uid: props.uid,
    ticket: props.ticket,
    deviceId: props.deviceId, //用户设备号
  })
    .then(() => {
      loading.value = false;
      goBack();
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 退会扣费
function quitGuildCost() {
  loading.value = true;
  GUILD_MEMBER_QUIT_COST({
    uid: props.uid,
  })
    .then(() => {
      loading.value = false;
      quitGuild();
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 退出公会
function quitGuild() {
  loading.value = true;
  GUILD_MEMBER_QUIT({
    uid: props.uid,
    ticket: props.ticket,
  })
    .then(() => {
      loading.value = false;
      goBack();
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 搜索邀请成员
function onInviteSearch() {
  const searchKey = pops.invite.searchKey;

  if (!searchKey) {
    showToast(i18n.global.tm("guild.tips.enterId"));
    return;
  }

  GUILD_INVITE_SEARCH({
    uid: props.uid,
    ticket: props.ticket,
    searchKey: searchKey,
  })
    .then((data) => {
      if (data) {
        pops.invite.target = data;
      } else {
        pops.invite.target = null;
      }
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 加入公会邀请
function onSendInvite() {
  loading.value = true;
  GUILD_JOIN_INVITE({
    uid: props.uid,
    ticket: props.ticket,
    inviteUid: pops.invite.target.uid,
  })
    .then(() => {
      loading.value = false;
      closePops();
      getMyGuildDetail(); //刷新用户公会主页数据
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 跳转到房间
function toRoom(roomId) {
  OpenRoom(roomId);
}

getMyGuildDetail(); //获取用户公会主页数据
</script>

<template>
  <div class="guild">
    <div class="poster">
      <nav-bars :is-left="true" :left-slot="true" :title-slot="true" :is-right="true" :right-slot="true"
        bg-color="transparent">
        <template #left_slot>
          <svg @click="goBack" t="1735394484907" class="back" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="1716" width="200" height="200">
            <path
              d="M705.43 800.05000001l-322.99000001-322.99000001c-21.87-21.87-57.33-21.87-79.2 0-21.87 21.87-21.87 57.33 0 79.2l323.00000001 322.99c21.87 21.87 57.33 21.87 79.2 0 21.86-21.87 21.86-57.33-0.01-79.19999999z"
              fill="#ffffff" p-id="1717"></path>
            <path
              d="M294.25 468.05L617.24 145.07c21.87-21.87 57.33-21.87 79.2 0 21.87 21.87 21.87 57.33 0 79.2l-322.99 322.99c-21.87 21.87-57.33 21.87-79.2 0-21.87-21.88-21.87-57.34 0-79.21z"
              fill="#ffffff" p-id="1718"></path>
          </svg>
        </template>
        <template #title_slot>
          <span>{{ $t("guild.title") }}</span>
        </template>
        <template #right_slot>
          <svg @click="showMore" t="1735395375729" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="1892" width="200" height="200">
            <path d="M505.6 118.4m-118.4 0a118.4 118.4 0 1 0 236.8 0 118.4 118.4 0 1 0-236.8 0Z" p-id="1893"
              fill="#ffffff"></path>
            <path d="M505.6 512m-118.4 0a118.4 118.4 0 1 0 236.8 0 118.4 118.4 0 1 0-236.8 0Z" p-id="1894"
              fill="#ffffff"></path>
            <path d="M505.6 905.6m-118.4 0a118.4 118.4 0 1 0 236.8 0 118.4 118.4 0 1 0-236.8 0Z" p-id="1895"
              fill="#ffffff"></path>
          </svg>
        </template>
      </nav-bars>

      <div class="mine">
        <div class="avatar_box">
          <van-image fit="cover" class="avatar" :src="infos.coverPicUrl" />
        </div>
        <div class="nick">{{ infos.guildName || "-" }}</div>
        <ul class="base">
          <li class="id">
            <span>ID:</span>
            <span>{{ infos.guildNo || "-" }}</span>
          </li>
          <li class="fans">
            <van-image fit="cover" class="icon" :src="fans" />
            <span class="num">{{ infos.memberCount || "-" }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="data blos">
        <div class="labs" @click="toData">
          <van-image fit="cover" class="icon" :src="date" />
          <span class="text">{{ $t("guild.monthlyData") }}</span>
          <van-image fit="cover" class="link" :src="link" />
        </div>

        <ul class="list">
          <li class="item">
            <div class="val">{{ infos.guildData.charmValue }}</div>
            <div class="lab">{{ $t("guild.label.totalIncome") }}</div>
          </li>
          <li class="item">
            <div class="val">{{ minuteToHour(infos.guildData.micBroadcastDuration) }}</div>
            <div class="lab">{{ $t("guild.label.hours") }}</div>
          </li>
          <li class="item">
            <div class="val">{{ infos.guildData.validDays }}</div>
            <div class="lab">{{ $t("guild.label.validDays") }}</div>
          </li>
        </ul>
      </div>

      <div class="card blos">
        <div class="labs">
          <van-image fit="cover" class="icon" :src="card" />
          <span class="text">{{ $t("guild.myCard") }}</span>
        </div>

        <div class="info" @click="toCard">
          <van-image fit="cover" class="avatar" round :src="infos.memberCard.memberAvatar" />
          <div class="base">
            <div class="nick clamp-1">{{ infos.memberCard.memberNick }}</div>
            <div class="lv">
              <van-image v-if="infos.memberCard.memberVipIcon" fit="cover" class="icon"
                :src="infos.memberCard.memberVipIcon" />
              <van-image v-if="infos.memberCard.memberExperLevelIcon" fit="cover" class="icon"
                :src="infos.memberCard.memberExperLevelIcon" />
              <van-image v-if="infos.memberCard.memberCharmLevelIcon" fit="cover" class="icon"
                :src="infos.memberCard.memberCharmLevelIcon" />
            </div>
          </div>
          <van-image fit="cover" class="link" :src="link" />
        </div>
      </div>

      <div class="tops blos">
        <div class="labs">
          <van-image fit="cover" class="icon" :src="tops" />
          <span class="text">{{ $t("guild.topRoom") }}</span>
        </div>

        <ul class="list">
          <template v-if="infos.roomList && infos.roomList.length > 0">
            <li class="item" v-for="(item, idx) in infos.roomList" :key="idx" @click.stop="toRoom(item.roomId)">
              <van-image fit="cover" class="avatar" :src="item.avatar" />
              <div class="info">
                <div class="base">
                  <div class="nick clamp-1">{{ item.title }}</div>
                  <div class="id clamp-1">{{ "ID:" + item.roomNo }}</div>
                </div>
                <div class="vals">
                  <van-image fit="cover" class="icon" :src="moire" />
                  <span class="num">{{ item.heatScore }}</span>
                </div>
              </div>
            </li>
          </template>
          <template v-else>
            <li class="empt">{{ $t("guild.tips.nodata") }}</li>
          </template>
        </ul>
      </div>
    </div>

    <!-- 弹窗 -->
    <van-popup :class="'pops' + pops.type" v-model:show="pops.show" :position="pops.position" @close="closePops">
      <!-- 更多操作按钮 -->
      <template v-if="pops.type == 1">
        <div class="ctrls">
          <van-button class="ctrl" @click="onCtrl('order')">{{
            $t("guild.more.order") }}</van-button>
          <van-button class="ctrl" @click="onCtrl('withdraw')">{{
            $t("guild.more.withdraw") }}</van-button>
          <van-button v-if="infos.memberRole == 1 || infos.memberRole == 2" class="ctrl"
            @click="onCtrl('information')">{{ $t("guild.more.information") }}</van-button>
          <van-button v-if="infos.memberRole == 1 || infos.memberRole == 2" class="ctrl" @click="onCtrl('invite')">{{
            $t("guild.more.invite") }}</van-button>
          <van-button v-if="infos.memberRole == 1" class="ctrl danger" @click="onCtrl('dissolve')">{{
            $t("guild.more.dissolve") }}</van-button>
          <van-button v-if="infos.memberRole == 3" class="ctrl danger" @click="onCtrl('quit')">{{ $t("guild.more.quit")
            }}</van-button>
        </div>
        <van-button class="cancel" @click="onCtrl('cancel')">{{
          $t("guild.more.cancel")
        }}</van-button>
      </template>

      <!-- 消息 -->
      <template v-if="pops.type == 2">
        <div class="mess">
          <div class="header">
            <div class="title">{{ $t("guild.message") }}</div>
            <svg @click="closePops" t="1735629979902" class="icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="1034" width="200" height="200">
              <path
                d="M800.05000001 318.57l-322.99000001 322.99000001c-21.87 21.87-21.87 57.33 0 79.2 21.87 21.87 57.33 21.87 79.2 0l322.99-323.00000001c21.87-21.87 21.87-57.33 0-79.2-21.87-21.86-57.33-21.86-79.19999999 0.01z"
                fill="#938B81" p-id="1035"></path>
              <path
                d="M468.05 729.75L145.07 406.76c-21.87-21.87-21.87-57.33 0-79.2 21.87-21.87 57.33-21.87 79.2 0l322.99 322.99c21.87 21.87 21.87 57.33 0 79.2-21.88 21.87-57.34 21.87-79.21 0z"
                fill="#938B81" p-id="1036"></path>
            </svg>
          </div>
          <div class="msgs">
            <template v-if="pops.mess.list && pops.mess.list.length > 0">
              <van-pull-refresh v-model="pops.mess.refreshing" class="msgs_refresh" @refresh="onMsgsRefresh"
                :pulling-text="$t('other.pullingText')" :loosing-text="$t('other.loosingText')"
                :loading-text="$t('other.loadingText')">
                <van-list class="msgs_list" v-model:loading="pops.mess.loading" :finished="pops.mess.finished"
                  :immediate-check="false" :finished-text="pops.mess.list.length == 0 ? '' : $t('other.finishedText')
                    " :loading-text="' '">
                  <div class="msgs_item" v-for="(item, idx) in pops.mess.list" :key="idx">
                    <div class="info">
                      <van-image class="avatar" fit="cover" round :src="item.avatar" />
                      <div class="base">
                        <div class="desc al-center">
                          <span class="nick clamp-1">{{ item.nick }}</span>
                          <span class="date">{{
                            moment(item.createTime).format("YYYY-MM-DD")
                          }}</span>
                        </div>
                        <div class="icons">
                          <van-image v-if="item.vipIcon" fit="cover" class="icon" :src="item.vipIcon" />
                          <van-image v-if="item.experLevelIcon" fit="cover" class="icon" :src="item.experLevelIcon" />
                          <van-image v-if="item.charmLevelIcon" fit="cover" class="icon" :src="item.charmLevelIcon" />
                        </div>
                      </div>
                    </div>
                    <div class="btns">
                      <van-button class="btn reject" @click="handleApplyAudit(item.applyId, 2)">{{
                        $t("guild.btn.reject") }}</van-button>
                      <van-button class="btn consent" @click="handleApplyAudit(item.applyId, 1)">{{
                        $t("guild.btn.consent") }}</van-button>
                    </div>
                  </div>
                </van-list>
              </van-pull-refresh>
            </template>
            <template v-else>
              <div class="empt">
                <van-image fit="cover" class="icon" :src="nodata" />
                <p class="text">{{ $t("guild.tips.nodata") }}</p>
              </div>
            </template>
          </div>
        </div>
      </template>

      <!-- 邀请 -->
      <template v-if="pops.type == 3">
        <div class="invi">
          <van-button class="close" @click="closePops"></van-button>
          <h1 class="title">{{ $t("guild.more.invite") }}</h1>
          <van-search class="search" v-model="pops.invite.searchKey" show-action :clearable="false" maxlength="8"
            clear-trigger="always" action-text="Search" :placeholder="$t('guild.tips.searchUid')">
            <template #action>
              <div @click="onInviteSearch">{{ $t("guild.btn.search") }}</div>
            </template></van-search>
          <div v-if="pops.invite.target" class="target">
            <van-image fit="cover" class="avatar" round :src="pops.invite.target.avatar" />
            <div class="info">
              <div class="nick">{{ pops.invite.target.nick }}</div>
              <div class="id">
                <span>ID:</span>
                <span>{{ pops.invite.target.erbanNo }}</span>
              </div>
            </div>
            <van-button class="btn" @click="onSendInvite"
              :disabled="pops.invite.target.inviteStatus == 1 ? true : false"
              :class="pops.invite.target.inviteStatus == 0 ? 'act' : 'def'">{{ $t("guild.more.invite") }}</van-button>
          </div>
        </div>
      </template>

      <!-- 解散 -->
      <template v-if="pops.type == 4">
        <div class="diss">
          <h1 class="title">{{ $t("guild.dissolveAgency") }}</h1>
          <p class="remind">{{ $t("guild.tips.dissolveAgency") }}</p>
          <div class="btns">
            <van-button class="btn cancel" @click="closePops">{{
              $t("guild.btn.cancel")
            }}</van-button>
            <van-button class="btn confirm" @click="dissolveGuild">{{
              $t("guild.btn.confirm")
            }}</van-button>
          </div>
        </div>
      </template>

      <!-- 退出 -->
      <template v-if="pops.type == 5">
        <div class="quit">
          <h1 class="title">{{ $t("guild.quitAgency") }}</h1>
          <p class="remind">{{ $t("guild.tips.quitAgency") }}</p>
          <div class="btns">
            <van-button class="btn cancel" @click="closePops">{{
              $t("guild.btn.cancel")
            }}</van-button>
            <van-button class="btn confirm" @click="quitGuildCost">{{
              $t("guild.btn.confirm")
            }}</van-button>
          </div>
        </div>
      </template>
    </van-popup>

    <Loading :show="loading" color="#fff" bg-color="transparent" />

    <!-- 提现弹窗 -->
    <WithdrawPopup
      v-model:show="showWithdrawPopup"
      :bg-image="'https://file.hamsterdw.com/User/withdraw_bg.png'"
      :uid="props.uid"
      :ticket="props.ticket"
      :source="props.source"
      :device-id="props.deviceId"
    />
  </div>
</template>

<style lang="scss" scoped>
.guild {
  width: 100%;
  background: #f1f1f1;

  .poster {
    width: 100%;
    height: 331px;
    background: url("@/assets/img/guild/poster.png") no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;

    .navs {
      width: 100%;
      padding: 44px 10px 0;
      position: relative;

      .back,
      .more {
        .icon {
          width: 22px;
          height: 22px;

          &:active {
            transform: scale(0.9);
          }
        }
      }

      .title {
        flex: 1;
        overflow: hidden;
        font-family: Helvetica;
        font-size: 20px;
        color: #ffffff;
        font-style: normal;
      }
    }

    .mine {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 20px auto 0;
      position: relative;

      .avatar_box {
        width: 87px;
        height: 87px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        &:before {
          content: "";
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          background: url("@/assets/img/guild/avatar_box.png") no-repeat;
          background-position: center;
          background-size: cover;
        }

        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 4px;
        }
      }

      .nick {
        margin: 6px auto 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        font-style: normal;
      }

      .base {
        display: flex;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 12px;
        color: #ffffff;
        line-height: 17px;
        font-style: normal;

        .id {
          margin: 0 15px;

          span {
            display: inline-block;
          }
        }

        .fans {
          display: flex;
          align-items: center;
          margin: 0 15px;

          .icon {
            width: 16px;
            height: 16px;
          }

          .num {
            padding: 0 2px;
          }
        }
      }
    }
  }

  .container {
    width: 100%;
    min-height: 50px;
    padding: 10px;
    background: #f1f1f1;
    border-radius: 12px 12px 0px 0px;
    margin-top: -50px;
    position: relative;

    .blos {
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      margin: 0 auto 10px;
      padding: 10px;

      .labs {
        display: flex;
        align-items: center;

        .icon {
          width: 16px;
          height: 16px;
        }

        .text {
          flex: 1;
          overflow: hidden;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 12px;
          color: #000000;
          font-style: normal;
          padding: 0 4px;
        }

        .link {
          width: 12px;
          height: 12px;
        }
      }
    }

    .data {
      .list {
        width: 100%;
        display: flex;
        margin-top: 10px;

        .item {
          flex: 1;
          flex-shrink: 0;
          height: 78px;
          background: linear-gradient(180deg, rgba(179, 122, 247, 0.37) 0%, rgba(179, 122, 247, 0.14) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          text-align: center;

          &:nth-child(even) {
            margin: 0 6px;
          }

          .val {
            width: 100%;
            padding: 0 10px;
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
            padding: 0 10px;
            font-family: Helvetica;
            font-size: 12px;
            color: #4f3a01;
            line-height: 15px;
            font-style: normal;
          }
        }
      }
    }

    .card {
      .info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;

        .avatar {
          width: 50px;
          height: 50px;
        }

        .base {
          flex: 1;
          padding: 0 10px;
          overflow: hidden;

          .nick {
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 12px;
            color: #121212;
            line-height: 15px;
            font-style: normal;
          }

          .lv {
            margin-top: 6px;
            display: flex;

            .icon {
              width: 35px;
              height: 16px;
              margin-right: 7px;
            }
          }
        }

        .link {
          width: 12px;
          height: 12px;
        }
      }
    }

    .tops {
      .list {
        width: 100%;
        margin-top: 10px;

        .item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0px auto;
          border: 1px solid transparent;

          .avatar {
            width: 50px;
            height: 50px;
            border-radius: 6px;
            overflow: hidden;
          }

          .info {
            flex: 1;
            overflow: hidden;
            border-bottom: 1px solid #f1f1f1;
            padding: 10px 0 14px;
            display: flex;
            align-items: center;
            justify-content: center;

            .base {
              flex: 1;
              overflow: hidden;

              .nick {
                font-family: Helvetica, Helvetica;
                font-weight: bold;
                font-size: 12px;
                color: #121212;
                line-height: 15px;
                font-style: normal;
                margin: 8px 0 6px;
              }

              .id {
                font-family: Helvetica;
                font-size: 12px;
                color: #606060;
                line-height: 15px;
                font-style: normal;
              }
            }

            .vals {
              .icon {
                width: 14px;
                height: 14px;
                margin-right: 5px;
              }

              .num {
                font-family: Helvetica, Helvetica;
                font-weight: bold;
                font-size: 12px;
                color: #fa8f29;
                line-height: 15px;
                font-style: normal;
              }
            }
          }

          &:last-child {
            .info {
              border-bottom: none;
            }
          }
        }

        .empt {
          text-align: center;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 12px;
          color: #ccc;
          line-height: 15px;
          font-style: normal;
          margin: 20px auto;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.views_wrap {
  background: #f1f1f1;
}

.guild {
  .van-overlay {
    background: rgba(0, 0, 0, 0.4);
  }

  .pops1 {
    width: 100%;
    background: transparent;
    padding: 0 15px;

    .ctrls {
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 10px;

      .ctrl {
        width: 100%;
        display: block;
        background: #ffffff;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #121212;
        font-style: normal;
        border: none;
        border-radius: 0;
        margin: -1px auto;
        padding: 29px;
      }

      .danger {
        color: #ff5555;
      }
    }

    .cancel {
      width: 100%;
      background: #ffffff;
      margin: 0 auto 34px;
      padding: 29px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #121212;
      font-style: normal;
      border: none;
    }
  }

  .pops2 {
    width: 100%;
    background: transparent;
    overflow: hidden;

    .mess {
      width: 100%;
      height: 453px;
      border-radius: 15px 15px 0px 0px;
      background: linear-gradient(#ffffff, #ffffff);
      display: flex;
      flex-direction: column;

      .header {
        width: 100%;
        position: relative;

        .title {
          width: 100%;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 16px;
          color: #000000;
          line-height: 19px;
          text-align: right;
          font-style: normal;
          padding: 20px 10px;
          text-align: center;
        }

        .icon {
          width: 18px;
          height: 18px;
          position: absolute;
          top: 24px;
        }
      }

      .msgs {
        flex: 1;
        overflow: hidden;

        .msgs_refresh {
          width: 100%;
          height: 100%;

          .msgs_list {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0 10px;

            .msgs_item {
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              margin-bottom: 16px;
              width: 100%;

              .info {
                display: flex;

                .avatar {
                  width: 47px;
                  height: 47px;
                  margin-right: 10px;
                }

                .base {
                  flex: 1;
                  overflow: hidden;

                  .desc {
                    margin: 4px auto 7px;

                    .nick {
                      flex: 1;
                      overflow: hidden;
                      font-family: Helvetica, Helvetica;
                      font-weight: bold;
                      font-size: 13px;
                      color: #000000;
                      font-style: normal;
                    }

                    .date {
                      font-family: Helvetica;
                      font-size: 13px;
                      color: #948c82;
                      font-style: normal;
                    }
                  }

                  .icons {
                    display: flex;

                    .icon {
                      width: 33px;
                      height: 15px;
                    }
                  }
                }
              }

              .btns {
                width: 100%;
                margin: 16px auto;
                display: flex;
                justify-content: space-between;

                .btn {
                  width: 168px;
                  border-radius: 18px;
                  font-family: Helvetica, Helvetica;
                  font-weight: bold;
                  font-size: 12px;
                  font-style: normal;
                  display: block;
                  justify-content: center;
                  align-items: center;
                  padding: 11px;
                  border: none;
                }

                .reject {
                  color: #b5b5b2;
                  background: #e5e5e5;
                }

                .consent {
                  color: #ffffff;
                  background: linear-gradient(#B936FF, #5C00FE);
                }
              }
            }
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

  .pops3 {
    width: 300px;
    background: transparent;
    overflow: hidden;

    .invi {
      width: 100%;
      height: 302px;
      padding: 16px;
      background: url("@/assets/img/guild/invite.png") no-repeat;
      background-position: center;
      background-size: cover;
      position: relative;

      .close {
        width: 12px;
        height: 12px;
        border: none;
        background: url("@/assets/img/guild/close.png") no-repeat;
        background-position: center;
        background-size: cover;
        position: absolute;
        top: 55px;
        padding: 9px;
      }

      .title {
        font-family: Helvetica, Helvetica;
        font-weight: bold;
        font-size: 18px;
        color: #121212;
        line-height: 22px;
        text-align: center;
        font-style: normal;
        padding: 79px 10px 15px;
      }

      .search {
        width: 100%;
        background: rgba(130, 130, 130, .1);
        border-radius: 6px;
        padding: 5px;

        .van-search__content {
          background: transparent;
          padding: 0 3px;

          .van-search__field {
            background: transparent;

            .van-field__control {
              &::placeholder {
                color: #999999;
              }
            }
          }
        }

        .van-search__action {
          padding: 0 26px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 12px;
          color: #ffffff;
          font-style: normal;
          background: linear-gradient(#AC41F6, #520BF5);
          border-radius: 18px;
        }
      }

      .target {
        width: 100%;
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar {
          width: 50px;
          height: 50px;
        }

        .info {
          flex: 1;
          padding: 0 13px;
          overflow: hidden;

          .nick {
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 12px;
            color: #000000;
            // text-align: left;
            font-style: normal;
            margin-bottom: 6px;
          }

          .id {
            font-family: Helvetica;
            font-size: 12px;
            color: #606060;
            // text-align: left;
            font-style: normal;

            span {
              display: inline-block;
            }
          }
        }

        .btn {
          height: auto;
          border-radius: 18px;
          padding: 8px 20px;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 12px;
          font-style: normal;
          border: none;
        }

        .act {
          background: #ffe278;
          color: #606060;
        }

        .def {
          background: #e5e5e5;
          color: #b5b5b2;
        }
      }
    }
  }

  .pops4,
  .pops5 {
    background: transparent;
    overflow: hidden;
    width: 327px;

    .diss,
    .quit {
      width: 100%;
      background: linear-gradient(#E7CDFF, #F5EBFF);
      border-radius: 15px;
      overflow: hidden;
      padding: 30px 18px;

      .title {
        height: 19px;
        font-family: Helvetica, Helvetica;
        font-weight: bold;
        font-size: 16px;
        color: #000000;
        line-height: 19px;
        font-style: normal;
        text-align: center;
      }

      .remind {
        width: 100%;
        font-family: Helvetica;
        font-size: 14px;
        color: #000000;
        line-height: 17px;
        text-align: center;
        font-style: normal;
        padding: 30px 0;
      }

      .btns {
        display: flex;
        justify-content: space-between;

        .btn {
          width: 140px;
          height: 49px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 25px;
          border: none;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 14px;
          font-style: normal;
        }

        .cancel {
          color: #b5b5b2;
          background: #e5e5e5;
        }

        .confirm {
          color: #ffffff;
          background: linear-gradient(#B936FF, #5C00FF);
        }
      }
    }
  }
}

.ara {
  .container {
    .blos {

      .labs,
      .info {
        .link {
          transform: rotateZ(180deg);
        }
      }
    }

    .tops {
      .list {
        .item {
          .avatar {
            margin-left: 10px;
          }
        }
      }
    }
  }

  .pops2 {
    .mess {
      .header {
        .icon {
          left: 10px;
        }
      }

      .msgs {
        .msgs_refresh {
          .msgs_list {
            .msgs_item {
              .info {
                .avatar {
                  margin-left: 10px;
                }

                .base {
                  .desc {
                    .nick {
                      text-align: right;
                    }
                  }

                  .icons {
                    .icon {
                      margin-left: 6px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .pops3 {
    .invi {
      .close {
        left: 15px;
      }

      .search {
        .van-search__content {
          .van-search__field {
            .van-field__control {
              text-align: right;
            }
          }
        }
      }
    }
  }
}

.en {
  .container {
    .tops {
      .list {
        .item {
          .avatar {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .pops2 {
    .mess {
      .header {
        .icon {
          right: 10px;
        }
      }

      .msgs {
        .msgs_refresh {
          .msgs_list {
            .msgs_item {
              .info {
                .avatar {
                  margin-right: 10px;
                }

                .base {
                  .desc {
                    .nick {
                      text-align: left;
                    }
                  }

                  .icons {
                    .icon {
                      margin-right: 6px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .pops3 {
    .invi {
      .close {
        right: 15px;
      }
    }
  }
}
</style>
