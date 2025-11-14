<script setup>
import { onMounted, reactive, ref } from "vue";
import { copyTarget, isSafari } from "@/utils";
import { showToast } from "vant";
import {
  SEARCH_USER, //搜索用户
  CHARGE_PROD_LIST, //充值列表
  LOCATION_COUNTRY, //国家定位
  COUNTRY_LIST, //国家列表
  OFFICIAL_WEBSITE_PLACE_V2, //发起充值
  AGENCY_HOST_LIST, //代理列表
} from "@/api/recharge";
import i18n from "@/i18n/self";
import icon_coin from "@/assets/img/recharge/coin.png";
import icon_copy from "@/assets/img/recharge/copy.png";
const props = defineProps(["uid"]);
// 是否是safari浏览器
const safari = isSafari();
// 国家
const country = reactive({
  // 信息
  info: {
    id: null, //国家id
    name: "", //国家名称
  },
  // 列表
  list: [],
});
//弹窗
let pops = reactive({
  show: false,
  type: -1, // 1:国家列表
});
let loading = ref(false); //是否加载中
let languages = reactive({
  current: 0,
  list: [
    {
      text: "Arabic",
      value: 0,
    },
    {
      text: "English",
      value: 1,
    },
  ],
});
let user = reactive({
  hamsterId: null, //用户naadi号 (例： 8064069)
  //用户信息
  info: {
    avatar: "", //用户头像
    erbanNo: null, //用户naadi号
    monthMoney: 0, //用户本月使用 cash 兑换金币（代理金币）或使用非埃镑进行充值
    nick: "", //用户昵称
    uid: null, //用户uid
  },
});
let tabs = reactive({
  current: 0,
  list: [
    {
      label: "Method",
      value: 0,
    },
    {
      label: "Reseller",
      value: 1,
    },
  ],
});
let agency = reactive({
  list: [
    // {
    //   uid: 563, //用户uid
    //   erbanNo: 1800997, //用户naadi号
    //   avatar: "https://file.hamsterdw.com/User/1722412875962.jpg", //用户头像
    //   nick: "1800997", //用户昵称
    //   heat: 9999, //热度,没有时返回null
    // },
  ],
});
let payChannel = reactive({
  current: 0, //当前选择的支付方式
  curType: 0, //当前选择的支付方式
  curProd: 0, //当前选择的产品
  list: [
    {
      expand: false, //是否展开
      // 币种类型列表
      currencyTypeList: [
        {
          currencyType: 1, //币种类型 1美元 2本地币
          currencyTypeName: "USD", //币种类型名称
          // 充值产品列表
          prodList: [
            {
              chargeProdId: 1, //充值产品id
              channelId: 1, //渠道id
              money: 0.99, //价格
              goldNum: 500, //金币数量
              cashbackGoldNum: 200, //返现金币数
              isPreferential: false, //是否是优惠产品
            },
            {
              chargeProdId: 1, //充值产品id
              channelId: 1, //渠道id
              money: 0.99, //价格
              goldNum: 400, //金币数量
              cashbackGoldNum: 100, //返现金币数
              isPreferential: false, //是否是优惠产品
            },
          ],
          surplusInventory: null, //币种库存,没有时为null
        },
      ],
      // 支付方式图标
      payPicUrls: [
        "https://file.hamsterdw.com/system/country/1688955159773.png",
        "https://file.hamsterdw.com/system/country/1688955170860.png",
        "https://file.hamsterdw.com/system/country/1688955182940.png",
      ],
      payType: "CARD", //支付方式
      payTypeName: "Visa/MasterCard", //支付方式名称
    },
  ],
});

// 重置
function onReset() {
  user.hamsterId = null;
  user.info = {
    avatar: "", //用户头像
    erbanNo: null, //用户naadi号
    monthMoney: 0, //用户本月使用 cash 兑换金币（代理金币）或使用非埃镑进行充值
    nick: "", //用户昵称
    uid: null, //用户uid
  };
  payChannel.current = 0;
  payChannel.curType = 0;
  payChannel.curProd = 0;
  payChannel.list = [];
}

// 确认
function onConfirm() {
  if (!user.hamsterId) {
    showToast("Please enter Hamster ID");
    return;
  }

  if (user.info.uid) {
    onReset(); //重置
    return;
  }

  searchUser(() => {
    getChargeProdList(); //获取充值列表
  });
}

// 输入id
function oninput(e) {
  let value = e.target.value;

  // 移除所有非数字字符
  value = value.replace(/\D/g, "");

  // 确保不超过10位
  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  // 更新 data 属性
  user.hamsterId = value;
}

// tab切换
function onTabChange(index) {
  tabs.current = index;

  switch (index) {
    case 0: //Method
      break;

    case 1: //Reseller
      getAgencyHostList(); //获取代理列表
      break;

    default:
      break;
  }
}

// 翻译
function self_t(key) {
  const lang = languages.current == 0 ? "ara" : "en";

  return i18n(lang).global.tm(key);
}

// 语言切换
function onLanguageChange(index) {
  languages.current = index;

  let viewsWrap = document.getElementsByClassName("views_wrap")[0];

  viewsWrap.setAttribute("dir", languages.current == 0 ? "rtl" : "ltr");
  viewsWrap.setAttribute(
    "class",
    languages.current == 0 ? "views_wrap ara" : "views_wrap en"
  );
  tabs.list = self_t("recharge.index.tabList"); //tabs列表赋值
  languages.list = self_t("recharge.index.langList"); //languages列表赋值
}

// 搜索用户
function searchUser(cb) {
  let params = {
    language: languages.current == 0 ? "ar" : "en", //语言
    erbanNo: user.hamsterId, //用户naadi号
    uid: props.uid,
  };
  loading.value = true;
  SEARCH_USER(params)
    .then((data) => {
      loading.value = false;
      user.info = data;

      cb && cb();
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 获取充值列表
function getChargeProdList() {
  let params = {
    language: languages.current == 0 ? "ar" : "en", //语言
    countryId: country.info.id, //国家id
    isSafari: safari, //是否为苹果浏览器 true是 false否
    queryUid: user.info.uid, //请求充值的用户uid
    uid: props.uid,
  };
  loading.value = true;
  CHARGE_PROD_LIST(params)
    .then((data) => {
      loading.value = false;
      data.forEach((el) => {
        el.expand = false;
      });
      payChannel.list = data;
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 获取国家信息
function getCountryInfo(cb) {
  LOCATION_COUNTRY({
    language: languages.current == 0 ? "ar" : "en", //语言
    uid: props.uid,
  })
    .then((data) => {
      const { countryId, countryName } = data;

      country.info.id = countryId;
      country.info.name = countryName;

      cb && cb();
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 获取国家列表
function getCountryList() {
  COUNTRY_LIST({
    language: languages.current == 0 ? "ar" : "en", //语言
    uid: props.uid,
  })
    .then((data) => {
      let list = data;

      list.forEach((el) => {
        if (el.countryId == country.info.id) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      });

      country.list = list;
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 获取代理列表
function getAgencyHostList() {
  AGENCY_HOST_LIST({
    language: languages.current == 0 ? "ar" : "en", //语言
    uid: props.uid,
  })
    .then((data) => {
      if (data && data.length > 0) {
        agency.list = data;
      }
    })
    .catch((err) => {
      showToast(err.message);
    });
}

// 发起充值
function onTopUp() {
  loading.value = true;

  const curPay = payChannel.list[payChannel.current];
  const curType =
    payChannel.list[payChannel.current].currencyTypeList[payChannel.curType];
  const curProd =
    payChannel.list[payChannel.current].currencyTypeList[payChannel.curType]
      .prodList[payChannel.curProd];

  let params = {
    language: languages.current == 0 ? "ar" : "en", //语言
    //用户uid
    uid: user.info.uid,
    //充值产品id
    chargeProdId: curProd.chargeProdId,
    //渠道id
    channelId: curProd.channelId,
    countryId: country.info.id, //国家id
    payType: curPay.payType, //支付方式
    currencyType: curType.currencyType, //币种类型 1美元 2本地币
    isSafari: safari, //是否为苹果浏览器 true是 false否
  };

  OFFICIAL_WEBSITE_PLACE_V2(params)
    .then((data) => {
      loading.value = false;
      window.location.href = data.redirectUrl;
    })
    .catch((err) => {
      loading.value = false;
      showToast(err.message);
    });
}

// 打开弹窗
function openPops(type) {
  pops.type = type;
  pops.show = true;
}

// 关闭弹窗
function closePops() {
  pops.type = -1;
  pops.show = false;
}

// 选择国家
function onCountryChoose(index) {
  country.list.forEach((el, i) => {
    if (i == index) {
      el.checked = true;
      country.info.id = el.countryId;
      country.info.name = el.countryName;
      getChargeProdList(); //获取充值列表
    } else {
      el.checked = false;
    }
  });

  closePops();
}

// 复制uid
function onCopyUid(uid) {
  copyTarget(uid, () => {
    showToast("Copied to clipboard");
  });
}

// 支付方式选择
function onPayChoosed(index1) {
  payChannel.current = index1;
  payChannel.curType = 0;
  payChannel.curProd = 0;
  payChannel.list.forEach((el, i) => {
    if (index1 == i) {
      el.expand = !el.expand;
    } else {
      el.expand = false;
    }
  });
}

// 充值档位选择
function onProdChoosed(index1, index2, index3) {
  payChannel.current = index1;
  payChannel.curType = index2;
  payChannel.curProd = index3;
}

// 初始化
function init() {
  //获取国家信息
  getCountryInfo(() => {
    getCountryList(); //获取国家列表
  });
  onTabChange(tabs.current);
}

onMounted(() => {
  onLanguageChange(languages.current);
});

init(); //初始化
</script>

<template>
  <div class="recharge">
    <div class="container">
      <!-- Language选择 -->
      <div class="langs al-center">
        <p class="mind">{{ self_t("recharge.index.tips.checkInfo") }}</p>
        <van-dropdown-menu class="drop_menu">
          <van-dropdown-item v-model="languages.current" :options="languages.list" @change="onLanguageChange" />
        </van-dropdown-menu>
      </div>

      <!-- 用户信息 -->
      <div class="user al-center">
        <div class="base">
          <template v-if="user.info.uid">
            <div class="info al-center">
              <van-image :src="user.info.avatar" round class="avatar" />
              <div class="nick clamp-1">{{ user.info.nick }}</div>
            </div>
          </template>
          <template v-else>
            <input class="ipt" type="text" maxlength="10" :placeholder="self_t('recharge.index.idPlaceholder')"
              v-model="user.hamsterId" @input="oninput" />
          </template>
        </div>
        <van-button class="conf" @click="onConfirm">{{
          user.info.uid
            ? self_t("recharge.index.cancel")
            : self_t("recharge.index.confirm")
        }}</van-button>
      </div>

      <!-- Tabs -->
      <ul class="tabs al-center">
        <li class="tab" :class="tabs.current == idx ? 'tab_act' : 'tab_def'" v-for="(item, idx) in tabs.list" :key="idx"
          @click="onTabChange(idx)">
          {{ item.label }}
        </li>
      </ul>

      <!-- Method -->
      <template v-if="tabs.current == 0">
        <div class="method">
          <div class="locat" @click="openPops(1)">
            <svg t="1734926174882" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="849" width="16" height="16">
              <path
                d="M503.04 32A375.04 375.04 0 0 0 128 407.04C128 668.16 472.64 992 503.04 992s375.04-323.84 375.04-584.96A375.04 375.04 0 0 0 503.04 32z m0 535.04a160 160 0 1 1 160-160 160 160 0 0 1-160 160z"
                fill="#000000" p-id="850"></path>
            </svg>
            <span class="name">{{ country.info.name }}</span>
          </div>

          <template v-if="user.info.uid && payChannel.list.length > 0">
            <!-- 支付渠道 -->
            <ul class="paies">
              <li class="pay" :class="{ curPay: idx == payChannel.current }" v-for="(item, idx) in payChannel.list"
                :key="idx">
                <div class="name" :class="idx == payChannel.current && item.expand
                  ? 'name_act'
                  : 'name_def'
                  " @click="onPayChoosed(idx)">
                  <template v-if="item.payPicUrls && item.payPicUrls.length > 0">
                    <van-image v-for="(pic, picIdx) in item.payPicUrls" :key="picIdx" :src="pic" class="pay_pic" />
                  </template>
                  <span>{{ item.payTypeName }}</span>
                </div>
                <template v-if="
                  idx == payChannel.current &&
                  item.expand &&
                  item.currencyTypeList &&
                  item.currencyTypeList.length > 0
                ">
                  <ol class="type_list">
                    <li class="type_item" :class="{ curType: typeIdx == payChannel.curType }"
                      v-for="(type, typeIdx) in item.currencyTypeList" :key="typeIdx">
                      <p class="type">{{ type.currencyTypeName }}</p>
                      <ul v-if="type.prodList && type.prodList.length > 0" class="prods">
                        <li class="prod" :class="{
                          curProd:
                            prodIdx == payChannel.curProd &&
                            typeIdx == payChannel.curType,
                        }" v-for="(prod, prodIdx) in type.prodList" :key="prodIdx"
                          @click="onProdChoosed(idx, typeIdx, prodIdx)">
                          <div class="inner">
                            <div class="price al-center">
                              <van-image :src="icon_coin" class="coin" />
                              <span class="nums">{{ prod.goldNum }}</span>
                            </div>
                            <p class="type_name">
                              {{ type.currencyTypeName + " " + prod.money }}
                            </p>
                            <div v-if="prod.cashbackGoldNum" class="cashback al-center">
                              <span class="num">{{
                                "+" + prod.cashbackGoldNum
                              }}</span>
                              <van-image :src="icon_coin" class="coin" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ol>
                </template>
              </li>
            </ul>

            <!-- 充值 -->
            <van-button class="topup al-center" @click="onTopUp">{{
              self_t("recharge.index.topup")
            }}</van-button>
          </template>
        </div>
      </template>

      <!-- Reseller -->
      <template v-if="tabs.current == 1">
        <div class="reseller">
          <div class="content">
            <div class="lab">
              Top-up Through US Official Resellers to get the best price:
            </div>
            <div class="val">
              Available rechargo methods of Resellers.Copy the lD and find them
              in the app directly for more transfer details.Make sure message
              them first and noto your Hamster lD number for every transaction.
            </div>
          </div>

          <ul v-if="agency.list.length > 0" class="list">
            <li class="item al-center" v-for="(item, idx) in agency.list" :key="idx">
              <van-image :src="item.avatar" round class="avatar" />
              <div class="info">
                <div class="nick clamp-1">{{ item.nick }}</div>
                <div class="id">
                  <span class="text">{{ "ID：" + item.uid }}</span>
                  <van-image :src="icon_copy" class="copy" @click="onCopyUid(item.uid)" />
                </div>
              </div>
              <div class="heat al-center">
                <van-image :src="icon_coin" class="coin" />
                <span class="nums">{{ item.heat }}</span>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>

    <!-- 弹窗 -->
    <van-popup class="pops" v-model:show="pops.show" :custom-class="pops.customClass" position="bottom"
      @close="closePops">
      <template v-if="pops.type == 1">
        <div class="country_opts">
          <h1 class="title al-center">Country</h1>
          <h2 class="label">Option</h2>
          <ul class="list">
            <li class="item al-center" v-for="(item, idx) in country.list" :key="idx" @click="onCountryChoose(idx)">
              <van-image class="icon" :src="item.countryNationalFlag" />
              <span class="name clamp-1">{{ item.countryName }}</span>
              <span class="check" :class="item.checked ? 'check_act' : 'check_def'"></span>
            </li>
          </ul>
        </div>
      </template>
    </van-popup>

    <Loading :show="loading" color="#ffc800" bg-color="transparent" />
  </div>
</template>

<style lang="scss" scoped>
.recharge {
  width: 100%;
  background: #fdf5e0;
  position: relative;

  .container {
    padding: 10px;

    .langs {
      font-family: Helvetica, Helvetica;
      font-weight: bold;
      font-size: 12px;
      color: #000000;
      line-height: 15px;
      font-style: normal;

      .mind {
        flex: 1;
        overflow: hidden;
      }
    }

    .user {
      width: 100%;
      height: 70px;
      background: rgba(178, 144, 64, 0.2);
      border-radius: 6px;
      padding: 8px;
      margin: 15px auto;

      .base {
        flex: 1;
        overflow: hidden;

        .info {
          width: 100%;

          .avatar {
            width: 55px;
            height: 55px;
          }

          .nick {
            flex: 1;
            padding: 0 10px;
            overflow: hidden;
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 13px;
            color: #000000;
            line-height: 16px;
            font-style: normal;
          }
        }

        .ipt {
          width: 100%;
          height: 54px;
          border: none;
          background: transparent;
          font-family: Helvetica;
          font-size: 13px;
          color: #000000;
          font-style: normal;

          &::placeholder {
            width: 100%;
            height: 100%;
            font-family: Helvetica;
            font-size: 13px;
            color: #b39d65;
            font-style: normal;
          }
        }
      }

      .conf {
        min-width: 78px;
        height: 32px;
        border-radius: 32px;
        background: linear-gradient(#ffc800, #ffc928);
        font-family: Helvetica;
        font-size: 12px;
        color: #000000;
        font-style: normal;
      }
    }

    .tabs {
      width: 100%;
      margin: 30px auto 20px;
      justify-content: space-around;

      .tab {
        font-family: Helvetica, Helvetica;
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .tab_act {
        color: #000000;
        position: relative;

        &::before {
          content: "";
          width: 20px;
          height: 3px;
          background: #000000;
          border-radius: 2px;
          position: absolute;
          left: 50%;
          margin-left: -10px;
          bottom: -3px;
        }
      }

      .tab_def {
        color: #979386;
      }
    }

    .method {
      .locat {
        display: flex;

        .name {
          flex: 1;
          padding: 0 1px;
          overflow: hidden;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 14px;
          color: #000000;
          line-height: 17px;
          font-style: normal;
          text-transform: none;
        }
      }

      .paies {
        width: 100%;

        .pay {
          width: 100%;

          .name {
            width: 100%;
            height: 51px;
            margin: 10px auto;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            background: rgba(178, 144, 64, 0.2);
            border-radius: 6px;
            padding: 6px 23px 6px 6px;
            font-family: Helvetica;
            font-size: 13px;
            color: #000000;
            font-style: normal;
            position: relative;
            border: none;

            &::after {
              content: "";
              width: 11px;
              height: 7px;
              position: absolute;
              right: 6px;
              top: 50%;
              margin-top: -3.5px;
              background: url("@/assets/img/arr_down.png") no-repeat;
              background-position: center;
              background-size: cover;
            }

            .pay_pic {
              width: 20px;
              height: 20px;
              margin: 0 5px;
            }
          }

          .name_act {
            &::after {
              transform: rotate(180deg);
            }
          }

          .name_def {
            &::after {
              transform: rotate(0deg);
            }
          }

          .type_list {
            width: 100%;

            .type_item {
              width: 100%;

              .type {
                font-family: Helvetica, Helvetica;
                font-weight: bold;
                font-size: 14px;
                color: #000000;
                font-style: normal;
                text-transform: none;
              }

              .prods {
                display: flex;
                flex-wrap: wrap;

                .prod {
                  width: 50%;
                  margin: 18px 0;

                  .inner {
                    width: 100%;
                    background: #ffffff;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    position: relative;

                    .price {
                      width: 100%;
                      margin: 16px auto 13px;

                      .coin {
                        width: 29px;
                        height: 29px;
                        margin: 0 5px;
                      }

                      .nums {
                        font-family: Helvetica, Helvetica;
                        font-weight: bold;
                        font-size: 20px;
                        color: #714400;
                        font-style: normal;
                      }
                    }

                    .type_name {
                      font-family: Helvetica, Helvetica;
                      font-weight: bold;
                      font-size: 12px;
                      color: #000000;
                      line-height: 15px;
                      text-align: center;
                      font-style: normal;
                      margin: 13px auto 16px;
                    }

                    .cashback {
                      padding: 6px 9px;
                      position: absolute;
                      right: -8px;
                      top: -12.5px;
                      border-radius: 6px;
                      background: linear-gradient(90deg, #ff5d5d, #ffc200);

                      .coin {
                        width: 11px;
                        height: 11px;
                        margin: 0 2px;
                      }

                      .num {
                        font-family: Helvetica, Helvetica;
                        font-weight: bold;
                        font-size: 12px;
                        color: #ffffff;
                        font-style: normal;
                      }
                    }
                  }

                  &:nth-child(odd) {
                    padding-right: 10px;
                  }

                  &:nth-child(even) {
                    padding-left: 10px;
                  }
                }
              }
            }
          }
        }

        .curPay {
          .type_list {
            .curType {
              .prods {
                .curProd {
                  .inner {
                    background: #fff2af;
                    border: 2px solid #ffc800;
                  }
                }
              }
            }
          }
        }
      }

      .topup {
        width: 100%;
        height: 44px;
        margin: 10px auto;
        background: linear-gradient(#ffc800, #ffc928);
        border-radius: 22px;
        border: none;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #000000;
        font-style: normal;
      }
    }

    .reseller {
      .content {
        background: rgba(178, 144, 64, 0.2);
        border-radius: 6px;
        padding: 8px 8px;

        .lab {
          width: 273px;
          margin: 8px auto;
          font-family: Helvetica, Helvetica;
          font-weight: bold;
          font-size: 13px;
          color: #000000;
          line-height: 16px;
          font-style: normal;
          text-align: center;
        }

        .val {
          margin: 8px auto;
          font-family: Helvetica;
          font-size: 13px;
          color: #b39d65;
          line-height: 16px;
          font-style: normal;
        }
      }

      .list {
        width: 100%;

        .item {
          width: 100%;
          background: #ffffff;
          border-radius: 6px;
          margin: 10px auto;
          padding: 8px;

          .avatar {
            width: 55px;
            height: 55px;
          }

          .info {
            flex: 1;
            padding: 0 10px;
            flex-shrink: 0;
            overflow: hidden;

            .nick {
              font-family: Helvetica, Helvetica;
              font-weight: bold;
              font-size: 15px;
              color: #1a1a1a;
              line-height: 18px;
              font-style: normal;
              text-transform: none;
              margin-bottom: 5px;
            }

            .id {
              font-family: Helvetica;
              font-size: 13px;
              line-height: 16px;
              font-style: normal;

              .text {
                color: #b39d65;
              }

              .copy {
                width: 10px;
                height: 10px;
                margin: 0 4px;
              }
            }
          }

          .heat {
            .coin {
              width: 15px;
              height: 16px;
              margin: 0 4px;
            }

            .nums {
              font-family: Helvetica, Helvetica;
              font-weight: bold;
              font-size: 14px;
              color: #000000;
              font-style: normal;
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
  background: #fdf5e0;
}

.recharge {
  .van-dropdown-item__content {
    position: absolute !important;
    max-height: var(--van-dropdown-menu-content-max-height) !important;
  }

  .pops {
    width: 100%;
    height: 419px;
    background: linear-gradient(#ffe2bf, #fefbf3);
    border-radius: 15px 15px 0 0;

    .country_opts {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .title {
        font-family: Helvetica, Helvetica;
        font-weight: bold;
        font-size: 16px;
        color: #000000;
        font-style: normal;
        margin: 20px auto;
        padding: 0 10px;
      }

      .label {
        font-family: Helvetica, Helvetica;
        font-weight: bold;
        font-size: 16px;
        color: #000000;
        font-style: normal;
        padding: 0 10px;
      }

      .list {
        flex: 1;
        padding: 10px 10px 0 10px;
        overflow-x: hidden;
        overflow-y: auto;

        .item {
          width: 100%;
          margin: 20px auto;

          .icon {
            width: 29px;
            height: 20px;
            border-radius: 2px;
          }

          .name {
            padding: 0 10px;
            flex: 1;
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 14px;
            color: #121212;
            font-style: normal;
            overflow: hidden;
          }

          .check {
            width: 17px;
            height: 17px;
          }

          .check_act {
            background: url("@/assets/img/recharge/check_act.png") no-repeat;
            background-position: center;
            background-size: cover;
          }

          .check_def {
            background: url("@/assets/img/recharge/check_def.png") no-repeat;
            background-position: center;
            background-size: cover;
          }
        }
      }
    }
  }
}

.ara {
  .container {
    .drop_menu {
      .van-dropdown-menu__bar {
        border-radius: 6px;
        background: rgba(178, 144, 64, 0.2);
        height: auto;
        padding: 7px 6px 7px 10px;

        .van-dropdown-menu__title {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          padding: 0 0 0 8px;
          font-size: 12px;
          color: #000000;
          line-height: 17px;
          font-style: normal;

          &::before {
            content: "";
            border: none;
            width: 6px;
            height: 1px;
            position: absolute;
            right: auto;
            left: -5px;
            top: 50%;
            margin-top: 0px;
            transform: rotate(45deg);
            background: #474339;
          }

          &::after {
            content: "";
            border: none;
            width: 6px;
            height: 1px;
            position: absolute;
            right: auto;
            left: -1px;
            top: 50%;
            margin-top: 0px;
            transform: rotate(-45deg);
            background: #474339;
          }
        }
      }

      .van-dropdown-item__option {
        .van-cell__title {
          text-align: right;
        }

        .van-cell__value {
          text-align: left;
        }
      }
    }

    .paies {
      .pay {
        .name {
          padding: 6px 6px 6px 23px !important;

          &::after {
            right: auto !important;
            left: 6px;
          }
        }

        .type_list {
          .type_item {
            .prods {
              .prod {
                .inner {
                  .cashback {
                    right: auto !important;
                    left: -8px;
                    background: linear-gradient(-90deg,
                        #ff5d5d,
                        #ffc200) !important;
                  }
                }

                &:nth-child(odd) {
                  padding-right: 0px !important;
                  padding-left: 10px;
                }

                &:nth-child(even) {
                  padding-left: 0px !important;
                  padding-right: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
}

.en {
  .container {
    .drop_menu {
      .van-dropdown-menu__bar {
        border-radius: 6px;
        background: rgba(178, 144, 64, 0.2);
        height: auto;
        padding: 7px 10px 7px 6px;

        .van-dropdown-menu__title {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          padding: 0 8px 0 0;
          font-size: 12px;
          color: #000000;
          line-height: 17px;
          font-style: normal;

          &::before {
            content: "";
            border: none;
            width: 6px;
            height: 1px;
            position: absolute;
            right: -6px;
            top: 50%;
            margin-top: 0px;
            transform: rotate(-45deg);
            background: #474339;
          }

          &::after {
            content: "";
            border: none;
            width: 6px;
            height: 1px;
            position: absolute;
            right: -1px;
            top: 50%;
            margin-top: 0px;
            transform: rotate(45deg);
            background: #474339;
          }
        }
      }

      .van-dropdown-item__option {
        .van-cell__title {
          text-align: left;
        }

        .van-cell__value {
          text-align: right;
        }
      }
    }
  }
}
</style>
