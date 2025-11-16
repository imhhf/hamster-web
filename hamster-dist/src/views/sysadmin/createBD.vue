<template>
    <div class="createBD-page">
        <!-- 弹窗头部 -->
        <div class="popup-header">
            <h2 class="popup-title">Create BD</h2>
            <van-icon class="close-icon" @click="showBanInformation = false" />
        </div>

        <div class="nav">
            <p class="lable">Please check the user ID</p>
            <div class="inp-box f-s">
                <van-search class="van-search" v-model="searchId" placeholder="Search user ID" />
                <van-button class="action-btn Search f-c" @click="handleChangeName">
                    Search
                </van-button>
            </div>
            <p class="lable lable2">Please check the user ID</p>
            <!-- <input class="input" type="text"> -->
            <div class="reason-input-container">
                <textarea v-model="banReason" class="reason-input" placeholder="Please check the user ID" maxlength="30"
                    rows="3"></textarea>
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
            <van-button class="action-btn ban-btn" @click="handleBanUser" :disabled="!banReason.trim()">
                Ban the User
            </van-button>
        </div>

    </div>

</template>
<style lang="scss" src="./scss/createBD.scss" scoped></style>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";

const router = useRouter();

// 封禁用户弹窗
const showBanInformation = ref(false)
// 解封状态
const showUnBlock = ref(false)

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