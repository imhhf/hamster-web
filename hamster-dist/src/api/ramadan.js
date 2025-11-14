import { service } from "@/utils/request";

const prefix = "h5doings/ramadan/activity/";

// 用户榜
export function GET_UserRank(params) {
    return service({
        method: "get",
        url: `${prefix}userRank`,
        params,
    });
}

// 房间榜
export function GET_RoomRank(params) {
    return service({
        method: "get",
        url: `${prefix}roomRank`,
        params,
    });
}

// 挑战任务
export function GET_ChallengeTask(params) {
    return service({
        method: "get",
        url: `${prefix}challengeTask`,
        params,
    });
}

// 打卡任务
export function GET_CheckTask(params) {
    return service({
        method: "get",
        url: `${prefix}checkTask`,
        params,
    });
}

// 挑战任务领取
export function GET_ChallengeRecive(params) {
    return service({
        method: "post",
        url: `${prefix}challengeRecive`,
        params,
    });
}

// 打卡任务领取
export function GET_ChargeRecive(params) {
    return service({
        method: "post",
        url: `${prefix}chargeRecive`,
        params,
    });
}
