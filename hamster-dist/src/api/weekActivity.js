import { service } from "@/utils/request";

const prefix = "h5doings/StarWeek/activity/";
const prefix2 = "h5doings/StarWeek/activity/rank/";



export function GET_StarWeek(params) {
    return service({
        method: "get",
        url: `${prefix}rank`,
        params,
    });
}

export function GET_StarWeek_top(params) {
    return service({
        method: "get",
        url: `${prefix}top`,
        params,
    });
}

// 荣耀墙
export function GET_StarWeek_honorHall(params) {
    return service({
        method: "get",
        url: `${prefix}honorHall`,
        params,
    });
}

// 获取榜单奖励

export function GET_StarWeek_reward(params) {
    return service({
        method: "get",
        url: `${prefix2}reward`,
        params,
    });
}