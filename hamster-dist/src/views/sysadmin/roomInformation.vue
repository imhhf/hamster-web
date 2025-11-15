<template>
    <div class="information-page">
        <div class="top">
            <img class="back" src="../../assets/img/sysadmin/icon-back.png" alt="" @click="goBack">
            <p class="top-title">Room information</p>
        </div>

        <div class="search-section">
            <div class="search-container">
                <van-search class="van-search" v-model="searchId" placeholder="Enter the user ID" />
                <button class="search-btn" @click="handleSearch">Search</button>
            </div>
        </div>

        <div class="user-list-container">
            <div class="user-item" v-for="(user, index) in userList" :key="user.id"
                :class="{ 'active': selectedUserId === user.id }">
                <div class="user-info-box f">
                    <img class="img" src="../../assets/img/sysadmin/icon-back.png" alt="">

                    <div class="user-info">
                        <div class="username f">
                            <div class="name">name</div>
                            <img class="ex" src="../../assets/img/sysadmin/ixon-ex.png" alt="">
                            <img class="count" src="../../assets/img/sysadmin/icon-back.png" alt="">
                        </div>
                        <p class="user-id">ID:{{ user.id }}</p>
                    </div>
                </div>

                <div class="user-actions">
                    <!-- <p class="banned Unblocked">Banned</p> -->
                    <div class="view f" @click="showBanInformation = true">
                        View<img class="ex" src="../../assets/img/sysadmin/icon-right.png" alt="">
                    </div>
                </div>
            </div>
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
                                <img :src="userInfo.avatar" alt="User Avatar" class="user-avatar">
                            </div>
                        </div>
                        <div class="user-details">
                            <h3 class="username">{{ userInfo.username }}</h3>
                            <p class="user-id">ID:{{ userInfo.id }}</p>
                        </div>
                    </div>

                    <div class="cell f-s">
                        <div class="left">Owner</div>
                        <div class="right">Username</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">Country</div>
                        <div class="right">USA</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">Agency</div>
                        <div class="right">Agency name</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">Administrator</div>
                        <div class="right">155</div>
                    </div>
                    <div class="cell f-s">
                        <div class="left">Member</div>
                        <div class="right">10</div>
                    </div>
                </div>

                <!-- 操作按钮区域 -->
                <div class="action-buttons">
                    <van-button class="action-btn change-avatar-btn f-c" @click="handleChangeAvatar">
                        <img class="ex" src="../../assets/img/sysadmin/icon1.png" alt="">
                        Change avatar
                    </van-button>
                    <van-button class="action-btn change-name-btn f-c" @click="handleChangeName">
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
                <van-button class="action-btn Confirm f-c" @click="handleChangeName">
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

const router = useRouter();

// 封禁用户弹窗
const showBanInformation = ref(false)
// 解封状态
const showUnBlock = ref(true)

// 搜索的用户ID
const searchId = ref("");
// 当前选中的用户ID
const selectedUserId = ref("");

// 用户列表数据
const userList = ref([
    { id: "12415", username: "Username", isBanned: false },
    { id: "12416", username: "Username", isBanned: true },
    { id: "12417", username: "Username", isBanned: false },
    { id: "12418", username: "Username", isBanned: false },
    { id: "12419", username: "Username", isBanned: true }
]);

// 返回上一页
const goBack = () => {
    router.back();
};

// 搜索用户
const handleSearch = () => {
    if (!searchId.value.trim()) {
        showToast("Please enter user ID");
        return;
    }

    // 模拟搜索逻辑
    const foundUser = userList.value.find(user => user.id === searchId.value);
    if (foundUser) {
        userList.value = [foundUser];
        selectedUserId.value = foundUser.id;
        showToast("User found");
    } else {
        showToast("User not found");
        // 重置用户列表
        resetUserList();
    }
};

// 重置用户列表
const resetUserList = () => {
    userList.value = [
        { id: "12415", username: "Username", isBanned: false },
        { id: "12416", username: "Username", isBanned: true },
        { id: "12417", username: "Username", isBanned: false },
        { id: "12418", username: "Username", isBanned: false },
        { id: "12419", username: "Username", isBanned: true }
    ];
    selectedUserId.value = "";
};

// 用户信息数据
const userInfo = reactive({
    id: '12415',
    username: 'Username',
    avatar: ('../../assets/img/sysadmin/icon-back.png'), // 使用默认头像
    gender: 'Female',
    country: 'USA',
    wealth: 'LV.12',
    charm: 'LV.12',
    agency: 'Agency name'
});


// 封禁原因
const banReason = ref('');

onMounted(() => {
    // 初始化代码
});
</script>