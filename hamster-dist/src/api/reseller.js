import { service } from "@/utils/request";

const prefix = "";

// 获取ticket的辅助函数
function getTicket() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ticket');
}

// 代理主页 - 代理用户钱包
export function AGENCY_USER_PURSE(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
        method: "get",
        url: "/agency/user/purse",
        params,
    });
}

// 代充记录 - 获取代理账单
export function GET_AGENT_BILL(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
        method: "get",
        url: "/billRecord/getAgentBill",
        params,
    });
}

// 搜索用户
export function AGENCY_SEARCH_USER(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
        method: "get",
        url: "/agency/search/user",
        params,
    });
}

// 打款 - 代充
export function AGENCY_TRANSFER(data) {
    // 如果参数中没有ticket，则添加ticket
    if (!data.ticket) {
        data.ticket = getTicket();
    }
    
    // 创建FormData对象
    const formData = new FormData();
    
    // 将数据添加到FormData中
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    
    return service({
        method: "post",
        url: "/agency/transfer",
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// 代理列表
export function AGENCY_GET_USERS_LIST(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
        method: "get",
        url: "/agency/getUsersList",
        params,
    });
}

// 提现申请列表
export function AGENCY_GET_WITHDRAW_ORDER_LIST(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
        method: "get",
        url: "/agency/getWithdrawOrderList",
        params,
    });
}

// 提现审核
export function AGENCY_WITHDRAWAL_REVIEW(data) {
    // 如果参数中没有ticket，则添加ticket
    if (!data.ticket) {
        data.ticket = getTicket();
    }
    
    // 创建FormData对象
    const formData = new FormData();
    
    // 将数据添加到FormData中
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    
    // 调试：打印FormData内容
    console.log('FormData 内容:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    return service({
        method: "post",
        url: "/agency/withdrawalReview",
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
