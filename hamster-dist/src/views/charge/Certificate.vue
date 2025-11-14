<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import { OpenCoinRecharge } from "@/utils/client";
import { showToast } from "vant";
import {
  CHARGE_RANK, //排行榜
  HONOR_HALL, //荣耀殿堂
} from "@/api/charge";

// 接收参数
const props = defineProps(["uid"]);
const router = useRouter();
const lang = getLang();

let loading = ref(false); //是否加载中
let loaded = ref(false); //是否加载完成
let countdown = ref(0); //倒计时
let info = reactive({
  index: null, //排名
  avatar: "", //头像
  diffMoney: 0, //差额
  totalMoney: 0, //总金额
  nick: "", //昵称
  uid: null, //用户id
});
let honor = reactive({
  // 荣耀墙
  honorHallList: [],
});

// 充值
function onRecharge() {
  OpenCoinRecharge();
}

// 返回
function goBack() {
  router.go(-1);
}

// 获取荣耀殿堂
function getHonorHall() {
  loading.value = true;
  HONOR_HALL({ uid: props.uid, })
    .then((data) => {
      loading.value = false;
      const { honorHallList } = data;

      honor.honorHallList = honorHallList;
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 获取榜单
function getChargeRank() {
  loading.value = true;
  CHARGE_RANK({
    dateType: 2, //1:昨天 2:今天
    uid: props.uid, //用户id
  })
    .then((data) => {
      loading.value = false;
      const { endTime, myRank } = data;

      info = myRank; //个人信息赋值
      countdown.value = endTime; //倒计时赋值
      loaded.value = true; //加载完成（防止第一次加载时触发倒计时结束）
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 倒计时结束
function countdownFinish() {
  if (loaded.value) {
    init(); //重新初始化数据
  }
}

// 初始化数据
function init() {
  getChargeRank(); //获取榜单
  getHonorHall(); //获取荣耀殿堂
}

init(); //初始化
</script>

<template>
  <div class="certificate">
    <div class="poster">
      <div class="back" @click="goBack"></div>

      <div class="times al-center">
        <van-count-down class="countdown al-center" :time="countdown" @finish="countdownFinish">
          <template #default="timeData">
            <div class="days">
              <span class="nums">{{
                timeData.days > 9 ? timeData.days : "0" + timeData.days
              }}</span>
              <span class="colon">d</span>
            </div>
            <div class="hours">
              <span class="nums">{{
                timeData.hours > 9 ? timeData.hours : "0" + timeData.hours
              }}</span>
              <span class="colon">h</span>
            </div>
            <div class="minutes">
              <span class="nums">{{
                timeData.minutes > 9 ? timeData.minutes : "0" + timeData.minutes
              }}</span>
              <span class="colon">m</span>
            </div>
            <div class="seconds">
              <span class="nums">{{
                timeData.seconds > 9 ? timeData.seconds : "0" + timeData.seconds
              }}</span>
              <span class="colon">s</span>
            </div>
          </template>
        </van-count-down>
      </div>
    </div>

    <div class="container">
      <div class="hall">
        <div class="info al-center">
          <div v-if="info" class="user al-center">
            <div class="avatar_box al-center">
              <van-image class="avatar" round :src="info.avatar" fit="cover" />
            </div>
            <ul class="bases">
              <template v-if="lang == 'en'">
                <li class="base">
                  {{ "Ranking：" + info.index }}
                </li>
                <li class="base">
                  {{ "Total recharge amount: $" + info.totalMoney }}
                </li>
                <li class="base">
                  {{
                    "To reach TOP1, you still need to recharge: $" +
                    info.diffMoney
                  }}
                </li>
              </template>
              <template v-else>
                <li class="base">
                  {{ "تصنيف : " + info.rankIndex }}
                </li>
                <li class="base">
                  {{ "مجموع الشحن : " + info.amount + "دولار" }}
                </li>
                <li class="base">
                  {{
                    "للوصول إلى أعلى 1 ، كنت لا تزال بحاجة إلى إعادة شحن : " +
                    info.diffMoney +
                    "دولار"
                  }}
                </li>
              </template>
              <li class="btn_charge" @click="onRecharge"></li>
            </ul>
          </div>
        </div>

        <p class="tips">
          {{ $t("charge.certificate.tips.winners") }}
        </p>

        <ul v-if="honor.honorHallList.length > 0" class="honors">
          <li class="honor" :class="'honor' + (idx + 1)" v-for="(item, idx) in honor.honorHallList" :key="idx">
            <van-image class="avatar" round :src="item.avatar" fit="cover" />
            <div class="nick clamp-1">{{ item.nick || "***" }}</div>
            <div class="val al-center">{{ item.totalMoney || "***" }}</div>
            <div v-if="idx >= 3" class="sort">{{ "TOP" + (idx + 1) }}</div>
          </li>
        </ul>
      </div>
    </div>

    <Loading :show="loading" color="#fff" bg-color="transparent" />
  </div>
</template>

<style lang="scss" scoped>
.certificate {
  width: 100%;
  position: relative;
  background: #c4973a;

  .poster {
    width: 100%;
    height: 404px;
    position: relative;

    .back {
      width: 35px;
      height: 35px;
      position: absolute;
      top: 9px;
      left: 6px;
      background: url("@/assets/img/charge/back.png") no-repeat;
      background-position: center;
      background-size: cover;

      &:active {
        transform: scale(0.9);
      }
    }

    .times {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1;
      width: 375px;
      height: 75px;
      background: url("@/assets/img/charge/countdown.png") no-repeat;
      background-position: center;
      background-size: cover;

      .countdown {
        width: 365px;
        height: 48px;
        margin-top: 24px;

        .days,
        .hours,
        .minutes,
        .seconds {
          width: 45px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 18px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 400;
          font-size: 19px;
          color: #ffffff;
          font-style: normal;
          text-transform: none;
          background: url("@/assets/img/charge/times.png") no-repeat;
          background-position: center;
          background-size: cover;
        }

        .days,
        .hours,
        .minutes {
          position: relative;

          &::before {
            content: "";
            width: 1px;
            height: 23px;
            background: #5e3b00;
            position: absolute;
            right: -19px;
            top: 50%;
            margin-top: -11.5px;
          }
        }
      }
    }
  }

  .container {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: -25px;

    &::before {
      content: "";
      width: 100%;
      height: 833px;
      position: absolute;
      left: 0;
      top: 0;
      background: url("@/assets/img/charge/bg_container.png") no-repeat;
      background-position: center;
      background-size: cover;
    }

    .hall {
      position: relative;

      .info {
        width: 100%;
        height: 221px;
        margin: 30px auto 0;
        background: url("@/assets/img/charge/userinfo.png") no-repeat;
        background-position: center;
        background-size: cover;

        .user {
          width: 300px;
          height: 100px;
          position: relative;
          overflow: hidden;

          .avatar_box {
            width: 75px;
            height: 75px;
            margin: 0 0 0 5px;
            position: relative;

            &::before {
              content: "";
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 1;
              background: url("@/assets/img/charge/ring.png") no-repeat;
              background-position: center;
              background-size: cover;
            }

            .avatar {
              width: 60px;
              height: 60px;
            }
          }

          .bases {
            flex: 1;
            padding: 0 5px;
            overflow: hidden;

            .base {
              font-family: PingFang-SC, PingFang-SC;
              font-weight: bold;
              font-size: 11px;
              color: #ffea5c;
              line-height: 16px;
              text-align: center;
              font-style: normal;
              text-transform: none;
              text-align: left;
            }

            .btn_charge {
              width: 87px;
              height: 32px;
              margin-top: 5px;
              position: absolute;
              right: 0;
              bottom: 0;

              &:active {
                transform: scale(0.9);
              }
            }
          }
        }
      }

      .tips {
        width: 100%;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 800;
        font-size: 18px;
        color: #ffea5c;
        line-height: 19px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin: 24px auto;
      }

      .honors {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;

        .honor {
          width: 156px;
          height: 170px;
          margin: 5px auto;
          position: relative;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/charge/honor.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
          }

          .avatar {
            width: 80px;
            height: 80px;
            display: block;
            margin: 10px auto 10px;
            position: relative;
            left: -3px;
            z-index: 1;
          }

          .nick {
            width: 100%;
            padding: 0 10px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 800;
            font-size: 16px;
            color: #ffc900;
            text-align: left;
            font-style: normal;
            text-transform: none;
            position: relative;
            z-index: 1;
            text-align: center;
          }

          .val {
            width: 50px;
            height: 18px;
            margin: 0 auto;
            background: url("@/assets/img/charge/react.png") no-repeat;
            background-position: center;
            background-size: cover;
            position: relative;
            z-index: 1;
            text-align: center;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 800;
            font-size: 11px;
            color: #ffc900;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }

          .sort {
            width: 100%;
            font-family: Impact;
            font-size: 22px;
            color: #352003;
            text-align: left;
            font-style: normal;
            text-transform: none;
            text-align: center;
            position: absolute;
            left: 0;
            bottom: 0px;
            z-index: 1;
          }
        }

        .honor1 {
          width: 311px;
          height: 237px;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/charge/honor1.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 94px;
            height: 94px;
            margin: 42px auto 15px;
            position: relative;
            left: 1px;
          }

          .nick {
            font-size: 19px;
            margin: 4px auto;
          }

          .val {
            width: 59px;
            height: 21px;
            font-size: 13px;
          }
        }

        .honor2 {
          width: 183px;
          height: 199px;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/charge/honor2.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 80px;
            height: 80px;
            margin: 32px auto 13px;
            position: relative;
            left: 0px;
          }

          .nick {
            font-size: 16px;
            margin: 4px auto;
          }
        }

        .honor3 {
          width: 183px;
          height: 199px;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            background: url("@/assets/img/charge/honor3.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 80px;
            height: 80px;
            margin: 32px auto 13px;
            position: relative;
            left: 0px;
          }

          .nick {
            font-size: 16px;
            margin: 4px auto;
          }
        }
      }

      .users {
        .content {
          position: relative;
          width: 365px;
          margin: 10px auto;

          .richs {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            .rich {
              flex-basis: 25%;
              overflow: hidden;
              flex-shrink: 0;
              margin: 5px auto;

              .avatar_box {
                width: 87px;
                height: 87px;
                position: relative;

                &::before {
                  content: "";
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  left: 0;
                  top: 0;
                  z-index: 1;
                  background: url("@/assets/img/charge/avatar_box.png") no-repeat;
                  background-position: center;
                  background-size: cover;
                }

                .avatar {
                  width: 66px;
                  height: 66px;
                  margin: 4px auto 0;
                }
              }

              .nick {
                font-family: PingFang-SC, PingFang-SC;
                font-weight: 400;
                font-size: 12px;
                color: #fff09d;
                line-height: 15px;
                text-align: center;
                font-style: normal;
                text-transform: none;
              }

              .id {
                font-family: PingFang-SC, PingFang-SC;
                font-weight: 400;
                font-size: 9px;
                color: #fff09d;
                line-height: 15px;
                text-align: center;
                font-style: normal;
                text-transform: none;
              }
            }
          }
        }
      }

      .mine {
        width: 375px;
        height: 78px;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
        background: url("@/assets/img/charge/bg_mine.png") no-repeat;
        background-position: center;
        background-size: cover;
        padding: 0 15px;

        .sort {
          font-family: HarmonyOS_Sans_SC_Bold;
          font-size: 18px;
          color: #6e5425;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .morethan10 {
          font-size: 17px !important;
        }

        .avatar_box {
          width: 72px;
          height: 72px;
          margin: 0 10px;
          position: relative;

          &::before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            background: url("@/assets/img/charge/avatar_box.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .avatar {
            width: 57px;
            height: 57px;
            margin-top: 3px;
          }
        }

        .nick {
          margin: 0 10px;
          max-width: 123px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 15px;
          color: #6e5425;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .val {
          flex: 1;
          overflow: hidden;
          text-align: right;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: bold;
          font-size: 18px;
          color: #624921;
          font-style: normal;
          text-transform: none;
        }
      }
    }
  }
}

.ara {
  .poster {
    background: url("@/assets/img/charge/poster_ar.png") no-repeat;
    background-position: center;
    background-size: cover;

    .back {
      left: auto !important;
      right: 6px;
    }

    .times {
      .countdown {

        .days,
        .hours,
        .minutes,
        .seconds {
          display: flex;
          flex-direction: row-reverse;
        }
      }
    }
  }

  .container {
    .hall {
      .info {
        .user {
          .avatar_box {
            margin: 0 5px 0 0;
          }

          .bases {
            .base {
              text-align: right;
            }

            .btn_charge {
              background: url("@/assets/img/charge/recharge_ar.png") no-repeat;
              background-position: center;
              background-size: 100%;
              right: auto !important;
              left: 0;
              bottom: 0;
            }
          }
        }
      }
    }
  }
}

.en {
  .poster {
    background: url("@/assets/img/charge/poster_en.png") no-repeat;
    background-position: center;
    background-size: cover;
  }

  .container {
    .hall {
      .info {
        .user {
          .bases {
            .btn_charge {
              background: url("@/assets/img/charge/recharge_en.png") no-repeat;
              background-position: center;
              background-size: 100%;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.views_wrap {
  background: #c4973a;
}
</style>
