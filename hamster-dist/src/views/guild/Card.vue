<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { minuteToHour } from "@/utils";
import { showToast } from "vant";
import {
  GUILD_MEMBER_CARD, //用户公会名片
} from "@/api/guild";
import moment from "moment";

// 接收参数
const props = defineProps(["uid", "ticket", "memberUid"]);
const router = useRouter();
const title = document.title;
let loading = ref(false); //是否加载中
let infos = reactive({
  memberUid: null, //成员uid
  memberAvatar: "", //成员头像
  memberNick: "", //成员昵称
  memberExperLevelIcon: "", //成员财富等级图标
  memberCharmLevelIcon: "", //成员魅力等级图标
  memberVipIcon: "", //成员VIP图标
  joinGuildTime: 0, //加入公会时间(毫秒)
  joinGuildDays: 0, //加入公会天数
  lastLoginTime: 0, //上次登录时间(毫秒)
  charmValue: 0, //总收礼值
  micBroadcastDuration: 0, //总开播时长
  validDays: 0, //总有效天数
});

// 返回
function goBack() {
  router.go(-1);
}

// 获取日期
function getDate(time) {
  if (!time) {
    return "-";
  }

  return moment(time).format("YYYY-MM-DD");
}

// 获取用户公会名片
function getGuildMemberCard() {
  loading.value = true;
  GUILD_MEMBER_CARD({
    uid: props.uid,
    ticket: props.ticket,
    memberUid: props.uid,
  })
    .then((data) => {
      loading.value = false;
      if (data) {
        infos = data;
      }
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

getGuildMemberCard(); //获取用户公会名片数据
</script>

<template>
  <div class="card">
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
      <div class="mine">
        <van-image class="avatar" round :src="infos.memberAvatar" fit="cover" />
        <div class="info">
          <div class="nick clamp-1">{{ infos.memberNick || "-" }}</div>
          <template v-if="
            infos.memberVipIcon ||
            infos.memberExperLevelIcon ||
            infos.memberCharmLevelIcon
          ">
            <div class="icons">
              <van-image v-if="infos.memberVipIcon" fit="cover" class="icon" :src="infos.memberVipIcon" />
              <van-image v-if="infos.memberExperLevelIcon" fit="cover" class="icon" :src="infos.memberExperLevelIcon" />
              <van-image v-if="infos.memberCharmLevelIcon" fit="cover" class="icon" :src="infos.memberCharmLevelIcon" />
            </div>
          </template>
        </div>
      </div>

      <ul class="totals">
        <li class="total">
          <div class="val clamp-1">{{ infos.charmValue }}</div>
          <div class="lab clamp-1">{{ $t("guild.label.totalIncome") }}</div>
        </li>
        <li class="total">
          <div class="val clamp-1">{{ minuteToHour(infos.micBroadcastDuration) }}</div>
          <div class="lab clamp-1">{{ $t("guild.label.totalHours") }}</div>
        </li>
        <li class="total">
          <div class="val clamp-1">{{ infos.validDays }}</div>
          <div class="lab clamp-1">{{ $t("guild.label.totalValidDays") }}</div>
        </li>
      </ul>

      <ul class="times">
        <li class="time">
          <span class="lab">{{ $t("guild.label.joinTime") }}</span>
          <span class="val">{{ getDate(infos.joinGuildTime) }}</span>
        </li>
        <li class="time">
          <span class="lab">{{ $t("guild.label.validDay") }}</span>
          <span class="val">{{ infos.joinGuildDays }}</span>
        </li>
        <li class="time">
          <span class="lab">{{ $t("guild.label.lastLoginTime") }}</span>
          <span class="val">{{ getDate(infos.lastLoginTime) }}</span>
        </li>
      </ul>
    </div>

    <Loading :show="loading" color="#fff" bg-color="transparent" />
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .container {
    flex: 1;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;

    .mine {
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      .avatar {
        width: 50px;
        height: 50px;
      }

      .info {
        flex: 1;
        overflow: hidden;
        padding: 0 13px;

        .nick {
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 12px;
          color: #121212;
          line-height: 15px;
          font-style: normal;
        }

        .icons {
          margin-top: 6px;
          display: flex;

          .icon {
            width: 35px;
            height: 16px;
          }
        }
      }
    }

    .totals {
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      padding: 10px;
      display: flex;
      justify-content: space-around;
      margin: 10px auto;

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

    .times {
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      padding: 10px;

      .time {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px 0;
        margin-bottom: 10px;
        overflow: hidden;
        border-bottom: 1px solid rgba(141, 91, 0, 0.1);

        .lab {
          font-family: Helvetica;
          font-size: 14px;
          color: #606060;
          line-height: 17px;
          font-style: normal;
        }

        .val {
          flex: 1;
          overflow: hidden;
          font-family: Helvetica;
          font-size: 14px;
          color: #000000;
          line-height: 17px;
          font-style: normal;
        }

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.views_wrap,
.card {
  background: #f1f1f1;
}

.ara {
  .container {
    .mine {
      .info {
        .icons {
          .icon {
            margin-left: 7px;
          }
        }
      }
    }

    .times {
      .time {
        .val {
          text-align: left;
        }
      }
    }
  }
}

.en {
  .container {
    .mine {
      .info {
        .icons {
          .icon {
            margin-right: 7px;
          }
        }
      }
    }

    .times {
      .time {
        .val {
          text-align: right;
        }
      }
    }
  }
}
</style>
