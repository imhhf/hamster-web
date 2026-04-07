<!--
  公会详情页 Detail.vue
  路径：/guild/detail

  功能说明：
  1. 展示公会详细信息（封面、名称、ID、成员数）
  2. 显示公会创始人信息
  3. 展示公会之星（前3名成员）
  4. 提供申请加入公会按钮

  页面参数：
  - source: 来源标识（h5/App）
  - uid: 当前用户ID
  - ticket: 登录凭证
  - deviceId: 设备ID
  - guildId: 公会ID（要查看的公会）
-->

<script setup>
/**
 * ==================== 依赖导入 ====================
 */
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

// 客户端能力：AppClose关闭页面
import { AppClose } from "@/utils/client";

// Vant 提示组件
import { showToast } from "vant";

// API 接口
import {
  GUILD_INFO,         // 获取公会详情
  GUILD_JOIN_APPLY,   // 申请加入公会
} from "@/api/guild";

// 图片资源
import card from "@/assets/img/guild/card.png";   // 卡片图标
import fans from "@/assets/img/guild/fans.png";  // 成员数图标
import star from "@/assets/img/guild/star.png";   // 星星图标
import ques1 from "@/assets/img/charge/ques_1.png";  // 第一名占位图
import ques2 from "@/assets/img/charge/ques_2.png";  // 第二名占位图
import ques3 from "@/assets/img/charge/ques_3.png";  // 第三名占位图

/**
 * ==================== 接收路由参数 ====================
 */
const props = defineProps(["source", "uid", "ticket", "deviceId", "guildId"]);

/**
 * ==================== 路由实例 ====================
 */
const router = useRouter();

/**
 * ==================== 基础数据 ====================
 */
let loading = ref(false);  // 页面loading状态

/**
 * ==================== 公会详情数据 ====================
 */
let infos = reactive({
  guildId: null,        // 公会ID
  guildName: "",        // 公会名称
  coverPicUrl: "",      // 公会封面图片URL
  guildNo: null,        // 公会号（展示用ID）
  memberCount: 0,       // 成员数量
  founderUid: null,     // 创始人用户ID
  founderErbanNo: null, // 创始人ID号
  founderNick: "",      // 创始人昵称

  // 公会之星列表（TOP3成员）
  guildStar: [
    { uid: null, avatar: "", nick: "" },  // 第一名
    { uid: null, avatar: "", nick: "" },  // 第二名
    { uid: null, avatar: "", nick: "" },  // 第三名
  ],

  // 申请状态：0=未申请 1=申请中 2=已加入公会
  appleStatus: 0,
});

/**
 * ==================== 页面方法 ====================
 */

/**
 * 返回上一页
 */
function goBack() {
  if (props.source === "h5") {
    router.go(-1);
  } else {
    AppClose();
  }
}

/**
 * 申请加入公会
 * 仅在未申请状态时可点击
 */
function onApply() {
  // 仅未申请时可点击
  if (infos.appleStatus === 0) {
    loading.value = true;
    GUILD_JOIN_APPLY({
      uid: props.uid,
      ticket: props.ticket,
      guildId: props.guildId,
      deviceId: props.deviceId,
    })
      .then(() => {
        loading.value = false;
        getGuildInfo();  // 刷新公会详情（更新申请状态）
      })
      .catch((err) => {
        loading.value = false;
        showToast(err.message);
      });
  }
}

/**
 * 获取公会详情
 */
function getGuildInfo() {
  loading.value = true;
  GUILD_INFO({
    uid: props.uid,
    ticket: props.ticket,
    guildId: props.guildId,
  })
    .then((data) => {
      loading.value = false;
      if (data) {
        // 初始化公会之星数组（固定3个位置）
        let temp = [
          { uid: null, avatar: "", nick: "" },  // 第一名
          { uid: null, avatar: "", nick: "" },  // 第二名
          { uid: null, avatar: "", nick: "" },  // 第三名
        ];

        // 将返回的公会之星数据填充到数组中
        if (data.guildStar && data.guildStar.length > 0) {
          for (let i = 0; i < temp.length; i++) {
            if (data.guildStar[i]) {
              temp[i] = data.guildStar[i];
            }
          }
        }

        data.guildStar = temp;
        infos = data;  // 更新公会信息
      }
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

/**
 * ==================== 页面初始化 ====================
 */
getGuildInfo();
</script>

<template>
  <div class="detail">
    <!-- ==================== 公会封面区域 ==================== -->
    <div class="poster">
      <!-- 导航栏：透明背景，显示返回按钮 -->
      <nav-bars
        :is-left="true"
        :left-slot="true"
        :title-slot="true"
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
      </nav-bars>

      <!-- 公会信息卡片 -->
      <div class="mine">
        <!-- 公会头像 -->
        <div class="avatar_box">
          <van-image fit="cover" class="avatar" :src="infos.coverPicUrl" />
        </div>
        <!-- 公会名称 -->
        <div class="nick">{{ infos.guildName || "-" }}</div>
        <!-- 公会基础信息：ID和成员数 -->
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

    <!-- ==================== 内容区域 ==================== -->
    <div class="container">
      <!-- 创始人信息卡片 -->
      <div class="founder blos">
        <div class="labs">
          <van-image fit="cover" class="icon" :src="card" />
          <span class="text">{{ $t("guild.agencyInfo") }}</span>
        </div>
        <!-- 创始人信息列表 -->
        <ul class="descs">
          <li class="desc">
            <div class="lab">{{ $t("guild.founder.nick") }}</div>
            <div class="val">{{ infos.founderNick || "-" }}</div>
          </li>
          <li class="desc">
            <div class="lab">{{ $t("guild.founder.uid") }}</div>
            <div class="val">{{ infos.founderErbanNo || "-" }}</div>
          </li>
        </ul>
      </div>

      <!-- 公会之星卡片 -->
      <div class="tops blos">
        <div class="labs">
          <van-image fit="cover" class="icon" :src="star" />
          <span class="text">{{ $t("guild.agencyStar") }}</span>
        </div>

        <!-- TOP3 成员列表 -->
        <ul class="list">
          <!-- 第一名 -->
          <li class="item top1">
            <div class="avatar_box">
              <!-- 无头像时显示占位图 -->
              <van-image
                class="avatar"
                fit="cover"
                round
                :src="infos.guildStar[0].avatar ? infos.guildStar[0].avatar : ques1"
              />
            </div>
          </li>
          <!-- 第二名 -->
          <li class="item top2">
            <div class="avatar_box">
              <van-image
                class="avatar"
                fit="cover"
                round
                :src="infos.guildStar[1].avatar ? infos.guildStar[1].avatar : ques2"
              />
            </div>
          </li>
          <!-- 第三名 -->
          <li class="item top3">
            <div class="avatar_box">
              <van-image
                class="avatar"
                fit="cover"
                round
                :src="infos.guildStar[2].avatar ? infos.guildStar[2].avatar : ques3"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- ==================== 申请按钮 ==================== -->
    <!-- 仅在公会存在且未加入时显示 -->
    <van-button
      v-if="infos.guildId && infos.appleStatus != 2"
      type="default"
      class="btn_new"
      :class="infos.appleStatus === 0 ? 'new_act' : 'new_def'"
      @click="onApply"
    >
      <!-- 根据状态显示不同文字 -->
      {{
        infos.appleStatus === 0 ? $t("guild.applyJoin") : $t("guild.applying")
      }}
    </van-button>

    <!-- 全局Loading -->
    <Loading :show="loading" color="#fff" bg-color="transparent" />
  </div>
</template>

<!-- SCSS 样式 -->
<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
  display: flex;
  flex-direction: column;

  /* ==================== 封面区域 ==================== */
  .poster {
    width: 100%;
    height: 331px;
    background: url("@/assets/img/guild/poster.png") no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;

    /* 公会信息卡片 */
    .mine {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 20px auto 0;

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
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
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

    /* 创始人信息卡片 */
    .founder {
      .descs {
        width: 100%;
        margin-top: 10px;

        .desc {
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #f1f1f1;
          padding: 10px 0;

          .lab {
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 12px;
            color: #121212;
            font-style: normal;
          }

          .val {
            flex: 1;
            overflow: hidden;
            font-family: Helvetica;
            font-size: 12px;
            color: #4f3a01;
            font-style: normal;
          }

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }

    /* 公会之星卡片 */
    .tops {
      .list {
        width: 100%;
        margin-top: 30px;
        display: flex;

        .item {
          width: 105px;
          height: 138px;
          display: flex;
          justify-content: center;
          margin: 30px auto 0;

          .avatar_box {
            width: 80px;
            height: 80px;
            margin: 10px auto 0;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            &::before {
              content: "";
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }

            .avatar {
              width: 60px;
              height: 60px;
              margin-top: -10px;
            }
          }
        }

        /* 第一名 */
        .top1 {
          background: url("@/assets/img/guild/stage1.png") no-repeat;
          background-size: cover;
          background-position: center;
          margin-top: 0;
          order: 2;  /* 调整显示顺序，使第一名在中间 */

          .avatar_box {
            &::before {
              content: "";
              background: url("@/assets/img/guild/top1.png") no-repeat;
              background-size: cover;
              background-position: center;
            }
          }
        }

        /* 第二名 */
        .top2 {
          background: url("@/assets/img/guild/stage2.png") no-repeat;
          background-size: cover;
          background-position: center;
          order: 1;

          .avatar_box {
            &::before {
              content: "";
              background: url("@/assets/img/guild/top2.png") no-repeat;
              background-size: cover;
              background-position: center;
            }
          }
        }

        /* 第三名 */
        .top3 {
          background: url("@/assets/img/guild/stage3.png") no-repeat;
          background-size: cover;
          background-position: center;
          order: 3;

          .avatar_box {
            &::before {
              content: "";
              background: url("@/assets/img/guild/top3.png") no-repeat;
              background-size: cover;
              background-position: center;
            }
          }
        }
      }
    }
  }

  /* 申请按钮 */
  .btn_new {
    width: 355px;
    height: 46px;
    margin: 15px auto 49px;
    font-family: Helvetica, Helvetica;
    font-weight: bold;
    font-size: 14px;
    font-style: normal;
    border: none;
    border-radius: 23px;
  }

  /* 申请中状态（禁用） */
  .new_def {
    color: #b5b5b2;
    background: #e5e5e5 !important;
  }

  /* 可申请状态 */
  .new_act {
    color: #ffffff;
    background: linear-gradient(90deg, #AC41F6, #520BF5) !important;
  }
}
</style>

<!-- 全局样式 -->
<style lang="scss">
/* 页面背景 */
.views_wrap {
  background: #f1f1f1;
}

/* ==================== RTL 适配（阿拉伯语） ==================== */
.ara {
  .container {
    .founder {
      .descs {
        .desc {
          .val {
            text-align: left !important;
          }
        }
      }
    }
  }
}

/* 英语（LTR）布局 */
.en {
  .container {
    .founder {
      .descs {
        .desc {
          .val {
            text-align: right !important;
          }
        }
      }
    }
  }
}
</style>
