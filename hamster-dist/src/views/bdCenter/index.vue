<template>
    <div class="index">
        <div class="top">
            <img @click="AppClose()" class="back" src="../../assets/img/bdCenter/icon-back.png" alt="">
            <p class="top-title">{{ $t('sysadmin.bdcen') }}</p>
        </div>
        <div class="user f">
            <div class="left">
                <van-image class="user-img" style="border-radius: 50%" :key="picIdx" :src="info?.avatar" />
            </div>
            <div class="right">
                <p>{{ info?.nick }}</p>
                <div class="box f">
                    <van-image v-if="info?.vipLevelIcon" :key="picIdx" :src="info?.vipLevelIcon" />
                    <van-image v-if="info?.experLevelIcon" :key="picIdx" :src="info?.experLevelIcon" />
                    <van-image v-if="info?.charmLevelIcon" :key="picIdx" :src="info?.charmLevelIcon" />

                </div>
            </div>
        </div>

        <div class="page-list">
            <div class="li f-s" @click="clickAgnData(null, 1)">
                <div class="left f">
                    <img src="@/assets/img/sysadmin/icon-banList.png" alt="">
                    <span>{{ $t('sysadmin.crea') }}</span>
                </div>
                <img class="go" src="@/assets/img/sysadmin/icon-right.png" alt="">
            </div>
        </div>

        <!-- 选择时间 -->
        <div class="select f-s">
            <p class="title">{{ $t('sysadmin.agen') }}</p>
            <select class="native-month-dropdown" v-model="selectedMonth" @change="handleMonthChange">
                <option v-for="option in monthOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div class="data">
            <div class="cell f-s">
                <div class="left">{{ $t('sysadmin.Tot') }}</div>
                <div class="right">{{ info?.totalAgencyCount }}</div>
            </div>
            <div class="cell f-s">
                <div class="left">{{ $t('sysadmin.New') }}</div>
                <div class="right">{{ info?.newAgencyCount }}</div>
            </div>
            <div class="cell f-s">
                <div class="left">{{ $t('sysadmin.Age23') }}</div>
                <div class="right right2 f-c">
                    <img src="@/assets/img/sysadmin/icon-coins.png" alt="">
                    <span>{{ info?.agencyIncome }}</span>
                </div>
            </div>
        </div>

        <div class="lable">{{ $t('sysadmin.agenl') }}</div>

        <!-- 添加下拉刷新和上拉加载 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="none data" @load="onLoad"
                :immediate-check="false">
                <div class="ang-list">
                    <div class="li f-s" @click="clickAgnData(item.guildId, 2)" v-for="(item, index) in agencyInfo"
                        :key="index">
                        <div class="left f">
                            <img :src="item.coverPicUrl" alt="">
                            <div class="li-user">
                                <van-notice-bar class="name" :text="item.guildName" :speed="20" />
                                <div class="id">ID: {{ item.guildNo }}</div>
                            </div>
                        </div>
                        <div class="right f-c">
                            <img src="@/assets/img/sysadmin/icon-coins.png" alt="">
                            {{ item.income }}
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>

        <!-- 加载状态提示 -->
        <div v-if="loading && agencyInfo.length > 0" class="loading-text">
            加载中...
        </div>

        <van-popup v-model:show="showCreateBD" position="bottom" round class="showCreateBD">
            <createBD :clickCreate="clickCreate" :ticket=" props.ticket" :guildId="currentGuildId" :selectedMonth="currentSelectedMonth"
                :isUid="props.uid" @success="handleCreateBDSuccess" @close="handleCreateBDClose">
            </createBD>
        </van-popup>
    </div>
</template>

<style lang="scss" src="./scss/index.scss" scoped></style>
<style lang="scss" scoped>
.loading-text {
    text-align: center;
    padding: 16px;
    color: #999;
    font-size: 14px;
}

// 确保列表容器有足够的高度用于滚动
.ang-list {
    min-height: 200px;
}
</style>

<script setup>
import { ref, onMounted, watch } from "vue";
import { showToast } from "vant";
import { home, AgencyList } from "@/api/bdCenter";
import createBD from './createBD.vue'
import { AppClose } from "@/utils/client";

// 接收参数
const props = defineProps(["uid", "ticket", "memberUid"]);

// 分页相关变量
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const pageNum = ref(1);
const pageSize = ref(20); // 每页20条数据
const total = ref(0);

// create BD 
const showCreateBD = ref(false)
// 处理创建BD成功
const handleCreateBDSuccess = (data) => {
    console.log("Create BD success:", data);
    // 关闭弹窗
    showCreateBD.value = false;
    getHome()
    // 重新加载第一页数据
    resetList();
};

// 处理关闭弹窗
const handleCreateBDClose = () => {
    showCreateBD.value = false;
};

// bg数据
const bdData = ref({});
// 月份相关数据
const selectedMonth = ref("");
const monthOptions = ref([]);

// 创建响应式变量来存储当前选中的公会ID和月份
const currentGuildId = ref(null);
const currentSelectedMonth = ref("");

// 初始化近6个月下拉选项
function initMonthOptions() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const options = [];

    // 生成近6个月（包含当前月）
    for (let i = 0; i < 6; i++) {
        let year = currentYear;
        let month = currentMonth - i;

        // 跨年处理
        if (month < 1) {
            year--;
            month += 12;
        }

        // 格式化为 YYYYMM（纯数字，月份补零）
        const monthValue = parseInt(`${year}${String(month).padStart(2, "0")}`);
        // 显示格式保持 YYYY/MM 以便用户阅读
        const displayLabel = `${year}/${String(month).padStart(2, "0")}`;

        options.push({ label: displayLabel, value: monthValue });
    }

    monthOptions.value = options;
    selectedMonth.value = options[0].value; // 默认当前月
    currentSelectedMonth.value = options[0].value; // 同步当前选中月份
}

// 原生下拉框change事件
function handleMonthChange() {
    currentSelectedMonth.value = selectedMonth.value; // 更新当前选中月份
    // 月份切换时重置列表
    resetList();
    getHome(); // 刷新首页数据
}

// 重置列表数据
function resetList() {
    pageNum.value = 1;
    agencyInfo.value = [];
    finished.value = false;
    loading.value = true;
    // 手动触发加载
    onLoad();
}

// 下拉刷新
const onRefresh = () => {
    // 清空列表数据
    agencyInfo.value = [];
    finished.value = false;
    loading.value = true;
    pageNum.value = 1;

    // 重新加载数据
    onLoad().finally(() => {
        refreshing.value = false;
    });
};

// 上拉加载更多
const onLoad = () => {
    return new Promise((resolve) => {
        if (refreshing.value) {
            agencyInfo.value = [];
            refreshing.value = false;
        }

        getAgencyList().finally(() => {
            loading.value = false;
            resolve();
        });
    });
};

// 点击工会查看数据
const isGuildId = ref()
const clickCreate = ref(0)
const clickAgnData = (guildId, ind) => {
    isGuildId.value = guildId
    clickCreate.value = ind

    // 更新当前选中的值
    currentGuildId.value = guildId;
    currentSelectedMonth.value = selectedMonth.value;

    console.log('点击公会数据:', { guildId, selectedMonth: selectedMonth.value });

    showCreateBD.value = true
}

// 公会列表
const agencyInfo = ref([])
function getAgencyList() {
    return new Promise((resolve, reject) => {
        AgencyList({
            uid: props.uid,
            timeMonth: selectedMonth.value,
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            ticket: props.ticket
        })
            .then((data) => {
                if (data && data.length > 0) {
                    // 如果是第一页，直接赋值
                    if (pageNum.value === 1) {
                        agencyInfo.value = data;
                    } else {
                        // 追加数据
                        agencyInfo.value = [...agencyInfo.value, ...data];
                    }

                    // 检查是否还有更多数据
                    if (data.length < pageSize.value) {
                        finished.value = true;
                    } else {
                        pageNum.value++;
                    }
                } else {
                    // 没有数据
                    if (pageNum.value === 1) {
                        agencyInfo.value = [];
                    }
                    finished.value = true;
                }

                console.log(`第${pageNum.value}页公会列表数据:`, data, '总数据量:', agencyInfo.value.length);
                resolve();
            })
            .catch((err) => {
                showToast(err.message);
                finished.value = true;
                reject(err);
            });
    });
}

// 首页
const info = ref()
function getHome() {
    home({
        uid: props.uid,
        timeMonth: selectedMonth.value,
        ticket: props.ticket
    })
        .then((data) => {
            info.value = data
            console.log('首页数据:', data);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

onMounted(async () => {
    await initMonthOptions(); // 初始化月份下拉框
    await getHome(); // 获取首页数据
    // 初始化加载第一页数据
    loading.value = true;
    await onLoad();
});
</script>