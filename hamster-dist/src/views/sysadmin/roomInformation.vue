<template>
    <div class="information-page">
        <div class="top">
            <img class="back" src="../../assets/img/sysadmin/icon-back.png" alt="" @click="goBack">
            <p class="top-title">Room information</p>
        </div>

        <div class="search-section">
            <div class="search-container">
                <van-search class="van-search" @clear="clearApi" v-model="searchId" placeholder="Enter the room ID" />
                <button class="search-btn" @click="handleSearch">Search</button>
            </div>
        </div>

        <div class="user-list-container">
            <template v-if="roomList?.length > 0 && !isSearch">
                <div class="user-item" v-for="(user, index) in roomList" :key="user.id"
                    :class="{ 'active': selectedUserId === user.id }">
                    <div class="user-info-box f">
                        <img class="img" :src="user.avatar" alt="" />

                        <div class="user-info">
                            <div class="username f">
                                <div class="name">{{ user.title }}</div>
                                <img class="ex" v-if="user?.gender === 1" src="../../assets/img/sysadmin/ixon-ex.png"
                                    alt="" />
                                <img class="ex" v-else src="../../assets/img/sysadmin/ixon-ex.png" alt="" />
                                <img class="count" :src="user?.countryNationalFlag" alt="" />
                            </div>
                            <p class="user-id">ID:{{ user.roomNo }}</p>
                        </div>
                    </div>

                    <div class="user-actions">
                        <div class="view f" @click="popShowBanInformation(index)">
                            View<img class="ex" src="../../assets/img/sysadmin/icon-right.png" alt="" />
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="roomInfo&&roomInfo !== null && isSearch">
                <div class="user-item">
                    <div class="user-info-box f">
                        <img class="img" :src="roomInfo?.avatar" alt="" />

                        <div class="user-info">
                            <div class="username f">
                                <div class="name">{{ roomInfo?.title }}</div>
                                <img class="ex" v-if="roomInfo?.gender === 1"
                                    src="../../assets/img/sysadmin/ixon-ex.png" alt="" />
                                <img class="ex" v-else src="../../assets/img/sysadmin/ixon-ex.png" alt="" />
                                <img class="count" :src="roomInfo?.countryNationalFlag" alt="" />
                            </div>
                            <p class="user-id">ID:{{ roomInfo?.roomNo }}</p>
                        </div>
                    </div>
                    <div class="user-actions">
                        <div class="view f" @click="popShowBanInformation(index)">
                            View<img class="ex" src="../../assets/img/sysadmin/icon-right.png" alt="" />
                        </div>
                    </div>
                </div>
            </template>
        </div>
        
        <!-- 没有数据 -->
        <div class="none-data" v-if="
            (roomList===null && !isSearch) ||
            (!roomInfo&&roomInfo === null && isSearch)
        ">
            <img src="../../assets/img/sysadmin/none.png" alt="" />
            <p>No Data</p>
        </div>

        <!-- 用户信息弹窗 -->
        <van-popup v-model:show="showBanInformation" position="bottom" round class="showBanInformation">
            <div class="popup-container">
                <!-- 弹窗头部 -->
                <div class="popup-header">
                    <h2 class="popup-title">User information</h2>
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
                        <div class="left">Owner</div>
                        <div class="right">{{ roomInfo?.ownerNick }}</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">Country</div>
                        <div class="right">{{ roomInfo?.countryName }}</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">Agency</div>
                        <div class="right">{{ roomInfo?.agencyName }}</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">Administrator</div>
                        <div class="right">{{ roomInfo?.adminCount }}</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">Member</div>
                        <div class="right">{{ roomInfo?.memberCount }}</div>
                    </div>
                </div>

                <!-- 操作按钮区域 -->
                <div class="action-buttons">
                    <van-button class="action-btn change-avatar-btn f-c"  @click="handleChangeUser(1)">
                        <img class="ex" src="../../assets/img/sysadmin/icon1.png" alt="">
                        Change avatar
                    </van-button>
                    <van-button class="action-btn change-name-btn f-c"  @click="handleChangeUser(2)">
                        <img class="ex" src="../../assets/img/sysadmin/icon2.png" alt="">
                        Change name
                    </van-button>
                </div>
            </div>
        </van-popup>


        <!-- 解封弹窗 -->
        <van-popup v-model:show="showUnBlock" round class="showChangeAvatar">
            <p class="pop-tit">Change avatar</p>
            <p class="tips">Change the room avatar to the default avator.</p>
            <!-- 操作按钮区域 -->
            <div class="action-buttons f-c">
                <van-button class="action-btn Cancle f-c" @click="showUnBlock = false">
                    Cancle
                </van-button>
                <van-button class="action-btn Confirm f-c" @click="handleChange">
                    Confirm
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
        showToast("Please enter user ID");
        return;
    }
    isSearch.value = true;
    getRoomInfo();
};


// 清空id
const clearApi = () => {
    isSearch.value = false
    getRoomList()
}


// 返回上一页
const goBack = () => {
    router.back();
};

const roomList = ref();
// 房间列表
function getRoomList(targetUid) {
    GetRoomList({
        uid: props.uid,
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
        roomId: isSearch.value ? searchId.value : roomList.value[banIndex.value].roomId,
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
        roomId: isSearch.value ? searchId.value : roomList.value[banIndex.value].roomId,
        resetAvatar: true
    }
    var page2 = {
        uid: props.uid,
        roomId: isSearch.value ? searchId.value : roomList.value[banIndex.value].roomId,
        resetTitle: true
    }
    console.log('headChangeIndex.value==', headChangeIndex.value);
    UpdateRoomInfo(headChangeIndex.value === 1 ? page1: page2)
        .then((data) => {
            updateRoomInfoData.value = data;
            console.log('updateRoomInfoData.value==', updateRoomInfoData.value);
            showBanInformation.value = false;
            showUnBlock.value = false
            getRoomList()
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

// 封禁原因
const banReason = ref('');

onMounted(() => {
    // 初始化代码
    getRoomList()
});
</script>