import { service } from "@/utils/request";

const prefix = "h5doings/charge/activity/";

// 排行榜
export function CHARGE_RANK(params) {
    return service({
        method: "get",
        url: `${prefix}getRank`,
        params,
    });
}

// 荣耀殿堂
export function HONOR_HALL(params) {
    return service({
        method: "get",
        url: `${prefix}getHonorHall`,
        params,
    });
}

// 任务配置
export function MISSION_CONF(params) {
    return service({
        method: "get",
        url: `${prefix}getMissionConf`,
        params,
    });
}
