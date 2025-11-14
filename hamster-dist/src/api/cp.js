import { service } from "@/utils/request";

const prefix = "h5doings/cp/activity/";

// 获取全服CP等级最高的3对CP
export function GET_TAB_BEST_CP(params) {
  return service({
    method: "get",
    url: `${prefix}getTabBestCP`,
    params,
  });
}

// 获取周排行榜
export function GET_WEEK_RANK(params) {
  return service({
    method: "get",
    url: `${prefix}getWeekRank`,
    params,
  });
}

// 获取荣耀殿堂
export function GET_HONOR_HALL(params) {
  return service({
    method: "get",
    url: `${prefix}getHonorHall`,
    params,
  });
}
