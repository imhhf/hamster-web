/**
 * 用户模块 API 接口封装
 * 所有用户相关的后端接口都在这里定义
 *
 * 示例：
 * import { SEARCH_USER } from '@/api/user'
 * const data = await SEARCH_USER({ uid: 123, erbanNo: 456 })
 */

import { service } from "@/utils/request";

// 接口路径前缀，所有用户接口都以 /user/ 开头
const prefix = "/user/";

/**
 * 根据 erbanNo（靓号）搜索用户
 * @param {Object} params - 查询参数
 * @param {number} params.uid - 当前用户ID
 * @param {number} params.erbanNo - 要查询的用户靓号
 * @param {number} params.searchType - 搜索类型，默认1
 * @returns {Promise} 用户信息（AgencyUserVO）
 */
export function SEARCH_USER(params) {
  return service({
    method: "get",
    url: `${prefix}search/user`,
    params,
  });
}
