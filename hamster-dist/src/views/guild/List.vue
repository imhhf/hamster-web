<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import { AppClose } from "@/utils/client";
import { showToast } from "vant";
import {
  GUILD_RECOMMEND, //公会推荐
  GUILD_SEARCH, //公会搜索
} from "@/api/guild";
import nodata from "@/assets/img/guild/nodata.png";

// 接收参数
const props = defineProps(["uid", "ticket", "deviceId", "source"]);
const router = useRouter();
const lang = getLang();
let loading = ref(false); //是否加载中
let searchKey = ref(""); //搜索关键词
let page = ref(1); //当前页
let size = ref(10); //每页显示数量
let agencies = reactive([
  // {
  //   guildId: null,//公会ID
  //   guildNo: null,//公会号
  //   guildName: "",//公会名称
  //   coverPicUrl: "",//公会封面
  //   memberCount: 0,//公会成员数量
  // }
]);

// 返回
function goBack() {
  if (props.source === "h5") {
    router.go(-1);
  } else {
    AppClose();
  }
}

// 创建公会
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

// 进入公会详情
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
      guildId: item.guildId,
    },
  });
}

// 搜索
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

        if (whetherLastPage && list && list.length > 0) {
          agencies = list;
        } else if (list && list.length > 0) {
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

// 重置
function onReset() {
  searchKey.value = "";
  page.value = 1;
  getGuildRecommend();
}

// 获取推荐公会
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

getGuildRecommend(); //获取推荐公会数据
</script>

<template>
  <div class="list">
    <nav-bars :is-left="true" :left-slot="true" :title-slot="true" :is-right="true" :right-slot="true"
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
      <template #title_slot>
        <span>{{ $t("guild.title") }}</span>
      </template>
      <template #right_slot>
        <!-- <div class="create" @click="onCreate">{{ $t("guild.btn.create") }}</div> -->
      </template>
    </nav-bars>

    <van-search class="search" v-model="searchKey" show-action maxlength="8" clear-trigger="always" action-text="Search"
      background="#FDF5E0" placeholder="Enter the Agency ID to search" @clear="onReset">
      <template #action>
        <div @click="onSearch">{{ $t("guild.btn.search") }}</div>
      </template></van-search>

    <ul class="agencies">
      <template v-if="agencies?.length > 0">
        <li class="agency" v-for="(item, idx) in agencies" @click="toDetail(item)" :key="idx">
          <van-image class="avatar" :src="item.coverPicUrl" fit="cover" />
          <div class="info">
            <div class="nick clamp-1">{{ item.guildName }}</div>
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
      <template v-else>
        <li class="nodata">
          <van-image class="icon" :src="nodata" fit="cover" />
          <span class="text">No data</span>
        </li>
      </template>
    </ul>

    <Loading :show="loading" color="#fff" bg-color="transparent" />
  </div>
</template>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .search {
    padding: 15px 10px;
    width: 100%;
  }

  .agencies {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 10px;
    position: relative;

    .agency {
      width: 100%;
      height: 57px;
      display: flex;
      margin: 0 auto 12px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 6px;
        overflow: hidden;
      }

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

<style lang="scss">
.views_wrap,
.list {
  background: #fdf5e0;
}

.list {
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
