import { request } from "@/utils/request";

export function getUserInfoApi(data: { role: string }) {
  return request({
    url: "/login",
    method: "post",
    noRepeat: true, //根据是否需要防止重复请求，添加自定义属性
    data,
  });
}
export function getRoutesApi() {
  return request({
    url: "/routes",
    method: "get",
    noRepeat: true, //根据是否需要防止重复请求，添加自定义属性
  });
}
export function logoutApi() {
  return request({
    url: "/api/logout",
    method: "post",
    noRepeat: true, //根据是否需要防止重复请求，添加自定义属性
  });
}
