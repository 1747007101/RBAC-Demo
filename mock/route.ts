import { MockMethod } from "vite-plugin-mock";
import Mock from "mockjs";

const userList = [
  { id: 1, username: "admin", role: "超级管理员", permissions: ["*"] },
  {
    id: 2,
    username: "user",
    role: "普通用户",
    permissions: ["user:role", "dashboard:view"],
  },
  {
    id: 3,
    username: "guest",
    role: "游客",
    permissions: ["guest:role", "dashboard:view"],
  },
];

export default [
  {
    url: "/api/login", // 登录接口
    method: "post", // POST请求
    response: (req: any) => {
      const { role } = req.body;
      if (role === "admin") {
        return {
          code: 200,
          message: "登录成功",
          data: {
            token: Mock.Random.guid(),
            userInfo: userList[0],
          },
        };
      } else if (role === "user") {
        return {
          code: 200,
          message: "登录成功",
          data: {
            token: Mock.Random.guid(),
            userInfo: userList[1],
          },
        };
      } else if (role === "guest") {
        return {
          code: 200,
          message: "登录成功",
          data: {
            token: Mock.Random.guid(),
            userInfo: userList[2],
          },
        };
      }
    },
  },
  {
    url: "/api/routes",
    method: "get",
    response: () => {
      return {
        code: 200,
        data: [
          {
            path: "/dashboard",
            name: "Dashboard",
            component: "views/dashboard/index",
            meta: { title: "首页" },
          },
          {
            path: "/user",
            name: "User",
            component: "views/user/index",
            meta: { title: "用户管理" },
          },
          {
            path: "/permission-demo",
            name: "PermissionDemo",
            component: "views/permission-demo/index",
            meta: { title: "权限演示" },
          },
        ],
      };
    },
  },
  {
    url: "/api/logout",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "退出登录成功",
      };
    },
  },
] as MockMethod[];
