<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { AppClose } from "@/utils/client";
import { showToast } from "vant";
import {
  GUILD_INFO, //公会详情
  GUILD_JOIN_APPLY, //申请加入公会
} from "@/api/guild";
import card from "@/assets/img/guild/card.png";
import fans from "@/assets/img/guild/fans.png";
import star from "@/assets/img/guild/star.png";
import ques1 from "@/assets/img/charge/ques_1.png";
import ques2 from "@/assets/img/charge/ques_2.png";
import ques3 from "@/assets/img/charge/ques_3.png";

// 接收参数
const props = defineProps(["source", "uid", "ticket", "deviceId", "guildId"]);
const router = useRouter();
let loading = ref(false); //是否加载中
let infos = reactive({
  guildId: null, //公会ID
  guildName: "", //公会名称
  coverPicUrl: "", //公会封面
  guildNo: null, //公会号
  memberCount: 0, //成员数量"
  founderUid: null, //创建者uid
  founderErbanNo: null, //创建者id
  founderNick: "", //创建者昵称
  // 公会之星
  guildStar: [
    {
      uid: null, //用户id
      avatar: "", //用户头像
      nick: "", //用户昵称
    },
    {
      uid: null, //用户id
      avatar: "", //用户头像
      nick: "", //用户昵称
    },
    {
      uid: null, //用户id
      avatar: "", //用户头像
      nick: "", //用户昵称
    },
  ],
  appleStatus: 0, //申请状态 0未申请 1申请中 2已加入公会
});

// 返回
function goBack() {
  if (props.source === "h5") {
    router.go(-1);
  } else {
    AppClose();
  }
}

// 申请加入公会
function onApply() {
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
        getGuildInfo(); //刷新公会详情数据
      })
      .catch((err) => {
        loading.value = false;
        showToast(err.message);
      });
  }
}

// 获取公会详情
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
        let temp = [{
          uid: null, //用户id
          avatar: "", //用户头像
          nick: "", //用户昵称
        },
        {
          uid: null, //用户id
          avatar: "", //用户头像
          nick: "", //用户昵称
        },
        {
          uid: null, //用户id
          avatar: "", //用户头像
          nick: "", //用户昵称
        },];

        if (data.guildStar && data.guildStar.length > 0) {
          for (let i = 0; i < temp.length; i++) {
            if (data.guildStar[i]) {
              temp[i] = data.guildStar[i];
            }
          }
        }

        data.guildStar = temp;
        infos = data;
      }
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

getGuildInfo(); //获取公会详情数据
</script>

<template>
  <div class="detail">
    <div class="poster">
      <nav-bars :is-left="true" :left-slot="true" :title-slot="true" bg-color="transparent">
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
      <div class="founder blos">
        <div class="labs">
          <van-image fit="cover" class="icon" :src="card" />
          <span class="text">{{ $t("guild.agencyInfo") }}</span>
        </div>

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

      <div class="tops blos">
        <div class="labs">
          <van-image fit="cover" class="icon" :src="star" />
          <span class="text">{{ $t("guild.agencyStar") }}</span>
        </div>

        <ul class="list">
          <li class="item top1">
            <div class="avatar_box">
              <van-image class="avatar" fit="cover" round :src="infos.guildStar[0].avatar ? infos.guildStar[0].avatar : ques1
                " />
            </div>
          </li>
          <li class="item top2">
            <div class="avatar_box">
              <van-image class="avatar" fit="cover" round :src="infos.guildStar[1].avatar ? infos.guildStar[1].avatar : ques2
                " />
            </div>
          </li>
          <li class="item top3">
            <div class="avatar_box">
              <van-image class="avatar" fit="cover" round :src="infos.guildStar[2].avatar ? infos.guildStar[2].avatar : ques3
                " />
            </div>
          </li>
        </ul>
      </div>
    </div>

    <van-button v-if="infos.guildId && infos.appleStatus != 2" type="default" class="btn_new"
      :class="infos.appleStatus === 0 ? 'new_act' : 'new_def'" @click="onApply">{{
        infos.appleStatus === 0 ? $t("guild.applyJoin") : $t("guild.applying")
      }}</van-button>

    <Loading :show="loading" color="#fff" bg-color="transparent" />
  </div>
</template>

<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
  display: flex;
  flex-direction: column;

  .poster {
    width: 100%;
    height: 331px;
    background: url("@/assets/img/guild/poster.png") no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;

    .mine {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 20px auto 0;

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
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
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

        .top1 {
          background: url("@/assets/img/guild/stage1.png") no-repeat;
          background-size: cover;
          background-position: center;
          margin-top: 0;
          order: 2;

          .avatar_box {
            &::before {
              content: "";
              background: url("@/assets/img/guild/top1.png") no-repeat;
              background-size: cover;
              background-position: center;
            }
          }
        }

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

  .new_def {
    color: #b5b5b2;
    background: #e5e5e5 !important;
  }

  .new_act {
    color: #ffffff;
    background: linear-gradient(90deg, #AC41F6, #520BF5) !important;
  }
}
</style>

<style lang="scss">
.views_wrap {
  background: #f1f1f1;
}

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
