<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { getLang } from "@/utils";
import { showToast } from "vant";
import {
  GET_WEEK_RANK, //获取周排行榜
  GET_HONOR_HALL, //获取荣耀殿堂
} from "@/api/cp";
import unknown from "@/assets/img/cp/unknown.png";
import icon_back from "@/assets/img/cp/back.png";
import HallOfHonor from "@/assets/img/cp/HallOfHonor.png";

// 接收参数
const props = defineProps(["uid"]);
const router = useRouter();
// const lang = getLang();

let tops5 = ref([
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
  {
    nick: "",
    avatar: unknown,
    cpNick: "",
    cpAvatar: unknown,
    loveValue: 0,
    allLoveValue: 0,
  },
]);
let list = ref([]);

// 返回
function goBack() {
  router.go(-1);
}

// 获取荣耀殿堂数据
function getHonorHall() {
  GET_HONOR_HALL({
    uid: props.uid,
  })
    .then((data) => {
      list.value = data;
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 获取上周排行榜TOP1-5
function getWeekRankTopFive() {
  GET_WEEK_RANK({
    weekType: 1,
    uid: props.uid,
  })
    .then((data) => {
      let template = {
        nick: "",
        avatar: unknown,
        cpNick: "",
        cpAvatar: unknown,
        loveValue: 0,
        allLoveValue: 0,
      };
      let list = [];

      // 修复：添加空值检查
      const weekRank = data?.weekRank || [];

      for (let i = 0; i < 5; i++) {
        let rank = weekRank[i];
        if (rank) {
          list.push(rank);
        } else {
          list.push(template);
        }
      }

      tops5.value = list;
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 初始化数据
function init() {
  getHonorHall(); //获取荣耀殿堂数据
  getWeekRankTopFive(); //获取上周排行榜TOP1-5数据
}

init(); //初始化
</script>
<template>
  <div class="honor">
    <div class="poster">
      <van-image
        :src="icon_back"
        fit="cover"
        class="back btn_active"
        @click="goBack"
      />

      <ul class="tops5">
        <li
          class="top5"
          v-for="(item, idx) in tops5"
          :key="idx"
          :class="'top5_' + (idx + 1)"
        >
          <div class="users">
            <div class="avatar_box al-center">
              <van-image
                :src="item.cpAvatar"
                round
                fit="cover"
                class="avatar"
              />
            </div>
            <div class="avatar_box al-center">
              <van-image :src="item.avatar" round fit="cover" class="avatar" />
            </div>
          </div>
          <div class="loves al-center">
            <div class="love_val">***</div>
          </div>
        </li>
      </ul>
    </div>

    <van-image :src="HallOfHonor" fit="contain" class="title" />

    <ul class="list">
      <li class="item" v-for="(item, idx) in list" :key="idx">
        <div class="date">{{ item.weekStartDay }} - {{ item.weekEndDay }}</div>
        <div class="info al-center">
          <div class="love al-center clamp-1">
            <div class="love_val">{{ item.loveValue }}</div>
          </div>
          <ol class="users al-center">
            <li class="user">
              <div class="icon_box al-center">
                <van-image
                  :src="item.cpAvatar"
                  round
                  fit="cover"
                  class="avatar"
                />
              </div>
              <div class="nick clamp-1">{{ item.cpNick }}</div>
            </li>
            <li class="heartbeat"></li>
            <li class="user">
              <div class="icon_box al-center">
                <van-image
                  :src="item.avatar"
                  round
                  fit="cover"
                  class="avatar"
                />
              </div>
              <div class="nick clamp-1">{{ item.nick }}</div>
            </li>
          </ol>
        </div>
      </li>
    </ul>

    <p class="tips">
      Hamster Live reserves the right of final explanation for this program.
    </p>
  </div>
</template>
<style lang="scss" scoped>
.honor {
  position: relative;
  min-height: 100%;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: url("@/assets/img/cp/bg.png") no-repeat;
    background-position: center;
    background-size: cover;
  }

  .poster {
    width: 100%;
    height: 528px;
    position: relative;

    .back {
      width: 35px;
      height: 43px;
      position: absolute;
      left: 12px;
      top: 52px;
      z-index: 1;
    }
  }

  .title {
    width: 289px;
    height: 62px;
    display: block;
    margin: -20px auto 0;
  }

  .tops5 {
    position: relative;
    top: 100px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;

    .top5 {
      position: relative;
      flex-basis: 50%;

      .users {
        display: flex;
        justify-content: center;
      }

      .loves {
        font-family: PingFang-SC, PingFang-SC;
        color: #ffffff;
        font-weight: 800;
        font-style: normal;
        text-transform: none;
      }
    }

    .top5_1 {
      flex-basis: 100%;
      padding-top: 16px;

      .users {
        .avatar_box {
          width: 76px;
          height: 83.5px;
          position: relative;
          overflow: hidden;

          .avatar {
            width: 70px;
            height: 70px;
            position: relative;
            top: 6px;
          }
        }

        .avatar_box:nth-child(1) {
          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/cp/top5_1-1.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          }
        }

        .avatar_box:nth-child(2) {
          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/cp/top5_1-2.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          }
        }
      }

      .loves {
        width: 152px;
        height: 36px;
        padding-top: 4px;
        margin: 33px auto 0;
        background: url("@/assets/img/cp/bg_val-1.png") no-repeat;
        background-position: center;
        background-size: cover;

        .love_val {
          position: relative;
          font-size: 18px;
          padding-left: 27px;

          &::before {
            content: "";
            width: 24px;
            height: 21px;
            background: url("@/assets/img/cp/heart.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 50%;
            margin-top: -10.5px;
            left: 0px;
            z-index: 1;
          }
        }
      }
    }

    .top5_2,
    .top5_3,
    .top5_4,
    .top5_5 {
      .users {
        width: 80px;
        height: 67px;
        margin: 0 auto 0;

        .avatar_box {
          width: 36px;
          height: 36px;
          background: url("@/assets/img/cp/circle.png") no-repeat;
          background-position: center;
          background-size: cover;
          position: relative;
          top: 15px;
          overflow: hidden;

          .avatar {
            width: 33px;
            height: 33px;
          }
        }
      }

      .loves {
        width: 73px;
        height: 20.5px;
        margin: 0 auto;
        background: url("@/assets/img/cp/bg_val-2.png") no-repeat;
        background-position: center;
        background-size: cover;

        .love_val {
          position: relative;
          font-size: 12px;
          padding-left: 18px;

          &::before {
            content: "";
            width: 15.5px;
            height: 13.5px;
            background: url("@/assets/img/cp/heart.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 50%;
            margin-top: -5.5px;
            left: 0px;
            z-index: 1;
          }
        }
      }
    }

    .top5_2 {
      left: -30px;
      top: -35px;

      .users {
        background: url("@/assets/img/cp/top_2.png") no-repeat;
        background-position: center;
        background-size: cover;
      }
    }

    .top5_3 {
      right: -30px;
      top: -35px;

      .users {
        background: url("@/assets/img/cp/top_3.png") no-repeat;
        background-position: center;
        background-size: cover;
      }
    }

    .top5_4 {
      top: -40px;
      left: 35px;

      .users {
        background: url("@/assets/img/cp/top_4.png") no-repeat;
        background-position: center;
        background-size: cover;
      }
    }

    .top5_5 {
      top: -40px;
      right: 35px;

      .users {
        background: url("@/assets/img/cp/top_5.png") no-repeat;
        background-position: center;
        background-size: cover;
      }
    }
  }

  .list {
    .item {
      width: 100%;

      .date {
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 800;
        font-size: 16px;
        color: #ffffff;
        text-align: right;
        font-style: normal;
        text-transform: none;
        width: 100%;
        margin: 5px auto;
        padding: 0 8px;
      }

      .info {
        width: 100%;
        height: 166px;
        background: url("@/assets/img/cp/honor_item.png") no-repeat;
        background-position: center;
        background-size: cover;
        margin: 0px auto;
        padding: 0 15px;

        .love {
          width: 74.5px;
          height: 20.5px;
          background: url("@/assets/img/cp/bg_val-2.png") no-repeat;
          background-position: center;
          background-size: cover;

          .love_val {
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 800;
            font-size: 12px;
            color: #ffffff;
            text-align: center;
            font-style: normal;
            text-transform: none;
            padding-left: 18.5px;
            position: relative;

            &::before {
              content: "";
              width: 16.5px;
              height: 14px;
              background: url("@/assets/img/cp/heart.png") no-repeat;
              background-position: center;
              background-size: cover;
              position: absolute;
              top: 50%;
              margin-top: -6px;
              left: 0px;
              z-index: 1;
            }
          }
        }

        .users {
          flex: 1;
          overflow: hidden;

          .heartbeat {
            content: "";
            width: 81px;
            height: 73px;
            background: url("@/assets/img/cp/heartbeat.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .user {
            width: 105px;
            margin: 4px auto 0;
            overflow: hidden;

            .icon_box {
              width: 105px;
              height: 125px;
              position: relative;
              overflow: hidden;

              &::before {
                content: "";
                width: 100%;
                height: 100%;
                background: url("@/assets/img/cp/honor_avatar_box.png")
                  no-repeat;
                background-position: center;
                background-size: cover;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
              }

              .avatar {
                width: 71px;
                height: 71px;
                position: relative;
              }
            }

            .nick {
              font-family: PingFang-SC, PingFang-SC;
              font-weight: bold;
              font-size: 15px;
              color: #ffffff;
              text-align: center;
              font-style: normal;
              text-transform: none;
            }
          }
        }
      }
    }
  }

  .tips {
    font-family: PingFang-SC, PingFang-SC;
    font-weight: 400;
    font-size: 9px;
    color: #ececec;
    text-align: center;
    font-style: normal;
    text-transform: none;
    padding: 30px 0 20px;
  }
}
</style>
<style lang="scss">
.ara {
  .poster {
    background: url("@/assets/img/cp/poster_ar.png") no-repeat;
    background-position: center;
    background-size: cover;
  }
}

.en {
  .poster {
    background: url("@/assets/img/cp/poster.png") no-repeat;
    background-position: center;
    background-size: cover;
  }
}
</style>
