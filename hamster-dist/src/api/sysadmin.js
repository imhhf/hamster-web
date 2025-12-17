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

// 解除封禁
export function UnbanUser(params) {
  return service({
    method: "post",
    url: `${prefix}unbanUser`,
    params,
  });
}

// 房间列表
export function GetRoomList(params) {
  return service({
    method: "get",
    url: `${prefix}getRoomList`,
    params,
  });
}

// 房间信息
export function GetRoomInfo(params) {
  return service({
    method: "get",
    url: `${prefix}getRoomInfo`,
    params,
  });
}

// 修改房间信息
export function UpdateRoomInfo(params) {
  return service({
    method: "post",
    url: `${prefix}updateRoomInfo`,
    params,
  });
}

// 绑定bd
export function BindBd(params) {
  return service({
    method: "post",
    url: `${prefix}bindBd`,
    params,
  });
}


// 解绑bd
export function UnBindBd(params) {
  return service({
    method: "post",
    url: `${prefix}unBindBd`,
    params,
  });
}

// bd列表
export function GetBdList(params) {
  return service({
    method: "get",
    url: `${prefix}getBdList`,
    params,
  });
}

// bd数据
export function GetBdData(params) {
  return service({
    method: "get",
    url: `${prefix}getBdData`,
    params,
  });
}

// 获取礼包
export function GetGiftPack(params) {
  return service({
    method: "get",
    url: `${prefix}getGiftPack`,
    params,
  });
}

// 赠送礼包
export function Send(params) {
  return service({
    method: "post",
    url: `${prefix}giftPack/send`,
    params,
  });
}
