<!--
  公会列表页 List.vue
  路径：/guild/list

  功能说明：
  1. 展示推荐公会列表
  2. 支持按公会ID搜索公会
  3. 点击公会进入公会详情页

  页面参数：
  - uid: 当前用户ID
  - ticket: 登录凭证
  - deviceId: 设备ID
  - source: 来源标识
-->

<script setup>
/**
 * ==================== 依赖导入 ====================
 */
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

// 工具函数：获取语言设置
import { getLang } from "@/utils";

// 客户端能力：AppClose关闭页面
import { AppClose } from "@/utils/client";

// Vant 提示组件
import { showToast } from "vant";

// API 接口
import {
  GUILD_RECOMMEND,    // 获取推荐公会列表
  GUILD_SEARCH,       // 搜索公会
} from "@/api/guild";

// 无数据占位图
import nodata from "@/assets/img/guild/nodata.png";

/**
 * ==================== 接收路由参数 ====================
 */
const props = defineProps(["uid", "ticket", "deviceId", "source"]);

/**
 * ==================== 路由实例 ====================
 */
const router = useRouter();

/**
 * ==================== 基础数据 ====================
 */
const lang = getLang();        // 当前语言
let loading = ref(false);     // 页面loading状态
let searchKey = ref("");      // 搜索关键词
let page = ref(1);            // 当前页码（用于分页）
let size = ref(10);           // 每页显示数量

/**
 * ==================== 公会列表数据 ====================
 */
let agencies = reactive([
  // 数据结构示例：
  // {
  //   guildId: 1,              // 公会ID
  //   guildNo: 123456,        // 公会号
  //   guildName: "公会名称",   // 公会名称
  //   coverPicUrl: "url",     // 公会封面图片
  //   memberCount: 100,        // 成员数量
  // }
]);

/**
 * ==================== 页面方法 ====================
 */

/**
 * 返回上一页
 * 根据来源决定是路由返回还是关闭APP
 */
function goBack() {
  if (props.source === "h5") {
    router.go(-1);
  } else {
    AppClose();
  }
}

/**
 * 跳转创建公会页面
 */
function onCreate() {
  router.push({
    path: "/guild/create",
    query: {
      lang: lang,
      uid: props.uid,
      ticket: props.ticket,
      deviceId: props.deviceId,
      source: "h5",
    },
  });
}

/**
 * 跳转公会详情页
 * @param {Object} item - 公会数据项
 */
function toDetail(item) {
  console.log(item);
  router.push({
    path: "/guild/detail",
    query: {
      lang: lang,
      source: "h5",
      uid: props.uid,
      ticket: props.ticket,
      deviceId: props.deviceId,
      guildId: item.guildId,  // 传递公会ID
    },
  });
}

/**
 * 搜索公会
 * 根据输入的公会ID搜索
 */
function onSearch() {
  if (searchKey.value === "") {
    showToast("Please enter the search keyword");
  } else {
    let params = {
      uid: props.uid,
      ticket: props.ticket,
      language: lang,
      searchKey: searchKey.value,
      pageNum: page.value,
      pageSize: size.value,
    };

    loading.value = true;
    GUILD_SEARCH(params)
      .then((data) => {
        loading.value = false;
        let arr = agencies;
        const { list, whetherLastPage } = data;

        // 判断是否最后一页
        if (whetherLastPage && list && list.length > 0) {
          agencies = list;
        } else if (list && list.length > 0) {
          // 合并数据
          agencies = arr.concat(list);
          page.value += 1;
        } else {
          agencies = [];
        }
      })
      .catch((err) => {
        loading.value = false;
        showToast(err.message);
      });
  }
}

/**
 * 重置搜索
 * 清空搜索词，重新加载推荐列表
 */
function onReset() {
  searchKey.value = "";
  page.value = 1;
  getGuildRecommend();
}

/**
 * 获取推荐公会列表
 * 页面初始化时加载
 */
function getGuildRecommend() {
  loading.value = true;
  GUILD_RECOMMEND({
    uid: props.uid,
    ticket: props.ticket,
  })
    .then((data) => {
      loading.value = false;
      agencies = data;
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

/**
 * ==================== 页面初始化 ====================
 */
getGuildRecommend();
</script>

<template>
  <div class="list">
    <!-- 导航栏 -->
    <nav-bars
      :is-left="true"
      :left-slot="true"
      :title-slot="true"
      :is-right="true"
      :right-slot="true"
      bg-color="#efd29c"
    >
      <!-- 左侧返回按钮 -->
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

      <!-- 中间标题 -->
      <template #title_slot>
        <span>{{ $t("guild.title") }}</span>
      </template>

      <!-- 右侧创建按钮（已注释） -->
      <template #right_slot>
        <!-- <div class="create" @click="onCreate">{{ $t("guild.btn.create") }}</div> -->
      </template>
    </nav-bars>

    <!-- 搜索框 -->
    <van-search
      class="search"
      v-model="searchKey"
      show-action
      maxlength="8"
      clear-trigger="always"
      action-text="Search"
      placeholder="Enter the Agency ID to search"
      @clear="onReset"
    >
      <template #action>
        <div @click="onSearch">{{ $t("guild.btn.search") }}</div>
      </template>
    </van-search>

    <!-- 公会列表 -->
    <ul class="agencies">
      <!-- 有数据时显示列表 -->
      <template v-if="agencies?.length > 0">
        <li class="agency" v-for="(item, idx) in agencies" @click="toDetail(item)" :key="idx">
          <!-- 公会封面 -->
          <van-image class="avatar" :src="item.coverPicUrl" fit="cover" />
          <!-- 公会信息 -->
          <div class="info">
            <!-- 公会名称 -->
            <div class="nick clamp-1">{{ item.guildName }}</div>
            <!-- 基础信息：ID和成员数 -->
            <div class="base">
              <span class="id">
                <span>ID:</span>
                <span> {{ item.guildNo }}</span>
              </span>
              <span class="memb">{{ item.memberCount }}</span>
            </div>
          </div>
        </li>
      </template>

      <!-- 无数据时显示空状态 -->
      <template v-else>
        <li class="nodata">
          <van-image class="icon" :src="nodata" fit="cover" />
          <span class="text">No data</span>
        </li>
      </template>
    </ul>

    <!-- 全局Loading -->
    <Loading :show="loading" color="#fff" bg-color="transparent" />
  </div>
</template>

<!-- SCSS 样式 -->
<style lang="scss" scoped>
/* 覆盖导航栏样式 */
:deep(.van-nav-bar) {
  background: linear-gradient(180deg, RGBA(182, 52, 255, 1) 0%, RGBA(90, 0, 255, 1) 100%) !important;
}
:deep(.van-nav-bar__title) {
  span {
    color: #FFFFFF !important;
  }
}

/* 页面容器 */
.list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  /* 搜索框 */
  .search {
    padding: 15px 10px;
    width: 100%;
  }

  /* 公会列表 */
  .agencies {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 10px;
    position: relative;

    /* 单个公会项 */
    .agency {
      width: 100%;
      height: 57px;
      display: flex;
      margin: 0 auto 12px;

      /* 公会封面 */
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 6px;
        overflow: hidden;
      }

      /* 公会信息 */
      .info {
        flex: 1;
        overflow: hidden;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding: 8px 0 13px;

        .nick {
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 12px;
          color: #000000;
          font-style: normal;
          margin-bottom: 6px;
        }

        .base {
          font-family: Helvetica;
          font-size: 12px;
          color: #606060;
          font-style: normal;

          .id {
            span {
              display: inline-block;
            }
          }

          /* 成员数 */
          .memb {
            position: relative;

            &::before {
              content: "";
              width: 16px;
              height: 16px;
              background: url("@/assets/img/guild/member.png") no-repeat;
              background-size: cover;
              background-position: center;
              margin-top: -8px;
            }
          }
        }
      }
    }

    /* 无数据状态 */
    .nodata {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;

      .icon {
        width: 176px;
        height: 176px;
        margin-top: -200px;
      }

      .text {
        font-family: Helvetica;
        font-size: 16px;
        color: #b7b7b7;
        line-height: 19px;
        font-style: normal;
        margin-top: 13px;
      }
    }
  }
}
</style>

<!-- 全局样式 -->
<style lang="scss">
/* 页面背景 */
.views_wrap,
.list {
  background: #ffffff;
}

.list {
  /* 导航栏标题颜色 */
  .van-nav-bar {
    .van-nav-bar__title {
      color: #be9021;
    }

    .create {
      font-family: Helvetica;
      font-size: 15px;
      color: #836215;
      text-align: center;
      font-style: normal;
      padding: 4px 15px;
      background: linear-gradient(90deg, #ffc800, #ffc928);
      border-radius: 12px;
    }
  }
}

/* ==================== RTL 适配（阿拉伯语） ==================== */
.ara {
  .search {
    .van-field__control {
      text-align: right;
    }

    .van-field__left-icon {
      margin-right: 0 !important;
      margin-left: var(--van-padding-base);
    }
  }

  .agencies {
    .agency {
      .avatar {
        margin-left: 13px;
      }

      .info {
        .base {
          .id {
            margin-left: 10px;
          }

          .memb {
            margin-left: 10px;
            padding-right: 20px;

            &::before {
              position: absolute;
              right: 0;
              top: 50%;
            }
          }
        }
      }
    }
  }
}

/* 英语（LTR）布局 */
.en {
  .agencies {
    .agency {
      .avatar {
        margin-right: 13px;
      }

      .info {
        .base {
          .id {
            margin-right: 10px;
          }

          .memb {
            margin-right: 10px;
            padding-left: 20px;

            &::before {
              position: absolute;
              left: 0;
              top: 50%;
            }
          }
        }
      }
    }
  }
}
</style>
