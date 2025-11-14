import { service } from "@/utils/request";

const prefix = "h5doings/StarWeek/activity/";


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
