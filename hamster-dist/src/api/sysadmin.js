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

// 用户列表
export function getUserList(params) {
  return service({
    method: "get",
    url: `${prefix}getUserList`,
    params,
  });
}
