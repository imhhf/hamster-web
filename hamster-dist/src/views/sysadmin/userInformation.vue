<template>
    <div class="information-page">
        <div class="top">
            <img class="back" src="../../assets/img/sysadmin/icon-back.png" alt="" @click="goBack">
            <p class="top-title">User Information</p>
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

                <div class="user-actions f-w">
                    <button class="edit-btn" @click="handleEdit(user)">Edit</button>
                    <button class="ban-btn" @click="handleBan(user)" :class="{ 'banned': user.isBanned }">
                        {{ user.isBanned ? 'Unban' : 'Ban' }}
                    </button>
                </div>
            </div>
        </div>
        <!-- 用户信息弹窗 -->
        <van-popup v-model:show="showUserInfoPopup" position="bottom" round class="user-info-popup">
            <div class="popup-container">
                <!-- 弹窗头部 -->
                <div class="popup-header">
                    <h2 class="popup-title">User information</h2>
                    <van-icon class="close-icon" @click="closePopup" />
                </div>

                <div class="user-box">
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

                    <!-- 用户详细信息 -->
                    <div class="user-detail-info">
                        <div class="info-item">
                            <span class="info-label">Gender</span>
                            <span class="info-value">{{ userInfo.gender }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Country</span>
                            <span class="info-value">{{ userInfo.country }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Wealth</span>
                            <span class="info-value wealth">{{ userInfo.wealth }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Charm</span>
                            <span class="info-value charm">{{ userInfo.charm }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Agency</span>
                            <span class="info-value">{{ userInfo.agency }}</span>
                        </div>
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
                    <van-button class="action-btn change-bio-btn f-c" @click="handleChangeBio">
                        <img class="ex" src="../../assets/img/sysadmin/icon3.png" alt="">
                        Change Bio
                    </van-button>
                </div>
            </div>
        </van-popup>

        <!-- 恢复默认头像弹窗 -->
        <van-popup v-model:show="showChangeAvatar" round class="showChangeAvatar">
            <p class="pop-tit">Change avatar</p>
            <p class="tips">Change the user avatar to the default avatar.</p>
            <!-- 操作按钮区域 -->
            <div class="action-buttons f-c">
                <van-button class="action-btn Cancle f-c" @click="showChangeAvatar = false">
                    Cancle
                </van-button>
                <van-button class="action-btn Confirm f-c" @click="handleChangeName">
                    Confirm
                </van-button>
            </div>
        </van-popup>

        <!-- 用户封禁弹窗 -->
        <van-popup v-model:show="showBanPopup" position="bottom" round class="ban-user-popup">
            <div class="popup-container">
                <!-- 弹窗头部 -->
                <div class="popup-header">
                    <h2 class="popup-title">User information</h2>
                    <van-icon class="close-icon" @click="showBanPopup = false" />
                </div>

                <div class="user-box">
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

                    <!-- 封禁时间选择 -->
                    <div class="ban-time-section">
                        <h3 class="section-title">Ban time</h3>
                        <div :class="showTimeDropdown ? 'section-box' : ''">
                            <div class="time-selector" :class="!showTimeDropdown ? 'selector-act' : ''"
                                @click="toggleTimeDropdown">
                                <div class="selected-time">
                                    {{ selectedBanTimeLabel }}
                                </div>
                                <van-icon name="arrow-down" class="dropdown-icon"
                                    :class="{ 'rotate': showTimeDropdown }" />
                            </div>

                            <!-- 时间下拉选项 -->
                            <div class="time-dropdown" v-show="showTimeDropdown">
                                <div v-for="time in banTimeOptions" :key="time.value" class="time-option"
                                    @click="selectBanTime(time.value)">
                                    {{ time.label }}
                                    <img class="icon-yes" v-if="selectedBanTime === time.value"
                                        src="../../assets/img/sysadmin/icon-yes.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 封禁原因输入 -->
                    <div class="ban-reason-section">
                        <h3 class="section-title">Reason for ban</h3>
                        <div class="reason-input-container">
                            <textarea v-model="banReason" class="reason-input"
                                placeholder="Please enter the reason for the ban" maxlength="30" rows="3"></textarea>
                            <div class="char-count">{{ banReason.length }}/30</div>
                        </div>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <van-button class="action-btn ban-btn" @click="handleBanUser" :disabled="!banReason.trim()">
                        Ban the User
                    </van-button>
                </div>
            </div>
        </van-popup>


        <!-- 封禁用户弹窗 -->
        <van-popup v-model:show="showBanUser" round class="showChangeAvatar">
            <p class="pop-tit">Ban the User</p>
            <p class="tips">Are you sure you want to ban this user?</p>
            <!-- 操作按钮区域 -->
            <div class="action-buttons f-c">
                <van-button class="action-btn Cancle f-c" @click="showBanUser = false">
                    Cancle
                </van-button>
                <van-button class="action-btn Confirm f-c" @click="handleChangeName">
                    Confirm
                </van-button>
            </div>
        </van-popup>
    </div>

</template>
<style lang="scss" src="./scss/userInformation.scss" scoped></style>

<!-- <style lang="scss" scoped>
.information-page {
    min-width: 100vw;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.top {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: white;

    .back {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .top-title {
        flex: 1;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin: 0;
    }
}

.search-section {
    padding: 16px;
    margin-bottom: 1px;
    margin-top: -80px;

    .search-container {
        display: flex;
        border-radius: 4px;
        overflow: hidden;
        padding: 0;

        :deep(.van-search__content) {
            padding: 0;
        }

        :deep(.van-cell) {
            width: 257px;
            height: 41px;
            background: #FFFFFF;
            border-radius: 21px;
            padding: 0 15px;
            box-sizing: border-box;
        }

        .van-search {
            border: none;
            padding: 0;
            font-size: 14px;
            outline: none;

            &::placeholder {
                color: #000000;
            }
        }

        .search-btn {
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #000000;
            line-height: 20px;
            border: none;
            background: none;
            margin: 0 10px;
            cursor: pointer;
        }
    }
}

.user-list-container {
    .user-item {
        width: 355px;
        height: 82px;
        background: #FFFFFF;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto 10px;
        box-sizing: border-box;
        padding: 0 16px;
        transition: all 0.3s ease;

        &.active {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            height: auto;
            min-height: 82px;
            padding: 16px;
        }

        .img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .user-info {
            margin: 0 10px;
            flex: 1;

            .username {
                font-size: 16px;
                margin: 0 0 4px 0;
                font-weight: 500;
                align-items: center;

                .ex {
                    width: 14px;
                    height: 14px;
                    margin: 0 6px;
                }

                .count {
                    width: 21px;
                    height: 21px;
                }
            }

            .user-id {
                font-size: 14px;
                color: #666;
                margin: 0;
            }
        }

        .user-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 60px;
            margin-left: 10px;

            button {
                font-family: Helvetica, Helvetica;
                font-weight: bold;
                font-size: 11px;
                color: #FFFFFF;
                border: none;
                width: 60px;
                height: 26px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .edit-btn {
                background: #4a7cff;

                &:hover {
                    background: #3a6ce0;
                }
            }

            .ban-btn {
                background: #ff4d4f;

                &:hover {
                    background: #e04345;
                }

                &.banned {
                    background: #52c41a;

                    &:hover {
                        background: #46a818;
                    }
                }
            }
        }
    }
}
</style> -->

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";

const router = useRouter();

// 封禁用户弹窗
const showBanUser = ref(false)

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

// 编辑用户
const handleEdit = (user) => {
    // showToast(`Edit user: ${user.username} (ID: ${user.id})`);
    // 这里可以打开编辑模态框或跳转到编辑页面
    showUserInfoPopup.value = true
};

// 封禁/解封用户
const handleBan = (user) => {
    user.isBanned = !user.isBanned;
    const action = user.isBanned ? "banned" : "unbanned";
    showBanPopup.value = true
    // showToast(`User ${user.username} ${action}`);
    // 这里应该调用API更新用户状态
};

// 点击用户项切换选中状态
const toggleUserSelection = (user) => {
    if (selectedUserId.value === user.id) {
        selectedUserId.value = "";
    } else {
        selectedUserId.value = user.id;
    }
};

// 弹窗显示控制
const showUserInfoPopup = ref(false);

const showChangeAvatar = ref(false);
const showUserInfoBanPopup = ref(true);

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

// 打开弹窗的方法（可以从父组件调用）
const openPopup = () => {
    showUserInfoPopup.value = true;
};

// 关闭弹窗
const closePopup = () => {
    showUserInfoPopup.value = false;
    showUserInfoBanPopup.value = false
};
// 弹窗显示控制
const showBanPopup = ref(false);
// 时间下拉框显示控制
const showTimeDropdown = ref(false);

// 用户信息数据
// const userInfo = reactive({
//     id: '12415',
//     username: 'Username',
//     avatar: require('../../assets/img/sysadmin/icon-back.png'), // 使用默认头像
// });

// 封禁时间选项
const banTimeOptions = ref([
    { label: '1 day', value: 1 },
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: 'Forever', value: -1 }
]);

// 选中的封禁时间
const selectedBanTime = ref(1);

// 计算选中的封禁时间标签
const selectedBanTimeLabel = computed(() => {
    const option = banTimeOptions.value.find(opt => opt.value === selectedBanTime.value);
    return option ? option.label : '1 day';
});

// 封禁原因
const banReason = ref('');

// 切换时间下拉框
const toggleTimeDropdown = () => {
    showTimeDropdown.value = !showTimeDropdown.value;
};

// 选择封禁时间
const selectBanTime = (timeValue) => {
    selectedBanTime.value = timeValue;
    showTimeDropdown.value = false;
};

// 处理封禁用户
const handleBanUser = () => {

    if (!banReason.value.trim()) {
        showToast('Please enter ban reason');
        return;
    }

    const banData = {
        userId: userInfo.id,
        username: userInfo.username,
        banTime: selectedBanTime.value,
        banReason: banReason.value,
        banTimeLabel: selectedBanTimeLabel.value
    };

    // 这里可以调用API执行封禁操作
    console.log('Ban user data:', banData);

    showToast(`User ${userInfo.username} has been banned for ${banData.banTimeLabel}`);

    // 关闭弹窗
    closePopup();

    // 触发封禁成功事件，供父组件监听
    emit('banSuccess', banData);
};

// 定义事件
const emit = defineEmits(['banSuccess']);

// 暴露方法给父组件
defineExpose({
    openPopup
});

onMounted(() => {
    // 初始化代码
});
</script>