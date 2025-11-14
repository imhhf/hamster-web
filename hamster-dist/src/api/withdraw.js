// anchor/withdraw/infoimport { service } from "@/utils/request";
import { service } from "@/utils/request";
const prefix = "/anchor/withdraw/";

// 获取ticket的辅助函数
function getTicket() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ticket');
}

// 提现初始化
export function WITHDRAW_INFO(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
      method: "get",
      url: `${prefix}info`,
      params,
    });
}

// 提现账号信息
export function WITHDRAW_ACCOUNT(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
      method: "get",
      url: `${prefix}account`,
      params,
    });
}

// 提现账号信息保存
export function WITHDRAW_ACCOUNT_SAVE(data) {
    // 如果参数中没有ticket，则添加ticket
    if (!data.ticket) {
        data.ticket = getTicket();
    }
    
    // 创建FormData对象
    const formData = new FormData();
    
    // 将数据添加到FormData中
    Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
            // 如果是数组，需要特殊处理
            data[key].forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
            });
        } else {
            formData.append(key, data[key]);
        }
    });
    
    // 调试：打印FormData内容
    console.log('WITHDRAW_ACCOUNT_SAVE FormData 内容:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    return service({
      method: "post",
      url: `${prefix}account/save`,
      data: formData,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    });
}

// 提现方式
export function WITHDRAW_WITHDRAW_TYPES(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
      method: "get",
      url: `${prefix}withdrawTypes`,
      params,
    });
}


// 代理列表
export function WITHDRAW_AGENCY_LIST(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
      method: "get",
      url: `${prefix}agent/list`,
      params,
    });
}

// 提现
export function WITHDRAW_LAUNCH(data) {
    // 如果参数中没有ticket，则添加ticket
    if (!data.ticket) {
        data.ticket = getTicket();
    }
    
    // 创建FormData对象
    const formData = new FormData();
    
    // 将数据添加到FormData中
    Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
            // 如果是数组，需要特殊处理
            data[key].forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
            });
        } else {
            formData.append(key, data[key]);
        }
    });
    
    // 调试：打印FormData内容
    console.log('WITHDRAW_LAUNCH FormData 内容:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    return service({
      method: "post",
      url: `${prefix}launch`,
      data: formData,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    });
}

// 提现订单
export function WITHDRAW_GET_ORDER(params) {
    // 如果参数中没有ticket，则添加ticket
    if (!params.ticket) {
        params.ticket = getTicket();
    }
    return service({
      method: "get",
      url: `${prefix}getOrder`,
      params,
    });
}

// 完成订单
export function WITHDRAW_ORDER_COMPLETE(data) {
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
    console.log('WITHDRAW_ORDER_COMPLETE FormData 内容:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    return service({
      method: "post",
      url: `${prefix}order/complete`,
      data: formData,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    });
}