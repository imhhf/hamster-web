
import { service } from "@/utils/request";

const prefix = "/bd/center/";
// const prefix2 = "/admin/center/";


// 首页
export function home(params) {
    return service({
        method: "get",
        url: `${prefix}home`,
        params,
    });
}

// 公会列表
export function AgencyData(params) {
    return service({
        method: "get",
        url: `${prefix}agencyData`,
        params,
    });
}

// 公会数据
export function AgencyList(params) {
    return service({
        method: "get",
        url: `${prefix}agencyList`,
        params,
    });
}



// 搜索用户
export function searchUser(params) {
    return service({
        method: "get",
        url: `${prefix}searchUser`,
        params,
    });
}

// 创建公会
export function CreateAgency(params) {
    return service({
        method: "post",
        url: `${prefix}createAgency`,
        params,
    });
}