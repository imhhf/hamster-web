import { service } from "@/utils/request";

const prefix = "h5doings/charge/activity/";

// 搜索用户
export function SEARCH_USER(params) {
  return service({
    method: "get",
    url: `/user/search/user`,
    params,
  });
}

// 充值列表
export function CHARGE_PROD_LIST(params) {
  return service({
    method: "get",
    url: `/chargeProd/list/h5/v2`,
    params,
  });
}

// // 链接充值列表
// export function CHARGE_PROD_LINK_LIST(params) {
//   return service({
//     method: "get",
//     url: `/chargeProd/link/list/h5`,
//     params,
//   });
// }

// 国家定位
export function LOCATION_COUNTRY(params) {
  return service({
    method: "get",
    url: `/chargeProd/get/location/country`,
    params,
  });
}

// 国家列表
export function COUNTRY_LIST(params) {
  return service({
    method: "get",
    url: `/chargeProd/get/country/list`,
    params,
  });
}

// 发起充值
export function OFFICIAL_WEBSITE_PLACE_V2(data) {
  return service({
    method: "post",
    url: `/official/website/place/v2`,
    data,
    formData: true,
  });
}

// // 发起充值(链接支付)
// export function OFFICIAL_WEBSITE_PLACE_LINK(data) {
//   return service({
//     method: "post",
//     url: `/official/website/place/link`,
//     data,
//   });
// }

// 代理列表
export function AGENCY_HOST_LIST(params) {
  return service({
    method: "get",
    url: `/agency/hot/list`,
    params,
  });
}
