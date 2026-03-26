import service from "./service";
import { InternalRequestConfig, InternalResponseConfig } from "./types";
import { addPending, removePending } from "./pending";
import { handleLogout } from "./utils";

// 请求拦截
service.interceptors.request.use((config: InternalRequestConfig) => {
  if (config.noRepeat) addPending(config);
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 响应拦截
service.interceptors.response.use(
  (response: InternalResponseConfig) => {
    if (response.config.noRepeat) removePending(response.config);
    if (response.status !== 200) {
      return Promise.reject("网络错误");
    }
    const res = response.data;
    return res;
  },
  (error) => {
    if (error.config.noRepeat) removePending(error.config || {});
    // HTTP错误处理
    const status = error.response?.status;

    switch (status) {
      case 401:
        console.error("未登录或登录过期");
        handleLogout();
        break;
      case 403:
        console.error("无权限访问");
        break;
      case 500:
        console.error("服务器错误");
        break;
      default:
        console.error("网络错误");
    }

    return Promise.reject(error);
  },
);

export function request<T = any>(config: any): Promise<T> {
  return service(config);
}
