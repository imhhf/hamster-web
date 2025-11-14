<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getLang } from "@/utils";
import i18n from '@/i18n/index.js';
import { showToast } from "vant";
import { GET_TAB_BEST_RoomInfo } from "@/api/roomWeekAct";
const { t } = i18n.global;
const roomWeekActUrl = (name) => {
    return new URL(`../../assets/img/roomWeekAct/${name}.png`, import.meta.url).href;
};
const roomWeekActGiftUrl = (name) => {
    return new URL(`../../assets/img/roomWeekAct/gifts/${name}.png`, import.meta.url).href;
};
// 接收参数
const props = defineProps(["uid"]);
const router = useRouter();
const lang = getLang();

// 创建房间的状态
const isChange = ref(false);
const popRule = ref(false)


function typeToName(type) {
    const map = [
        t('roomWeekAct.NoLevel'),
        'D',
        'C',
        'B',
        'A',
        'S',
        'SS'
    ];
    return map[type] || '';
};

// 房间流水奖励
const roomList = [
    {
        lv: 'SS',
        num: 5000000,
        imgBox: [
            {
                img: roomWeekActGiftUrl('coins'),
                name: '250000'
            },
            {
                img: roomWeekActGiftUrl('h6'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('r6'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('vip6'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('b6'),
                name: '7Day'
            },
        ],
    },
    {
        lv: 'S',
        num: 2500000,
        imgBox: [
            {
                img: roomWeekActGiftUrl('coins'),
                name: '100000'
            },
            {
                img: roomWeekActGiftUrl('h5'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('r5'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('vip5'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('b5'),
                name: '7Day'
            },
        ],
    },
    {
        lv: 'A',
        num: 1500000,
        imgBox: [
            {
                img: roomWeekActGiftUrl('coins'),
                name: '45000'
            },
            {
                img: roomWeekActGiftUrl('h4'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('r4'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('vip4'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('b4'),
                name: '7Day'
            },
        ],
    },
    {
        lv: 'B',
        num: 500000,
        imgBox: [
            {
                img: roomWeekActGiftUrl('coins'),
                name: '14000'
            },

            {
                img: roomWeekActGiftUrl('h3'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('r3'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('vip3'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('b3'),
                name: '7Day'
            },
        ],
    },
    {
        lv: 'C',
        num: 350000,
        imgBox: [
            {
                img: roomWeekActGiftUrl('coins'),
                name: '8750'
            },
            {
                img: roomWeekActGiftUrl('vip2'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('h2'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('r2'),
                name: '7Day'
            },
        ],
    },
    {
        lv: 'D',
        num: 150000,
        imgBox: [
            {
                img: roomWeekActGiftUrl('coins'),
                name: '3000'
            },
            {
                img: roomWeekActGiftUrl('vip1'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('h1'),
                name: '7Day'
            },
            {
                img: roomWeekActGiftUrl('r1'),
                name: '7Day'
            },
        ],

    },


]

const info = ref()
function getWeekRankTopFive() {
    GET_TAB_BEST_RoomInfo({
        uid: props.uid,
    })
        .then((data) => {
            info.value = data
            if (data) {

            } else {
                showToast(t('roomWeekAct.no'));
            }
            console.log('data==', info.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

const isTime = ref(8888)
const handleCountDownFinish = () => {
    console.log('time out');
    getWeekRankTopFive()
}
const clickBtn = () => {
    showToast(t('roomWeekAct.no'));

}

getWeekRankTopFive()
</script>

<template>
    <div class="roomWeekAct">
        <div class="banner" :class="lang === 'ara' ? 'banner-ara' : ''">
            <div @click="popRule = true" class="rule">{{ $t('roomWeekAct.rule') }}</div>
        </div>
        <!-- 有创建状态 -->
        <template v-if="info">
            <div class="myData">
                <div class="title">{{ $t('roomWeekAct.my') }}</div>
                <div class="list">
                    <div class="left">
                        <img :src="info?.roomAvatar" alt="">
                    </div>
                    <div class="right">
                        <div class="p">
                            <img v-if="lang === 'ara'" src="../../assets/img/roomWeekAct/icon-room-ara.png" alt="">
                            <img v-else src="../../assets/img/roomWeekAct/icon-room.png" alt="">

                            :{{ info?.totalNumber }}
                        </div>
                        <div class="p p2">
                            <img v-if="lang === 'ara'" src="../../assets/img/roomWeekAct/icon-lv-ara.png" alt="">
                            <img v-else src="../../assets/img/roomWeekAct/icon-lv.png" alt="">

                            :{{ typeToName(info?.level) }}
                        </div>
                        <div class="time" v-if="info?.timeOut > 0">
                            <span>{{ $t('roomWeekAct.award') }}</span>
                            <van-count-down class="vant-time" @finish="handleCountDownFinish" :time="info?.timeOut"
                                format="DDD HH:mm:ss" />
                        </div>

                    </div>
                </div>
            </div>
        </template>

        <!-- 无创建状态 -->
        <div class="nav">
            <p class="tt">{{ $t('roomWeekAct.Rewards') }}</p>

            <div class="rew-list-box" :class="!info ? 'rew-list-box-none' : ''">
                <div class="rew-list" v-for="(item, index) in roomList" :key="index">
                    <div class="room-lv">
                        <p>{{ $t('roomWeekAct.room') }}: <span class="span1">{{ item.lv }}</span></p>
                        <p>{{ $t('roomWeekAct.circ') }}: <span>{{ item.num }}</span></p>
                    </div>
                    <img v-if="lang === 'ara'" class="icon-tt" src="../../assets/img/roomWeekAct/icon-tt-ara.png"
                        alt="">
                    <img v-else class="icon-tt" src="../../assets/img/roomWeekAct/icon-tt.png" alt="">

                    <div class="list">
                        <div class="li" v-for="(it, ind) in item.imgBox" :key="ind">
                            <img :src="it.img" alt="">
                            <p>{{ it.name }}</p>
                        </div>
                    </div>
                </div>

                <img class="icon1" src="../../assets/img/roomWeekAct/icon1.png" alt="">
                <img v-if="lang === 'ara'" class="icon-tt2" src="../../assets/img/roomWeekAct/icon-tt2-ara.png" alt="">
                <img v-else class="icon-tt2" src="../../assets/img/roomWeekAct/icon-tt2.png" alt="">
            </div>

        </div>




        <!-- 有创建状态 -->
        <template v-if="!info">
            <div class="float">
                <img class="icon3" src="../../assets/img/roomWeekAct/icon3.png" alt="">

                <div class="tips">{{ $t('roomWeekAct.no') }}</div>

                <!-- <div class="btn" @click="clickBtn">{{ $t('roomWeekAct.go') }}</div> -->

            </div>

        </template>

        <van-popup class="pop" v-model:show="popRule" position="center">
            <div class="title">{{ $t('roomWeekAct.activ') }}</div>

            <div class="popRule">
                <div class="popRuleBox">
                    {{ $t('roomWeekAct.rule1') }}<br />
                    {{ $t('roomWeekAct.rule2') }}<br />
                    {{ $t('roomWeekAct.rule3') }}<br />
                    {{ $t('roomWeekAct.rule4') }}<br />
                    {{ $t('roomWeekAct.rule5') }}
                </div>

            </div>
        </van-popup>
    </div>

</template>
<style lang="scss" scoped>
@mixin bgImage($name) {
    background-image: url('@/assets/img/roomWeekAct/' + $name + '.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.roomWeekAct {
    background: #092010;
    // padding-bottom: 40px;

    .banner {
        width: 100%;
        height: 406px;
        @include bgImage('banner');

        &.banner-ara {
            @include bgImage('banner-ara');

        }


        .rule {
            position: absolute;
            right: 0;
            top: 104px;
            width: 52px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            @include bgImage('icon-rule');
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 12px;
            color: #E6D58D;
            line-height: 15px;
        }
    }

    .myData {
        width: 100%;
        height: 203px;
        @include bgImage('bg2');
        margin: 20px auto;
        position: relative;

        .title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -15px;
            width: 153px;
            height: 35px;
            @include bgImage('icon-tt-bg2');
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 15px;
            color: #FFEF85;
            line-height: 15px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .list {
            padding: 15px 20px;
            display: flex;
            align-items: center;

            .left {
                width: 126px;
                height: 154px;
                @include bgImage('icon4');
                display: flex;
                align-items: center;

                img {
                    max-width: 85px;
                    max-height: 85px;
                    margin: 60px auto 0;
                }
            }

            .right {

                .time {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;

                    span {
                        font-family: Helvetica, Helvetica;
                        font-weight: bold;
                        font-size: 15px;
                        color: #ffffff;
                        line-height: 15px;
                    }
                }

                .p,
                .p2,
                .vant-time {
                    display: flex;
                    align-items: center;
                    font-family: Helvetica, Helvetica;
                    font-weight: bold;
                    font-size: 15px;
                    color: #FFEF85;
                    line-height: 15px;
                    margin-top: 10px;

                    img {
                        width: 80px;
                        margin-top: 5px;
                    }

                    &.p2 {
                        img {
                            width: 120px;
                        }
                    }

                    &.vant-time {
                        height: auto;
                        margin-top: 0;
                    }
                }

            }
        }
    }

    .nav {

        margin-top: 10px;

        .tt {
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 18px;
            color: #E6D58D;
            line-height: 15px;
            padding-top: 70px;
            margin: 0 auto;
            text-align: center;
            position: relative;
            z-index: 1;
        }

        .rew-list-box {
            background: #092010;
            padding-bottom: 20px;
            // height: 820px;
            // overflow: auto;
            margin-top: 40px;

            &::before {
                content: "";
                position: absolute;
                width: 100%;
                height: 957px;
                @include bgImage('bg');
                top: 650px;

            }

            &.rew-list-box-none {
                padding-bottom: 120px;

                &::before {
                    top: 415px;
                }
            }

            .rew-list {
                .room-lv {
                    width: 279px;
                    height: 34.5px;
                    margin: 0 auto 0;
                    @include bgImage('icon-tt-bg');
                    font-size: 12px;
                    color: #ffffff;
                    line-height: 15px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;

                    p {
                        margin: 0 7px;

                        span {
                            color: #FFEF85;
                        }
                    }


                }

                .icon-tt {
                    width: 130px;
                    margin: 10px auto 0;
                    position: relative;
                }

                .list {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 10px;
                    margin-bottom: 30px;

                    .li {
                        width: 114px;
                        height: 151px;
                        margin: 0 3px;
                        @include bgImage('icon-gift');
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;

                        img {
                            max-width: 80px;
                            max-height: 80px;
                            margin-bottom: 20px;
                        }

                        p {
                            position: absolute;
                            font-size: 15px;
                            color: #4C3519;
                            line-height: 15px;
                            font-weight: bold;
                            bottom: 15px;
                        }
                    }
                }
            }
        }


    }

    .icon1 {
        width: 375px;
        margin: 0 auto 20px;
    }

    .icon-tt2 {
        width: 368px;
        height: 101px;
        margin: 10px auto;
    }

    .float {
        position: fixed;
        bottom: 0;
        background: #092010;
        padding-bottom: 30px;

        .icon3 {
            width: 375px;
            margin: 20px auto;
        }

        .tips {
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 12px;
            color: #E6D58D;
            line-height: 15px;
            margin: 0 auto;
            text-align: center;
            padding: 0 20px;
        }

        .btn {
            width: 180px;
            height: 50px;
            @include bgImage('icon2');
            font-family: Helvetica, Helvetica;
            font-weight: bold;
            font-size: 12px;
            color: #E6D58D;
            line-height: 15px;
            margin: 20px auto;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }


}

:deep(.van-popup--center) {
    background: none;
}

img {
    display: block;
}



:deep(.pop) {
    max-width: 375px;

    .title {
        position: relative;
        width: 153px;
        height: 35px;
        @include bgImage('icon-tt-bg2');
        font-family: Helvetica, Helvetica;
        font-weight: bold;
        font-size: 15px;
        color: #FFEF85;
        line-height: 15px;
        margin: 0 auto;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .popRule {
        width: 368px;
        height: 389px;
        margin: -20px auto 0;
        @include bgImage('pop1');
        padding: 35px 20px;

        .popRuleBox {
            // margin-top: 15px;
            height: 340px;
            font-size: 15px;
            color: #FFFFFF;
            line-height: 24px;
            box-sizing: border-box;
            overflow: auto;
        }
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
