import { service } from "@/utils/request";

const prefix = "/guild/";

// 公会详情
export function GUILD_INFO(params) {
  return service({
    method: "get",
    url: `${prefix}getGuildInfo`,
    params,
  });
}

// 公会推荐
export function GUILD_RECOMMEND(params) {
  return service({
    method: "get",
    url: `${prefix}recommend`,
    params,
  });
}

// 用户公会主页
export function GUILD_MY_DETAIL(params) {
  return service({
    method: "get",
    url: `${prefix}getMyGuildDetail`,
    params,
  });
}

// 公会全部成员历史数据(公会长权限)
export function GUILD_HISTORY_DATA_FOR_GUILD_ID(params) {
  return service({
    method: "get",
    url: `${prefix}historicalDataForGuildId`,
    params,
  });
}

// 公会成员历史明细数据
export function GUILD_HISTORY_DATA_FOR_UID(params) {
  return service({
    method: "get",
    url: `${prefix}historicalDataForUid`,
    params,
  });
}

// 用户公会名片
export function GUILD_MEMBER_CARD(params) {
  return service({
    method: "get",
    url: `${prefix}member/card`,
    params,
  });
}

// 公会搜索
export function GUILD_SEARCH(params) {
  return service({
    method: "get",
    url: `${prefix}search`,
    params,
  });
}

// 公会成员申请加入列表(消息列表)
export function GUILD_MEMBER_APPLY_LIST(params) {
  return service({
    method: "get",
    url: `${prefix}member/apply/list`,
    params,
  });
}

// 申请公会配置信息
export function GUILD_CREATE_CONF(params) {
  return service({
    method: "get",
    url: `${prefix}create/conf`,
    params,
  });
}

// 公会成员退出费用
export function GUILD_MEMBER_QUIT_COST(params) {
  return service({
    method: "get",
    url: `${prefix}member/quit/cost`,
    params,
  });
}

// 申请加入公会
export function GUILD_JOIN_APPLY(data) {
  return service({
    method: "post",
    url: `${prefix}join/apply`,
    data,
    formData: true,
  });
}

// 公会申请
export function GUILD_CREATE_APPLY(data) {
  return service({
    method: "post",
    url: `${prefix}create/apply`,
    data,
    formData: true,
  });
}

// 公会成员退出
export function GUILD_MEMBER_QUIT(data) {
  return service({
    method: "post",
    url: `${prefix}member/quit`,
    data,
    formData: true,
  });
}

// 踢出公会成员
export function GUILD_MEMBER_KICK_OUT(data) {
  return service({
    method: "post",
    url: `${prefix}member/kick/out`,
    data,
    formData: true,
  });
}

// 公会解散
export function GUILD_DISSOLVE(data) {
  return service({
    method: "post",
    url: `${prefix}dissolve`,
    data,
    formData: true,
  });
}

// 邀请搜索用户
export function GUILD_INVITE_SEARCH(data) {
  return service({
    method: "post",
    url: `${prefix}invite/search`,
    data,
    formData: true,
  });
}

// 加入公会邀请
export function GUILD_JOIN_INVITE(data) {
  return service({
    method: "post",
    url: `${prefix}join/invite`,
    data,
    formData: true,
  });
}

// 公会信息修改
export function GUILD_UPDATE(data) {
  return service({
    method: "post",
    url: `${prefix}update`,
    data,
    formData: true,
  });
}

// 公会成员申请审核
export function GUILD_MEMBER_APPLY_AUDIT(data) {
  return service({
    method: "post",
    url: `${prefix}member/apply/audit`,
    data,
    formData: true,
  });
}
