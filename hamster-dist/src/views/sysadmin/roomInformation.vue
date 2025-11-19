<template>
    <div class="information-page">
        <div class="top">
            <img class="back" src="../../assets/img/sysadmin/icon-back.png" alt="" @click="goBack">
            <p class="top-title">{{ $t('sysadmin.Roo3') }}</p>
        </div>

        <div class="search-section">
            <div class="search-container">
                <van-search class="van-search" @clear="clearApi" v-model="searchId"
                    :placeholder="$t('sysadmin.Ent16')" />
                <button class="search-btn" @click="handleSearch">{{ $t('sysadmin.Sea') }}</button>
            </div>
        </div>

        <div class="user-list-container" v-if="roomList !== null && roomList?.length > 0">
            <div class="user-item" v-for="(user, index) in roomList" :key="user.id"
                :class="{ 'active': selectedUserId === user.id }">
                <div class="user-info-box f">
                    <img class="img" :src="user.avatar" alt="" />

                    <div class="user-info">
                        <div class="username f">
                            <div class="name">{{ user.title }}</div>
                            <img class="ex" v-if="user?.gender === 1" src="../../assets/img/sysadmin/ixon-ex.png"
                                alt="" />
                            <img class="ex" v-else src="../../assets/img/sysadmin/icon-g.png" alt="" />
                            <img class="count" :src="user?.countryNationalFlag" alt="" />
                        </div>
                        <p class="user-id">ID:{{ user.roomNo }}</p>
                    </div>
                </div>

                <div class="user-actions">
                    <div class="view f" @click="popShowBanInformation(index)">
                        {{ $t('sysadmin.View') }}<img class="ex" src="../../assets/img/sysadmin/icon-right.png"
                            alt="" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 没有数据 -->
        <div class="none-data" v-if="roomList === null">
            <img src="../../assets/img/sysadmin/none.png" alt="" />
            <p>{{ $t('sysadmin.no') }}</p>
        </div>

        <!-- 用户信息弹窗 -->
        <van-popup v-model:show="showBanInformation" position="bottom" round class="showBanInformation">
            <div class="popup-container">
                <!-- 弹窗头部 -->
                <div class="popup-header">
                    <h2 class="popup-title">{{ $t('sysadmin.Roo3') }}</h2>
                    <van-icon class="close-icon" @click="showBanInformation = false" />
                </div>
                <div class="ban-box">
                    <!-- 用户基本信息 -->
                    <div class="user-basic-info">
                        <div class="avatar-section">
                            <div class="avatar-container">
                                <img :src="roomInfo?.avatar" alt="User Avatar" class="user-avatar">
                            </div>
                        </div>
                        <div class="user-details">
                            <h3 class="username">{{ roomInfo?.title }}</h3>
                            <p class="user-id">ID:{{ roomInfo?.roomNo }}</p>
                        </div>
                    </div>

                    <div class="cell f-s">
                        <div class="left">{{ $t('sysadmin.Owner') }}</div>
                        <div class="right">{{ roomInfo?.ownerNick }}</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">{{ $t('sysadmin.Cou') }}</div>
                        <div class="right">{{ roomInfo?.countryName }}</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">{{ $t('sysadmin.Age') }}</div>
                        <div class="right">{{ roomInfo?.agencyName }}</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">{{ $t('sysadmin.Adm17') }}</div>
                        <div class="right">{{ roomInfo?.adminCount }}</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">{{ $t('sysadmin.Mem') }}</div>
                        <div class="right">{{ roomInfo?.memberCount }}</div>
                    </div>
                </div>

                <!-- 操作按钮区域 -->
                <div class="action-buttons">
                    <van-button class="action-btn change-avatar-btn f-c" @click="handleChangeUser(1)">
                        <img class="ex" src="../../assets/img/sysadmin/icon1.png" alt="">
                        {{ $t('sysadmin.Cha') }}
                    </van-button>
                    <van-button class="action-btn change-name-btn f-c" @click="handleChangeUser(2)">
                        <img class="ex" src="../../assets/img/sysadmin/icon2.png" alt="">
                        {{ $t('sysadmin.Cha4') }}
                    </van-button>
                </div>
            </div>
        </van-popup>


        <!-- 解封弹窗 -->
        <van-popup v-model:show="showUnBlock" round class="showChangeAvatar">
            <p class="pop-tit"> {{ headChangeIndex === 1 ? $t('sysadmin.Cha') : $t('sysadmin.Cha4') }}
            </p>
            <p class="tips">{{ headChangeIndex === 1 ? $('sysadmin.Cha18') : $('sysadmin.Cha19') }}</p>
            <!-- 操作按钮区域 -->
            <div class="action-buttons f-c">
                <van-button class="action-btn Cancle f-c" @click="showUnBlock = false">
                    {{ $t('sysadmin.Can') }}
                </van-button>
                <van-button class="action-btn Confirm f-c" @click="handleChange">
                    {{ $t('sysadmin.Con') }}
                </van-button>
            </div>
        </van-popup>
    </div>

</template>
<style lang="scss" src="./scss/roomInformation.scss" scoped></style>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { GetRoomList, GetRoomInfo, searchUser, UpdateRoomInfo } from "@/api/sysadmin";
import i18n from '@/i18n/index.js';
const { t } = i18n.global;
const router = useRouter();
const props = defineProps(["uid", "ticket", "memberUid"]);

// 封禁用户弹窗
const showBanInformation = ref(false)
// 解封状态
const showUnBlock = ref(false)

// 搜索的用户ID
const searchId = ref("");
// 当前选中的用户ID
const selectedUserId = ref("");

// 搜索用户
const isSearch = ref(false);
const handleSearch = () => {
    if (!searchId.value.trim()) {
        showToast(t('sysadmin.plea'));

        return;
    }
    isSearch.value = true;
    getRoomList(searchId.value);
};


// 清空id
const clearApi = () => {
    isSearch.value = false
    getRoomList(null)
}


// 返回上一页
const goBack = () => {
    router.back();
};

const roomList = ref();
// 房间列表
function getRoomList(searchKey) {
    GetRoomList({
        uid: props.uid,
        searchKey: searchKey,
        pageNum: 1,
        pageSize: 50,
    })
        .then((data) => {
            roomList.value = data;
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 房间详情
const roomInfo = ref();
function getRoomInfo(targetUid) {
    GetRoomInfo({
        uid: props.uid,
        roomId: roomList.value[banIndex.value].roomId,
    })
        .then((data) => {
            roomInfo.value = data;
        })
        .catch((err) => {
            //   loading.value = false;
            showToast(err.message);
        });
}

const banIndex = ref();
const popShowBanInformation = (ind) => {
    banIndex.value = ind;
    showBanInformation.value = true;
    getRoomInfo();
};


// 修改房间信息
const updateRoomInfoData = ref()
function getUpdateRoomInfo() {
    // 修改用户信息
    var page1 = {
        uid: props.uid,
        roomId: roomList.value[banIndex.value].roomId,
        resetAvatar: true
    }
    var page2 = {
        uid: props.uid,
        roomId: roomList.value[banIndex.value].roomId,
        resetTitle: true
    }
    console.log('headChangeIndex.value==', headChangeIndex.value);
    UpdateRoomInfo(headChangeIndex.value === 1 ? page1 : page2)
        .then((data) => {
            updateRoomInfoData.value = data;
            console.log('updateRoomInfoData.value==', updateRoomInfoData.value);
            showBanInformation.value = false;
            showUnBlock.value = false
            getRoomList(null)
        })
        .catch((err) => {
            //   loading.value = false;
            //   showToast(err.message);
        });
}

// 点击修改用户信息
const headChangeIndex = ref(0)
function handleChangeUser(ind) {
    headChangeIndex.value = ind
    showUnBlock.value = true
}

const handleChange = () => {
    getUpdateRoomInfo()

}

onMounted(() => {
    // 初始化代码
    getRoomList(null)
});
</script>