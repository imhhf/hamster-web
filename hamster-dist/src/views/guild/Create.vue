<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import { AppClose, ShowImageChooser } from "@/utils/client";
import { showToast } from "vant";
import {
  GUILD_CREATE_APPLY, //创建公会申请
} from "@/api/guild";
import plus from "@/assets/img/guild/plus.png";

// 接收参数
const props = defineProps(["uid", "ticket", "deviceId", "source"]);
const router = useRouter();
const lang = getLang();
let loading = ref(false); //是否加载中
let limit = ref(15);
let valid = computed(() => {
  return infos.name && infos.cover;
});
let infos = reactive({
  cover: "",
  name: "",
  // cover: "http://106.55.149.75:8008/Test_1.jpg",
  // name: "LM test it",
});

// 返回
function goBack() {
  if (props.source === "h5") {
    router.go(-1);
  } else {
    AppClose();
  }
}

// 选择封面
function chooseCover() {
  ShowImageChooser((url) => {
    if (url) {
      infos.cover = url;
    }
  });
}

// 创建
function onCreateAgency() {
  loading.value = true;
  GUILD_CREATE_APPLY({
    uid: props.uid,
    ticket: props.ticket,
    guildName: infos.name,
    coverPicUrl: infos.cover,
  })
    .then(() => {
      loading.value = false;
      router.push({
        path: "/guild/index",
        query: {
          lang: lang,
          uid: props.uid,
          ticket: props.ticket,
          deviceId: props.deviceId,
        }
      });
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}
</script>

<template>
  <div class="create">
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
    </nav-bars>

    <div class="container">
      <div class="cover">
        <van-image @click="chooseCover" class="plus" :src="infos.cover ? infos.cover : plus" fit="cover" />
        <p class="label">{{ $t("guild.label.cover") }}</p>
      </div>

      <div class="name">
        <p class="label">{{ $t("guild.label.name") }}</p>
        <div class="ipt_box">
          <input v-model="infos.name" type="text" class="ipt" :maxlength="limit"
            :placeholder="$t('guild.tips.enterName')" />
          <div class="limit">
            <span>{{ infos.name.length }}</span>
            <span>/</span>
            <span>{{ limit }}</span>
          </div>
        </div>
      </div>
    </div>

    <van-button type="default" class="btn_new" :class="!valid ? 'new_def' : 'new_act'" @click="onCreateAgency">{{
      $t("guild.btn.createAgency") }}
    </van-button>

    <Loading :show="loading" color="#fff" bg-color="transparent" />
  </div>
</template>

<style lang="scss" scoped>
.create {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .container {
    flex: 1;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .cover {
    width: 100%;

    .plus {
      width: 100px;
      height: 100px;
      display: block;
      margin: 20px auto 12px;
      overflow: hidden;
      border-radius: 6px;
    }

    .label {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 14px;
      color: #000000;
      line-height: 17px;
      font-style: normal;
      text-align: center;
    }
  }

  .name {
    width: 100%;
    margin-top: 30px;

    .label {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 16px;
      color: #644702;
      line-height: 19px;
      font-style: normal;
      text-transform: none;
    }

    .ipt_box {
      width: 100%;
      height: 36px;
      margin: 10px auto;
      padding: 0 10px;
      border-radius: 6px;
      overflow: hidden;
      background-color: rgba(178, 144, 64, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;

      .ipt {
        flex: 1;
        height: 100%;
        overflow: hidden;
        font-family: Helvetica;
        font-size: 13px;
        color: #b29040;
        font-style: normal;
        border: none;
        background: transparent;

        &::placeholder {
          color: #b29040;
        }
      }

      .limit {
        font-family: Helvetica;
        font-size: 13px;
        color: #b29040;
        font-style: normal;

        span {
          display: inline-block;
        }
      }
    }
  }

  .btn_new {
    width: 355px;
    height: 46px;
    margin: 10px auto 49px;
    font-family: Helvetica, Helvetica;
    font-weight: bold;
    font-size: 14px;
    font-style: normal;
    border: none;
    border-radius: 23px;
  }

  .new_def {
    color: #b5b5b2;
    background: #e5e5e5 !important;
  }

  .new_act {
    color: #000000;
    background: linear-gradient(90deg, #ffc800, #ffc928) !important;
  }
}
</style>

<style lang="scss">
.views_wrap,
.create {
  background: #fdf5e0;
}

.create {
  .van-nav-bar {
    .van-nav-bar__title {
      color: #be9021;
    }
  }
}
</style>
