/**
 * 公会模块 API 接口封装
 * 所有公会相关的后端接口都在这里定义
 * 使用方法：在页面中导入对应的函数并调用
 *
 * 示例：
 * import { GUILD_INFO } from '@/api/guild'
 * const data = await GUILD_INFO({ guildId: 123 })
 */

import { service } from "@/utils/request";

// 接口路径前缀，所有公会接口都以 /guild/ 开头
const prefix = "/guild/";

// ==================== GET 请求接口 ====================

/**
 * 获取公会详情
 * @param {Object} params - 查询参数
 * @param {number} params.guildId - 公会ID
 * @returns {Promise} 公会详情数据
 */
export function GUILD_INFO(params) {
  return service({
    method: "get",
    url: `${prefix}getGuildInfo`,
    params,
  });
}

/**
 * 获取推荐公会列表
 * @param {Object} params - 查询参数（分页等）
 * @returns {Promise} 推荐公会列表
 */
export function GUILD_RECOMMEND(params) {
  return service({
    method: "get",
    url: `${prefix}recommend`,
    params,
  });
}

/**
 * 获取用户当前加入的公会详情
 * @param {Object} params - 查询参数
 * @returns {Promise} 我的公会详情
 */
export function GUILD_MY_DETAIL(params) {
  return service({
    method: "get",
    url: `${prefix}getMyGuildDetail`,
    params,
  });
}

/**
 * 获取公会全部成员的历史数据（需要公会长权限）
 * @param {Object} params - 查询参数
 * @param {number} params.guildId - 公会ID
 * @returns {Promise} 历史数据列表
 */
export function GUILD_HISTORY_DATA_FOR_GUILD_ID(params) {
  return service({
    method: "get",
    url: `${prefix}historicalDataForGuildId`,
    params,
  });
}

/**
 * 获取公会成员的历史明细数据
 * @param {Object} params - 查询参数
 * @param {number} params.uid - 成员用户ID
 * @returns {Promise} 成员历史数据
 */
export function GUILD_HISTORY_DATA_FOR_UID(params) {
  return service({
    method: "get",
    url: `${prefix}historicalDataForUid`,
    params,
  });
}

/**
 * 获取用户公会名片信息
 * @param {Object} params - 查询参数
 * @returns {Promise} 名片数据
 */
export function GUILD_MEMBER_CARD(params) {
  return service({
    method: "get",
    url: `${prefix}member/card`,
    params,
  });
}

/**
 * 搜索公会
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise} 搜索结果列表
 */
export function GUILD_SEARCH(params) {
  return service({
    method: "get",
    url: `${prefix}search`,
    params,
  });
}

/**
 * 获取公会成员申请加入列表（消息列表）
 * @param {Object} params - 查询参数
 * @returns {Promise} 申请列表
 */
export function GUILD_MEMBER_APPLY_LIST(params) {
  return service({
    method: "get",
    url: `${prefix}member/apply/list`,
    params,
  });
}

/**
 * 获取创建公会所需的配置信息
 * @param {Object} params - 查询参数
 * @returns {Promise} 配置信息（如所需材料、条件等）
 */
export function GUILD_CREATE_CONF(params) {
  return service({
    method: "get",
    url: `${prefix}create/conf`,
    params,
  });
}

/**
 * 获取公会成员退出所需费用
 * @param {Object} params - 查询参数
 * @returns {Promise} 费用信息
 */
export function GUILD_MEMBER_QUIT_COST(params) {
  return service({
    method: "get",
    url: `${prefix}member/quit/cost`,
    params,
  });
}

// ==================== POST 请求接口（需要 formData） ====================

/**
 * 申请加入公会
 * @param {Object} data - 提交数据
 * @param {number} data.guildId - 目标公会ID
 * @param {string} data.message - 申请留言
 * @returns {Promise} 提交结果
 */
export function GUILD_JOIN_APPLY(data) {
  return service({
    method: "post",
    url: `${prefix}join/apply`,
    data,
    formData: true,  // 使用 multipart/form-data 格式提交
  });
}

/**
 * 申请创建公会
 * @param {Object} data - 公会信息
 * @param {string} data.name - 公会名称
 * @param {string} data.description - 公会描述
 * @returns {Promise} 提交结果
 */
export function GUILD_CREATE_APPLY(data) {
  return service({
    method: "post",
    url: `${prefix}create/apply`,
    data,
    formData: true,
  });
}

/**
 * 公会成员主动退出公会
 * @param {Object} data - 提交数据
 * @returns {Promise} 退出结果
 */
export function GUILD_MEMBER_QUIT(data) {
  return service({
    method: "post",
    url: `${prefix}member/quit`,
    data,
    formData: true,
  });
}

/**
 * 踢出公会成员（管理员/会长权限）
 * @param {Object} data - 提交数据
 * @param {number} data.memberUid - 要踢出的成员ID
 * @returns {Promise} 操作结果
 */
export function GUILD_MEMBER_KICK_OUT(data) {
  return service({
    method: "post",
    url: `${prefix}member/kick/out`,
    data,
    formData: true,
  });
}

/**
 * 解散公会（会长权限）
 * @param {Object} data - 提交数据
 * @returns {Promise} 解散结果
 */
export function GUILD_DISSOLVE(data) {
  return service({
    method: "post",
    url: `${prefix}dissolve`,
    data,
    formData: true,
  });
}

/**
 * 搜索可邀请的用户
 * @param {Object} data - 搜索条件
 * @param {string} data.keyword - 搜索关键词
 * @returns {Promise} 用户列表
 */
export function GUILD_INVITE_SEARCH(data) {
  return service({
    method: "post",
    url: `${prefix}invite/search`,
    data,
    formData: true,
  });
}

/**
 * 发送公会加入邀请
 * @param {Object} data - 邀请信息
 * @param {number} data.inviteUid - 被邀请用户ID
 * @returns {Promise} 发送结果
 */
export function GUILD_JOIN_INVITE(data) {
  return service({
    method: "post",
    url: `${prefix}join/invite`,
    data,
    formData: true,
  });
}

/**
 * 修改公会信息（管理员/会长权限）
 * @param {Object} data - 新的公会信息
 * @returns {Promise} 修改结果
 */
export function GUILD_UPDATE(data) {
  return service({
    method: "post",
    url: `${prefix}update`,
    data,
    formData: true,
  });
}

/**
 * 审核公会成员申请（管理员/会长权限）
 * @param {Object} data - 审核信息
 * @param {number} data.applyId - 申请记录ID
 * @param {number} data.status - 审核状态 1通过 2拒绝
 * @returns {Promise} 审核结果
 */
export function GUILD_MEMBER_APPLY_AUDIT(data) {
  return service({
    method: "post",
    url: `${prefix}member/apply/audit`,
    data,
    formData: true,
  });
}

/**
 * 创建子公会（会长权限）
 * @param {Object} data - 子公会信息
 * @param {number} data.targetUid - 被指定为子公会会长的用户ID
 * @param {string} data.guildName - 子公会名称
 * @returns {Promise} 创建结果
 */
export function GUILD_CREATE_SUB_AGENCY(data) {
  return service({
    method: "post",
    url: `${prefix}createSubAgency`,
    data,
    formData: true,
  });
}