import { service } from "@/utils/request";

const prefix = "h5doings/room/income/activity/";


export function GET_TAB_BEST_RoomInfo(params) {
    return service({
        method: "get",
        url: `${prefix}getUserInfo`,
        params,
    });
}

