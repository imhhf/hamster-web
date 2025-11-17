import { service } from "@/utils/request";

const prefix = "/admin/center/";

// 首页
export function home(params) {
  return service({
    method: "get",
    url: `${prefix}home`,
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

// 用户信息
export function getUserInfo(params) {
  return service({
    method: "get",
    url: `${prefix}getUserInfo`,
    params,
  });
}

// 修改用户信息
export function updateUserInfo(params) {
  return service({
    method: "post",
    url: `${prefix}updateUserInfo`,
    params,
  });
}

// 封禁用户
export function BanUser(params) {
  return service({
    method: "POST",
    url: `${prefix}banUser`,
    params,
  });
}

// 用户列表
export function getUserList(params) {
  return service({
    method: "get",
    url: `${prefix}getUserList`,
    params,
  });
}

// 封禁记录
export function GetUserBanList(params) {
  return service({
    method: "get",
    url: `${prefix}getUserBanList`,
    params,
  });
}

// 封禁记录详情
export function GetBanInfo(params) {
  return service({
    method: "get",
    url: `${prefix}getBanInfo`,
    params,
  });
}
