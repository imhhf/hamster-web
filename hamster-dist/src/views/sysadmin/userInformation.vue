<template>
    <div class="information-page">
        <div class="top">
            <img class="back" src="../../assets/img/sysadmin/icon-back.png" alt="" @click="goBack">
            <p class="top-title">User Information</p>
        </div>

        <div class="search-section">
            <div class="search-container">
                <van-search class="van-search" @clear="clearApi" v-model="searchId" placeholder="Enter the user ID" />
                <button class="search-btn" @click="handleSearch">Search</button>
            </div>
        </div>
        <div class="user-list-container">
            <template v-if="userListData?.length > 0 && !isSearch">
                <div class="user-item" v-for="(user, index) in userListData" :key="user.id"
                    :class="{ 'active': selectedUserId === user.id }">
                    <div class="user-info-box f">
                        <img class="img" :src="user?.avatar" alt="">
                        <div class="user-info">
                            <div class="username f">
                                <van-notice-bar class="name" :text="user?.nick" :speed="20" />
                                <img class="ex" v-if="user?.gender === 1" src="../../assets/img/sysadmin/ixon-ex.png"
                                    alt="">
                                <img class="ex" v-else src="../../assets/img/sysadmin/ixon-ex.png" alt="">
                                <img class="count" :src="user?.countryNationalFlag" alt="">
                            </div>
                            <p class="user-id">ID:{{ user.erbanNo }}</p>
                        </div>
                    </div>
                    <div class="user-actions f-w">
                        <button class="edit-btn" @click="handleEdit(index)">Edit</button>
                        <button class="ban-btn" @click="handleBan(index)" :class="{ 'banned': user.isBanned }">
                            {{ user.isBanned ? 'Unban' : 'Ban' }}
                        </button>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="user-item">
                    <div class="user-info-box f">
                        <img class="img" :src="searchInfo?.avatar" alt="">

                        <div class="user-info">
                            <div class="username f">
                                <van-notice-bar class="name" :text="searchInfo?.nick" :speed="20" />
                                <img class="ex" v-if="searchInfo?.gender === 1"
                                    src="../../assets/img/sysadmin/ixon-ex.png" alt="">
                                <img class="ex" v-else src="../../assets/img/sysadmin/ixon-ex.png" alt="">
                                <img class="count" :src="searchInfo?.countryNationalFlag" alt="">
                            </div>
                            <p class="user-id">ID:{{ searchInfo?.erbanNo }}</p>
                        </div>
                    </div>

                    <div class="user-actions f-w">
                        <button class="edit-btn" @click="handleEdit(index)">Edit</button>
                        <button class="ban-btn" @click="handleBan(index)">
                            Ban
                        </button>
                    </div>
                </div>
            </template>
        </div>
        <!-- 没有数据 -->
        <div class="none-data" v-if="userListData?.length < 0 && !isSearch || searchInfo === null && isSearch">
            <img src="../../assets/img/sysadmin/none.png" alt="">
            <p>No Data</p>
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
                                <img :src="userInfoData?.avatar" alt="User Avatar" class="user-avatar">
                            </div>
                        </div>
                        <div class="user-details">
                            <h3 class="username">{{ userInfoData?.nick }}</h3>
                            <p class="user-id">ID:{{ userInfoData?.erbanNo }}</p>
                        </div>
                    </div>

                    <!-- 用户详细信息 -->
                    <div class="user-detail-info">
                        <div class="info-item">
                            <span class="info-label">Gender</span>
                            <span class="info-value">{{ userInfoData?.gender }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Country</span>
                            <span class="info-value">{{ userInfoData?.countryName }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Wealth</span>
                            <span class="info-value wealth">{{ userInfoData?.experLevelName }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Charm</span>
                            <span class="info-value charm">{{ userInfoData?.charmLevelName }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Agency</span>
                            <span class="info-value">{{ userInfoData?.agencyName }}</span>
                        </div>
                    </div>
                </div>


                <!-- 操作按钮区域 -->
                <div class="action-buttons">
                    <van-button class="action-btn change-avatar-btn f-c" @click="handleChangeUser(1)">
                        <img class="ex" src="../../assets/img/sysadmin/icon1.png" alt="">
                        Change avatar
                    </van-button>
                    <van-button class="action-btn change-name-btn f-c" @click="handleChangeUser(2)">
                        <img class="ex" src="../../assets/img/sysadmin/icon2.png" alt="">
                        Change name
                    </van-button>
                    <van-button class="action-btn change-bio-btn f-c" @click="handleChangeUser(3)">
                        <img class="ex" src="../../assets/img/sysadmin/icon3.png" alt="">
                        Change Bio
                    </van-button>
                </div>
            </div>
        </van-popup>

        <!-- 恢复默认头像弹窗 -->
        <van-popup v-model:show="showChangeAvatar" round class="showChangeAvatar">
            <p class="pop-tit">{{ headChangeIndex === 1 ? 'Change avatar' : headChangeIndex === 2 ? 'Change name' :
                'Change Bio'
                }}
            </p>
            <p class="tips">{{ headChangeIndex === 1 ? 'Change the user avatar to the default avatar.':headChangeIndex===2?'Change user name to default name':'Delete personalized signature' }}</p>
            <!-- 操作按钮区域 -->
            <div class="action-buttons f-c">
                <van-button class="action-btn Cancle f-c" @click="showChangeAvatar = false">
                    Cancle
                </van-button>
                <van-button class="action-btn Confirm f-c" @click="handleChange">
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
                                <img :src="userInfoData.avatar" alt="User Avatar" class="user-avatar">
                            </div>
                        </div>
                        <div class="user-details">
                            <h3 class="username">{{ userInfoData.nick }}</h3>
                            <p class="user-id">ID:{{ userInfoData.erbanNo
                            }}</p>
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
                    <van-button class="action-btn ban-btn" @click="!banReason.trim() ? '' : showBanUser = true"
                        :disabled="!banReason.trim()">
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
                <van-button class="action-btn Confirm f-c" @click="handleChangeBanUser">
                    Confirm
                </van-button>
            </div>
        </van-popup>
    </div>

</template>
<style lang="scss" src="./scss/userInformation.scss" scoped></style>
<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { searchUser, getUserList, getUserInfo, updateUserInfo, BanUser } from "@/api/sysadmin";

const router = useRouter();
const props = defineProps(["uid", "ticket", "memberUid"]);

// 封禁用户弹窗
const showBanUser = ref(false)

const userListData = ref()
// 用户列表
function userList() {
    getUserList({
        uid: props.uid,
        // searchKey: searchId.value,
        pageNum: 1,
        pageSize: 10
    })
        .then((data) => {
            userListData.value = data
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 用户信息
const userInfoData = ref()

function UserInfo(targetUid) {
    getUserInfo({
        uid: props.uid,
        targetUid: targetUid
    })
        .then((data) => {
            userInfoData.value = data;
        })
        .catch((err) => {
            //   loading.value = false;
            showToast(err.message);
        });
}

// 编辑用户
const changeIndex = ref(0)
const handleEdit = (ind) => {
    changeIndex.value = ind

    // showToast(`Edit user: ${user.username} (ID: ${user.id})`);
    // 这里可以打开编辑模态框或跳转到编辑页面
    showUserInfoPopup.value = true
    UserInfo(isSearch.value ? searchInfo.value.uid : userListData.value[ind].uid)

};

const updateUserInfoData = ref()
function getUpdateUserInfoData() {
    // 修改用户信息
    var page1 = {
        uid: props.uid,
        targetUid: userListData.value[changeIndex.value].uid,
        resetAvatar: true
    }
    var page2 = {
        uid: props.uid,
        targetUid: userListData.value[changeIndex.value].uid,
        resetNick: true
    }
    var page3 = {
        uid: props.uid,
        targetUid: userListData.value[changeIndex.value].uid,
        resetSignture: true
    }
    console.log('headChangeIndex.value==', headChangeIndex.value);
    updateUserInfo(headChangeIndex.value === 1 ? page1 : headChangeIndex.value === 2 ? page2 : page3)
        .then((data) => {
            updateUserInfoData.value = data;
            console.log('updateUserInfoData.value==', updateUserInfoData.value);
            showUserInfoPopup.value = false;
            showChangeAvatar.value = false
            userList()
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
    showChangeAvatar.value = true
}

const handleChange = () => {
    getUpdateUserInfoData()

}

// 返回上一页
const goBack = () => {
    router.back();
};


// 搜索的用户ID
const searchId = ref("");
// 当前选中的用户ID
const selectedUserId = ref("");

// 搜索用户
const searchInfo = ref()
function getSearchUser() {
    searchUser({
        uid: props.uid,
        erbanNo: searchId.value
    })
        .then((data) => {
            searchInfo.value = data
            console.log('data==', searchInfo.value);
        })
        .catch((err) => {
            showToast(err.message);
        });
}

// 搜索用户
const isSearch = ref(false)
const handleSearch = () => {
    if (!searchId.value.trim()) {
        showToast("Please enter user ID");
        return;
    }
    isSearch.value = true
    getSearchUser()
};

// 清空id
const clearApi = () => {
    isSearch.value = false
    userList()
}


// 封禁/解封用户
const handleBan = (user) => {
    // user.isBanned = !user.isBanned;
    // const action = user.isBanned ? "banned" : "unbanned";
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

// 封禁时间选项
const banTimeOptions = ref([
    { label: '1 day', value: 1 },
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: 'Forever', value: 0 }
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
    showBanUser.value = true
    // 关闭弹窗
    closePopup();

    // 触发封禁成功事件，供父组件监听
    emit('banSuccess', banData);
};

// 封禁用户
const banUserData = ref()
function handleChangeBanUser() {
    // 手动进行URL编码
    const encodedReason = encodeURIComponent(banReason.value);

    BanUser({
        uid: props.uid,
        targetUid: userListData.value[changeIndex.value].uid,
        timeType: selectedBanTime.value,
        desc: encodedReason  // 使用编码后的值
    })
        .then((data) => {
            banUserData.value = data;
            showToast('The user is banned and cannot be banned repeatedly;');
            showBanUser.value = false;
            showBanPopup.value = false;
            userList();
        })
        .catch((err) => {
            showToast(err.message);
        });
}

//确定封禁


// 定义事件
const emit = defineEmits(['banSuccess']);

// 暴露方法给父组件
defineExpose({
    openPopup
});

onMounted(async () => {
    // 初始化代码
    // await UserInfo()
    await userList()
});
</script>