<!--
  公会首页 Index.vue
  路径：/guild/index

  功能说明：
  1. 显示用户当前加入的公会信息（封面、名称、ID、成员数）
  2. 展示公会数据统计（总收入、总时长、有效天数）
  3. 显示公会名片入口
  4. 展示公会TOP10房间列表
  5. 提供操作菜单（订单、提现、消息、邀请、解散、退出）

  页面参数：
  - uid: 当前用户ID
  - ticket: 登录凭证
  - source: 来源标识（h5/App）
  - deviceId: 设备ID
-->

<script setup>
/**
 * ==================== 依赖导入 ====================
 */
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

// 工具函数：获取语言设置、分钟转小时格式
import { getLang, minuteToHour } from "@/utils";

// 客户端能力：AppClose关闭页面、OpenRoom打开房间
import { AppClose, OpenRoom } from "@/utils/client";

// Vant 提示组件
import { showToast } from "vant";
// showToast('المستخدم في الوكالة بالفعل، لا يمكن تعيينه كـ BD.')

// API 接口
import {
  GUILD_MY_DETAIL,              // 获取用户公会主页数据
  GUILD_MEMBER_APPLY_LIST,      // 获取申请加入列表（消息列表）
  GUILD_MEMBER_APPLY_AUDIT,     // 审核申请（同意/拒绝）
  GUILD_DISSOLVE,               // 解散公会
  GUILD_MEMBER_QUIT,             // 退出公会
  GUILD_MEMBER_QUIT_COST,       // 获取退出费用
  GUILD_INVITE_SEARCH,           // 搜索用户（用于邀请）
  GUILD_JOIN_INVITE,            // 发送邀请
  GUILD_CREATE_SUB_AGENCY,      // 创建子公会
} from "@/api/guild";

import { SEARCH_USER } from "@/api/user";  // 根据 erbanNo 搜索用户

// 日期处理库
import moment from "moment";

// 国际化实例
import i18n from "@/i18n";

// 图片资源
import link from "@/assets/img/guild/link.png";       // 箭头图标
import date from "@/assets/img/guild/date.png";       // 日期图标
import card from "@/assets/img/guild/card.png";        // 名片图标
import tops from "@/assets/img/guild/tops.png";       // TOP图标
import moire from "@/assets/img/guild/moire.png";    // 热度图标
import fans from "@/assets/img/guild/fans.png";       // 成员数图标
import nodata from "@/assets/img/guild/nodata.png";  // 无数据占位图

// 提现弹窗组件
import WithdrawPopup from "@/components/WithdrawPopup.vue";

/**
 * ==================== 接收路由参数 ====================
 * 这些参数从 URL query 中自动传入
 * 例如：/guild/index?uid=123&ticket=abc&source=h5&deviceId=xxx
 */
const props = defineProps(["uid", "ticket", "source", "deviceId"]);

/**
 * ==================== 路由实例 ====================
 * 用于页面跳转和返回
 */
const router = useRouter();

/**
 * ==================== 基础数据 ====================
 */
const lang = getLang();                    // 当前语言（en/ara）
let loading = ref(false);                  // 页面loading状态
let showWithdrawPopup = ref(false);        // 提现弹窗显示状态
// 计算属性：创建按钮是否可用（有搜索结果且机构名称不为空）
let canCreate = computed(() => {
  return pops.createAgency.searchResult && pops.createAgency.agencyName.trim();
});

/**
 * ==================== 公会信息数据 ====================
 * infos 对象存储公会主页的所有数据
 */
let infos = reactive({
  guildId: null,        // 公会ID
  guildName: "",        // 公会名称
  coverPicUrl: "",      // 公会封面图片URL
  guildNo: null,        // 公会号（展示用ID）
  memberCount: 0,      // 成员数量
  memberRole: 3,       // 当前用户在公会的角色：1=会长 2=管理员 3=普通成员

  // 我的公会名片信息
  memberCard: {
    memberNick: "",                // 成员昵称
    memberAvatar: "",               // 成员头像
    memberExperLevelIcon: "",       // 财富等级图标URL
    memberCharmLevelIcon: "",       // 魅力等级图标URL
    memberVipIcon: "",             // VIP图标URL
  },

  // 公会数据统计
  guildData: {
    charmValue: 0,               // 收礼价值（总收入）
    micBroadcastDuration: 0,     // 开播总时长（分钟）
    validDays: 0,                // 有效天数
  },

  // 公会房间列表
  roomList: [
    // 数据结构示例：
    // {
    //   roomId: "xxx",           // 房间ID
    //   roomNo: "12345",         // 房间号
    //   avatar: "url",           // 房间封面
    //   title: "房间名称",       // 房间标题
    //   heatScore: 1000,         // 热度值
    // }
  ],
});

/**
 * ==================== 弹窗数据状态 ====================
 * pops 对象管理各种弹窗的状态和数据
 */
let pops = reactive({
  show: false,        // 弹窗是否显示
  type: -1,           // 弹窗类型：
                     // -1 = 无弹窗
                     // 1 = 更多操作菜单
                     // 2 = 消息列表（申请审核）
                     // 3 = 邀请成员
                     // 4 = 解散公会确认
                     // 5 = 退出公会确认
                     // 6 = 创建公会弹窗
  position: "bottom", // 弹窗位置：bottom=底部弹出 center=居中显示

  // 创建公会弹窗
  createAgency: {
    show: false,      // 弹窗显示状态
    agentId: "",       // Agency agent ID
    agencyName: "",   // Agency name
    searching: false, // 搜索loading状态
    createLoading: false, // 创建loading状态
    searchResult: null,  // 搜索结果
  },

  // 消息列表数据（申请加入审核）
  mess: {
    page: 1,           // 当前页码
    size: 10,          // 每页条数
    loading: false,    // 是否加载中
    finished: false,   // 是否加载完成（无更多数据）
    refreshing: false, // 是否下拉刷新中
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

  // 邀请成员数据
  invite: {
    searchKey: "",    // 搜索关键词（用户ID/昵称）
    target: null,     // 搜索到的目标用户信息
                     // {
                     //   avatar: "url",         // 用户头像
                     //   erbanNo: 123456,      // 用户ID
                     //   inviteStatus: 0,       // 邀请状态：0=可邀请 1=已邀请
                     //   nick: "昵称",         // 用户昵称
                     //   uid: 789              // 用户ID
                     // }
  },
});

/**
 * ==================== 页面方法 ====================
 */

/**
 * 返回上一页
 * 根据来源决定是路由返回还是关闭APP
 */
function goBack() {
  if (props.source === "h5") {
    // H5环境：��用路由返回上一页
    router.go(-1);
  } else {
    // App环境：调用原生方法关闭页面
    AppClose();
  }
}

/**
 * 打开弹窗
 * @param {number} type - 弹窗类型
 */
function openPops(type) {
  // 类型1和2是从底部弹出，其他居中显示
  if (type == 1 || type == 2) {
    pops.position = "bottom";
  } else {
    pops.position = "center";
  }
  pops.type = type;
  pops.show = true;
}

/**
 * 关闭弹窗
 * 重置所有弹窗相关状态
 */
function closePops() {
  pops.type = -1;
  pops.show = false;

  // 重置消息列表状态
  pops.mess.page = 1;
  pops.mess.loading = false;
  pops.mess.finished = false;
  pops.mess.refreshing = false;
  pops.mess.list = [];

  // 重置邀请搜索状态
  pops.invite.searchKey = "";
  pops.invite.target = null;
}

/**
 * 显示更多操作菜单
 */
function showMore() {
  openPops(1);
}

/**
 * 操作菜单点击处理
 * @param {string} key - 操作标识
 */
function onCtrl(key) {
  switch (key) {
    case "information":  // 查看消息/申请列表
      getMemberApplyList(() => {
        openPops(2);
      });
      break;

    case "invite":      // 邀请成员
      openPops(3);
      break;

    case "order":       // 查看订单
      toOrder();
      break;

    case "withdraw":   // 提现
      toWithdraw();
      break;

    case "dissolve":   // 解散公会（仅会长可见）
      openPops(4);
      break;

    case "quit":       // 退出公会（仅普通成员可见）
      openPops(5);
      break;

    case "createAgency": // 创建公会（仅会长可见）
      closePops();
      pops.createAgency.show = true;
      break;

    case "cancel":     // 取消
      closePops();
      break;

    default:
      break;
  }
}

/**
 * 跳转到数据页面
 * 会长/管理员：进入月度数据页面（查看所有成员数据）
 * 普通成员：进入个人数据页面（只看自己的数据）
 */
function toData() {
  const role = infos?.memberRole;

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
    // 普通成员只看自己的数据
    router.push({
      path: "/guild/data/member",
      query: {
        lang: lang,
        uid: props.uid,
        ticket: props.ticket,
        memberUid: props.uid,     // 成员ID=当前用户ID
        memberRole: role,
        deviceId: props.deviceId,
        // startDate: moment().subtract(1, "day").format("YYYY-MM-DD"),  // 默认昨天
        // endDate: moment().format("YYYY-MM-DD"),                       // 默认今天
      },
    });
  }
}

/**
 * 跳转到公会名片页面
 */
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

/**
 * 跳转到订单页面
 */
function toOrder() {
  closePops();  // 先关闭操作菜单
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

/**
 * 打开提现弹窗
 */
function toWithdraw() {
  closePops();  // 先关闭操作菜单
  showWithdrawPopup.value = true;
}

/**
 * 获取用户公会主页数据
 * 调用接口获取公会的所有信息
 */
function getMyGuildDetail() {
  loading.value = true;
  GUILD_MY_DETAIL({
    uid: props.uid,
    ticket: props.ticket,
  })
    .then((data) => {
      loading.value = false;
      infos = data;  // 更新公会信息
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

/**
 * 下拉刷新消息列表
 */
function onMsgsRefresh() {
  pops.mess.page = 1;
  pops.mess.finished = false;
  pops.mess.loading = true;
  pops.mess.refreshing = true;

  getMemberApplyList();
}

/**
 * 获取公会成员申请加入列表
 * @param {Function} cb - 回调函数（获取数据后执行，如打开弹窗）
 */
function getMemberApplyList(cb) {
  GUILD_MEMBER_APPLY_LIST({
    uid: props.uid,
    ticket: props.ticket,
    pageNum: pops.mess.page,
    pageSize: pops.mess.size,
  })
    .then((data) => {
      const { list, whetherLastPage } = data;

      // 刷新时清空列表
      if (pops.mess.refreshing) {
        pops.mess.list = [];
        pops.mess.refreshing = false;
      }

      let msgArr = pops.mess.list;

      // 合并新数据
      if (list && list.length > 0) {
        pops.mess.list = msgArr.concat(list);
      }

      // 判断是否还有下一页
      if (!whetherLastPage) {
        pops.mess.page += 1;
      } else {
        pops.mess.finished = true;
      }

      // 执行回调
      cb && cb();
    })
    .catch((err) => {
      pops.mess.loading = false;
      pops.mess.finished = true;
      showToast(err.message);
    });
}

/**
 * 处理成员申请审核
 * @param {number} applyId - 申请记录ID
 * @param {number} auditStatus - 审核状态：1=同意 2=拒绝
 */
function handleApplyAudit(applyId, auditStatus) {
  loading.value = true;
  GUILD_MEMBER_APPLY_AUDIT({
    uid: props.uid,
    ticket: props.ticket,
    applyId: applyId,
    auditStatus: auditStatus,
  })
    .then(() => {
      loading.value = false;
      closePops();  // 关闭弹窗
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

/**
 * 解散公会
 * 仅会长可执行，执行后返回上一页
 */
function dissolveGuild() {
  loading.value = true;
  GUILD_DISSOLVE({
    uid: props.uid,
    ticket: props.ticket,
    deviceId: props.deviceId,
  })
    .then(() => {
      loading.value = false;
      goBack();  // 返回上一页
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

/**
 * 获取退出公会费用
 * 先获取费用，确认后再执行退出
 */
function quitGuildCost() {
  loading.value = true;
  GUILD_MEMBER_QUIT_COST({
    uid: props.uid,
  })
    .then(() => {
      loading.value = false;
      quitGuild();  // 获取费用成功后执行退出
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

/**
 * 关闭创建公会弹窗
 */
function closeCreateAgency() {
  pops.createAgency.show = false;
  pops.createAgency.agentId = "";
  pops.createAgency.agencyName = "";
  pops.createAgency.searchResult = null;
}

/**
 * 搜索 Agency agent
 */
function onSearchAgent() {
  if (!pops.createAgency.agentId.trim()) return;
  pops.createAgency.searching = true;
  pops.createAgency.searchResult = null;
  GUILD_INVITE_SEARCH({
        uid: props.uid,
    ticket: props.ticket,
    searchKey: pops.createAgency.agentId.trim(),
    // uid: props.uid,
    // erbanNo: pops.createAgency.agentId.trim(),
    // searchType: 1,
  })
    .then((data) => {
      pops.createAgency.searching = false;
      if (data) {
        pops.createAgency.searchResult = data;
      }
    })
    .catch((err) => {
      pops.createAgency.searching = false;
      showToast(err.message);
    });
}

/**
 * 创建 Agency
 */
function onCreateAgency() {
  if (!canCreate.value) return;
  pops.createAgency.createLoading = true;
  GUILD_CREATE_SUB_AGENCY({
    uid: props.uid,
    ticket: props.ticket,
    targetUid: pops.createAgency.searchResult.uid,
    guildName: pops.createAgency.agencyName.trim(),
  })
    .then(() => {
      pops.createAgency.createLoading = false;
      closeCreateAgency();
      showToast("Agency created successfully");
      getMyGuildDetail();  // 刷新公会详情
    })
    .catch((err) => {
      pops.createAgency.createLoading = false;
      showToast(err.message);
    });
}

/**
 * 退出公会
 * 普通成员执行，执行后返回上一页
 */
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

/**
 * 搜索要邀请的用户
 * 根据输入的用户ID搜索用户信息
 */
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
        pops.invite.target = data;  // 保存搜索到的用户
      } else {
        pops.invite.target = null;   // 未找到用户
      }
    })
    .catch((err) => {
      showToast(err.message);
    });
}

/**
 * 发送公会邀请
 * 向目标用户发送加入公会的邀请
 */
function onSendInvite() {
  loading.value = true;
  GUILD_JOIN_INVITE({
    uid: props.uid,
    ticket: props.ticket,
    inviteUid: pops.invite.target.uid,  // 被邀请用户ID
  })
    .then(() => {
      loading.value = false;
      closePops();
      getMyGuildDetail();  // 刷新公会数据
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

/**
 * 打开直播间
 * @param {string} roomId - 房间ID
 */
function toRoom(roomId) {
  OpenRoom(roomId);
}

/**
 * ==================== 页面初始化 ====================
 * 组件创建时自动获取公会数据
 */
getMyGuildDetail();
</script>

<template>
  <div class="guild">
    <!-- ==================== 公会封面区域 ==================== -->
    <div class="poster">
      <!-- 导航栏：透明背景，显示返回和更多按钮 -->
      <nav-bars
        :is-left="true"
        :left-slot="true"
        :title-slot="true"
        :is-right="true"
        :right-slot="true"
        bg-color="transparent"
      >
        <!-- 左侧返回按钮 -->
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

        <!-- 中间标题 -->
        <template #title_slot>
          <span>{{ $t("guild.title") }}</span>
        </template>

        <!-- 右侧更多按钮 -->
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

      <!-- 公会信息卡片 -->
      <div class="mine">
        <!-- 公会头像 -->
        <div class="avatar_box">
          <van-image fit="cover" class="avatar" :src="infos?.coverPicUrl" />
        </div>
        <!-- 公会名称 -->
        <div class="nick">{{ infos?.guildName || "-" }}</div>
        <!-- 公会基础信息：ID和成员数 -->
        <ul class="base">
          <li class="id">
            <span>ID:</span>
            <span>{{ infos?.guildNo || "-" }}</span>
          </li>
          <li class="fans">
            <van-image fit="cover" class="icon" :src="fans" />
            <span class="num">{{ infos?.memberCount || "-" }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- ==================== 内容区域 ==================== -->
    <div class="container">
      <!-- 数据统计卡片 -->
      <div class="data blos">
        <!-- 标题栏（可点击跳转数据页） -->
        <div class="labs" @click="toData">
          <van-image fit="cover" class="icon" :src="date" />
          <span class="text">{{ $t("guild.monthlyData") }}</span>
          <van-image fit="cover" class="link" :src="link" />
        </div>
        <!-- 统计数据：总收入、总时长、有效天数 -->
        <ul class="list">
          <li class="item">
            <div class="val">{{ infos?.guildData.charmValue }}</div>
            <div class="lab">{{ $t("guild.label.totalIncome") }}</div>
          </li>
          <li class="item">
            <!-- minuteToHour 将分钟转为 "XhYm" 格式 -->
            <div class="val">{{ minuteToHour(infos?.guildData.micBroadcastDuration) }}</div>
            <div class="lab">{{ $t("guild.label.hours") }}</div>
          </li>
          <li class="item">
            <div class="val">{{ infos?.guildData.validDays }}</div>
            <div class="lab">{{ $t("guild.label.validDays") }}</div>
          </li>
        </ul>
      </div>

      <!-- 我的公会名片卡片 -->
      <div class="card blos">
        <div class="labs">
          <van-image fit="cover" class="icon" :src="card" />
          <span class="text">{{ $t("guild.myCard") }}</span>
        </div>
        <!-- 点击进入名片页 -->
        <div class="info" @click="toCard">
          <!-- 成员头像 -->
          <van-image fit="cover" class="avatar" round :src="infos?.memberCard.memberAvatar" />
          <!-- 成员信息 -->
          <div class="base">
            <div class="nick clamp-1">{{ infos?.memberCard.memberNick }}</div>
            <!-- 等级图标 -->
            <div class="lv">
              <van-image v-if="infos?.memberCard.memberVipIcon" fit="cover" class="icon"
                :src="infos?.memberCard.memberVipIcon" />
              <van-image v-if="infos?.memberCard.memberExperLevelIcon" fit="cover" class="icon"
                :src="infos?.memberCard.memberExperLevelIcon" />
              <van-image v-if="infos?.memberCard.memberCharmLevelIcon" fit="cover" class="icon"
                :src="infos?.memberCard.memberCharmLevelIcon" />
            </div>
          </div>
          <van-image fit="cover" class="link" :src="link" />
        </div>
      </div>

      <!-- 公会TOP10房间列表 -->
      <div class="tops blos">
        <div class="labs">
          <van-image fit="cover" class="icon" :src="tops" />
          <span class="text">{{ $t("guild.topRoom") }}</span>
        </div>

        <ul class="list">
          <!-- 有数据时显示列表 -->
          <template v-if="infos?.roomList && infos?.roomList.length > 0">
            <li class="item" v-for="(item, idx) in infos?.roomList" :key="idx" @click.stop="toRoom(item.roomId)">
              <!-- 房间封面 -->
              <van-image fit="cover" class="avatar" :src="item.avatar" />
              <!-- 房间信息 -->
              <div class="info">
                <div class="base">
                  <div class="nick clamp-1">{{ item.title }}</div>
                  <div class="id">{{ "ID:" + item.roomNo }}</div>
                </div>
                <div class="vals">
                  <van-image fit="cover" class="icon" :src="moire" />
                  <span class="num">{{ item.heatScore }}</span>
                </div>
              </div>
            </li>
          </template>
          <!-- 无数据时显示空状态 -->
          <template v-else>
            <li class="empt">{{ $t("guild.tips.nodata") }}</li>
          </template>
        </ul>
      </div>
    </div>

    <!-- ==================== 弹窗区域 ==================== -->
    <van-popup
      :class="'pops' + pops.type"
      v-model:show="pops.show"
      :position="pops.position"
      @close="closePops"
    >
      <!-- 更多操作按钮列表 -->
      <template v-if="pops.type == 1">
        <div class="ctrls">
          <!-- 仅会长可见 -->
          <van-button v-if="infos?.memberRole == 1" class="ctrl" @click="onCtrl('createAgency')">{{ $t("guild.more.createAgency") }}</van-button>
          <van-button class="ctrl" @click="onCtrl('order')">{{ $t("guild.more.order") }}</van-button>
          <van-button class="ctrl" @click="onCtrl('withdraw')">{{ $t("guild.more.withdraw") }}</van-button>
          <!-- 管理员及以上可见 -->
          <van-button v-if="infos?.memberRole == 1 || infos?.memberRole == 2" class="ctrl"
            @click="onCtrl('information')">{{ $t("guild.more.information") }}</van-button>
          <!-- 管理员及以上可见 -->
          <van-button v-if="infos?.memberRole == 1 || infos?.memberRole == 2" class="ctrl" @click="onCtrl('invite')">{{
            $t("guild.more.invite") }}</van-button>
          <!-- 仅会长可见 -->
          <van-button v-if="infos?.memberRole == 1" class="ctrl danger" @click="onCtrl('dissolve')">{{
            $t("guild.more.dissolve") }}</van-button>
          <!-- 仅普通成员可见 -->
          <van-button v-if="infos?.memberRole == 3" class="ctrl danger" @click="onCtrl('quit')">{{ $t("guild.more.quit")
            }}</van-button>
        </div>
        <van-button class="cancel" @click="onCtrl('cancel')">{{ $t("guild.more.cancel") }}</van-button>
      </template>

      <!-- 消息列表（申请审核） -->
      <template v-if="pops.type == 2">
        <div class="mess">
          <div class="header">
            <div class="title">{{ $t("guild.message") }}</div>
            <!-- 关闭按钮 -->
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
          <!-- 申请列表 -->
          <div class="msgs">
            <template v-if="pops.mess.list && pops.mess.list.length > 0">
              <van-pull-refresh v-model="pops.mess.refreshing" class="msgs_refresh" @refresh="onMsgsRefresh"
                :pulling-text="$t('other.pullingText')"
                :loosing-text="$t('other.loosingText')"
                :loading-text="$t('other.loadingText')">
                <van-list class="msgs_list" v-model:loading="pops.mess.loading"
                  :finished="pops.mess.finished"
                  :immediate-check="false"
                  :finished-text="pops.mess.list.length == 0 ? '' : $t('other.finishedText')"
                  :loading-text="' '">
                  <!-- 申请项 -->
                  <div class="msgs_item" v-for="(item, idx) in pops.mess.list" :key="idx">
                    <div class="info">
                      <!-- 用户头像 -->
                      <van-image class="avatar" fit="cover" round :src="item.avatar" />
                      <div class="base">
                        <!-- 用户昵称和申请时间 -->
                        <div class="desc al-center">
                          <span class="nick clamp-1">{{ item.nick }}</span>
                          <span class="date">{{ moment(item.createTime).format("YYYY-MM-DD") }}</span>
                        </div>
                        <!-- 等级图标 -->
                        <div class="icons">
                          <van-image v-if="item.vipIcon" fit="cover" class="icon" :src="item.vipIcon" />
                          <van-image v-if="item.experLevelIcon" fit="cover" class="icon" :src="item.experLevelIcon" />
                          <van-image v-if="item.charmLevelIcon" fit="cover" class="icon" :src="item.charmLevelIcon" />
                        </div>
                      </div>
                    </div>
                    <!-- 审核按钮 -->
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
            <!-- 无申请时显示空状态 -->
            <template v-else>
              <div class="empt">
                <van-image fit="cover" class="icon" :src="nodata" />
                <p class="text">{{ $t("guild.tips.nodata") }}</p>
              </div>
            </template>
          </div>
        </div>
      </template>

      <!-- 邀请成员 -->
      <template v-if="pops.type == 3">
        <div class="invi">
          <van-button class="close" @click="closePops"></van-button>
          <h1 class="title">{{ $t("guild.more.invite") }}</h1>
          <!-- 搜索框 -->
          <van-search class="search" v-model="pops.invite.searchKey" show-action :clearable="false" maxlength="8"
            clear-trigger="always" action-text="Search" :placeholder="$t('guild.tips.searchUid')">
            <template #action>
              <div @click="onInviteSearch">{{ $t("guild.btn.search") }}</div>
            </template>
          </van-search>
          <!-- 搜索结果 -->
          <div v-if="pops.invite.target" class="target">
            <van-image fit="cover" class="avatar" round :src="pops.invite.target.avatar" />
            <div class="info">
              <div class="nick">{{ pops.invite.target.nick }}</div>
              <div class="id">
                <span>ID:</span>
                <span>{{ pops.invite.target.erbanNo }}</span>
              </div>
            </div>
            <!-- 邀请按钮 -->
            <van-button class="btn" @click="onSendInvite"
              :disabled="pops.invite.target.inviteStatus == 1 ? true : false"
              :class="pops.invite.target.inviteStatus == 0 ? 'act' : 'def'">
              {{ $t("guild.more.invite") }}
            </van-button>
          </div>
        </div>
      </template>

      <!-- 解散公会确认 -->
      <template v-if="pops.type == 4">
        <div class="diss">
          <h1 class="title">{{ $t("guild.dissolveAgency") }}</h1>
          <p class="remind">{{ $t("guild.tips.dissolveAgency") }}</p>
          <div class="btns">
            <van-button class="btn cancel" @click="closePops">{{ $t("guild.btn.cancel") }}</van-button>
            <van-button class="btn confirm" @click="dissolveGuild">{{ $t("guild.btn.confirm") }}</van-button>
          </div>
        </div>
      </template>

      <!-- 退出公会确认 -->
      <template v-if="pops.type == 5">
        <div class="quit">
          <h1 class="title">{{ $t("guild.quitAgency") }}</h1>
          <p class="remind">{{ $t("guild.tips.quitAgency") }}</p>
          <div class="btns">
            <van-button class="btn cancel" @click="closePops">{{ $t("guild.btn.cancel") }}</van-button>
            <van-button class="btn confirm" @click="quitGuildCost">{{ $t("guild.btn.confirm") }}</van-button>
          </div>
        </div>
      </template>
    </van-popup>

    <!-- ==================== 创建公会弹窗 ==================== -->
    <van-overlay :show="pops.createAgency.show" @click="closeCreateAgency" />
    <div v-if="pops.createAgency.show" class="create-agency-modal">
      <!-- 标题栏 -->
      <div class="modal-header">
        <span class="modal-title">{{ $t("guild.more.createAgency") }}</span>
        <div @click="closeCreateAgency" class="modal-close" >
          <!-- <path d="M512 438.4l313.6-313.6c9.6-9.6 9.6-25.6 0-35.2s-25.6-9.6-35.2 0L512 403.2 198.4 89.6c-9.6-9.6-25.6-9.6-35.2 0s-9.6 25.6 0 35.2L438.4 438.4 124.8 752c-9.6 9.6-9.6 25.6 0 35.2s25.6 9.6 35.2 0L512 473.6l313.6 313.6c9.6 9.6 25.6 9.6 35.2 0s9.6-25.6 0-35.2L512 438.4z" fill="#666666" p-id="5002"></path> -->
             <img src="@/assets/img/guild/icon.png" alt=""> 
        </div>
      </div>

      <!-- 表单内容 -->
      <div class="modal-body">
        <!-- Agency agent ID -->
        <div class="form-group">
          <div class="form-label">{{ $t("guild.more.agentId") || "Agency agent ID" }}</div>

          <!-- 用户信息卡片（搜索结果） -->
          <div v-if="pops.createAgency.searchResult" class="user-info-card">
            <div class="user-card-left">
              <van-image
                round
                fit="cover"
                class="user-avatar"
                :src="pops.createAgency.searchResult.avatar || ''"
              />
              <div class="user-info">
                <div class="user-name">{{ pops.createAgency.searchResult.nick }}</div>
                <div class="user-id">ID: {{ pops.createAgency.searchResult.erbanNo || pops.createAgency.searchResult.uid }}</div>
              </div>
            </div>
            <div @click="pops.createAgency.searchResult = null" class="delete-icon" >
             <img src="@/assets/img/guild/off.png" alt=""> 
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="search-box" v-if="!pops.createAgency.searchResult">
            <div class="search-input-wrap">
              <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#999" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                v-model="pops.createAgency.agentId"
                type="text"
                class="search-input"
                :placeholder="$t('guild.tips.searchUid')"
              />
            </div>
            <button
              class="search-btn"
              :disabled="pops.createAgency.searching || !pops.createAgency.agentId.trim()"
              @click="onSearchAgent"
            >
              {{ pops.createAgency.searching ? "..." : ($t("guild.btn.search") || "Search") }}
            </button>
          </div>
        </div>

        <!-- Agency name -->
        <div class="form-group">
          <div class="form-label">{{ $t("guild.label.name") }}</div>
          <div class="input-wrap">
            <input
              v-model="pops.createAgency.agencyName"
              type="text"
              class="form-input"
              :maxlength="15"
              :placeholder="$t('guild.tips.enterName')"
            />
          </div>
        </div>
      </div>

      <!-- 底部创建按钮 -->
      <div class="modal-footer">
        <button
          class="create-btn"
          :class="{ 'create-btn--active': canCreate }"
          :disabled="!canCreate || pops.createAgency.createLoading"
          @click="onCreateAgency"
        >
          {{ pops.createAgency.createLoading ? "..." : ($t("guild.btn.create") || "Create") }}
        </button>
      </div>
    </div>

    <!-- 全局Loading -->
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

<!-- SCSS 样式 -->
<style lang="scss" scoped>
:deep(.van-toast__text){
     direction: auto;
  unicode-bidi: plaintext !important; /* 根据内容自动判断方向 */
}
/* ==================== 页面容器 ==================== */
.guild {
  width: 100%;
  background: #f1f1f1;

  /* ==================== 封面区域 ==================== */
  .poster {
    width: 100%;
    height: 331px;
    background: url("@/assets/img/guild/poster.png") no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;

    /* 导航栏 */
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

    /* 公会信息卡片 */
    .mine {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 20px auto 0;
      position: relative;

      /* 头像容器 */
      .avatar_box {
        width: 87px;
        height: 87px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        /* 头像装饰框 */
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

      /* 公会名称 */
      .nick {
        margin: 6px auto 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        font-style: normal;
      }

      /* 基础信息 */
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

  /* ==================== 内容区域 ==================== */
  .container {
    width: 100%;
    min-height: 50px;
    padding: 10px;
    background: #f1f1f1;
    border-radius: 12px 12px 0px 0px;
    margin-top: -50px;
    position: relative;

    /* 卡片通用样式 */
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

    /* 数据统计卡片 */
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

    /* 名片卡片 */
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

    /* TOP10房间列表 */
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

<!-- 全局样式 -->
<style lang="scss">
.van-toast .van-toast__text{
  direction: auto;
  unicode-bidi: plaintext !important;
}
/* 页面背景 */
.views_wrap {
  background: #f1f1f1;
}

.guild {
  /* 遮罩层 */
  .van-overlay {
    background: rgba(0, 0, 0, 0.4);
  }

  /* ==================== 更多操作弹窗 ==================== */
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

  /* ==================== 消息列表弹窗 ==================== */
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

  /* ==================== 邀请弹窗 ==================== */
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
            font-style: normal;
            margin-bottom: 6px;
          }

          .id {
            font-family: Helvetica;
            font-size: 12px;
            color: #606060;
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
          background: #B37AF7;
          color: #FFFFFF;
        }

        .def {
          background: #e5e5e5;
          color: #b5b5b2;
        }
      }
    }
  }

  /* ==================== 解散/退出确认弹窗 ==================== */
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

/* ==================== RTL 适配（阿拉伯语） ==================== */
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

/* 英语（LTR）布局 */
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

/* ==================== 创建公会弹窗 ==================== */
.create-agency-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 20px);
  display: flex;
  flex-direction: column;
  z-index: 10000;
  :deep(.van-toast__text){
     direction: auto;
  unicode-bidi: plaintext !important; /* 根据内容自动判断方向 */
}
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 18px 16px 14px;
  flex-shrink: 0;

  .modal-title {
    font-family: Helvetica;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
    font-style: normal;
  }

  .modal-close {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    padding: 4px;
    width: 25px;
    img{
      width: 100%;
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-family: Helvetica;
  font-weight: bold;
  font-size: 14px;
  color: #333333;
  font-style: normal;
  margin-bottom: 8px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 323px;
height: 70px;
background: #F2F2F2;
border-radius: 6px;
box-sizing: border-box;
padding: 0 10px;
}

.user-info-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  border: 1px solid #eeeeee;
  border-radius: 12px;
  padding: 12px 16px;

  .user-card-left {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;

    .user-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-right: 12px;
    }

    .user-info {
      flex: 1;
      overflow: hidden;

      .user-name {
        font-family: Helvetica;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 4px;
      }

      .user-id {
        font-family: Helvetica;
        font-size: 12px;
        color: #999999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .delete-icon {
    width: 30px;
    height: auto;
    flex-shrink: 0;
    margin-left: 12px;
    cursor: pointer;
    padding: 4px;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width: 100%;
    }
    &:active {
      opacity: 0.6;
    }
  }
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  // background: #f5f5f5;
  border-radius: 12px;
  padding: 0 12px;
  height: 46px;

  .search-icon {
    flex-shrink: 0;
    margin-right: 8px;
  }

  .search-input {
    flex: 1;
    height: 100%;
    border: none;
    background: transparent;
    font-family: Helvetica;
    font-size: 14px;
    color: #333333;
    outline: none;

    &::placeholder {
      color: #999999;
    }
  }
}

.search-btn {
  width: 79px;
  height: 29px;
  // padding: 0 20px;
  //background: #ac41f6;
  background: linear-gradient(180deg, #AC41F6, #520BF5);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  font-family: Helvetica;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s, opacity 0.2s;

  &:disabled {
    background: #d8b4f8;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background: #9333ea;
  }
}

.input-wrap {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 0 12px;
  height: 46px;
  display: flex;
  align-items: center;

  .form-input {
    flex: 1;
    height: 100%;
    border: none;
    background: transparent;
    font-family: Helvetica;
    font-size: 14px;
    color: #333333;
    outline: none;

    &::placeholder {
      color: #999999;
    }
  }
}

.modal-footer {
  padding: 0 20px 20px;
  flex-shrink: 0;
}

.create-btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 23px;
  font-family: Helvetica;
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  background: #e5e5e5;
  color: #b5b5b2;

  &--active {
    background: linear-gradient(90deg, #ac41f6, #520bf5);
    color: #ffffff;
    cursor: pointer;

    &:active {
      opacity: 0.9;
    }
  }

  &:disabled:not(.create-btn--active) {
    cursor: not-allowed;
  }

}

</style>
