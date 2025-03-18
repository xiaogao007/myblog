import axios from 'axios';
import { message } from 'antd';

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api',  // Changed from http://123.56.165.6:3001 to /api
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 这里可以根据后端的响应结构进行调整
    if (res.code && res.code !== 200) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res;
  },
  error => {
    const { response } = error;
    if (response && response.status) {
      switch (response.status) {
        case 401:
          message.error('未授权，请重新登录');
          // 可以在这里处理登出逻辑
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求错误，未找到该资源');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error('网络错误');
      }
    } else {
      message.error('网络连接异常');
    }
    return Promise.reject(error);
  }
);

// 封装 GET 请求
export function get(url, params) {
  return service.get(url, { params });
}

// 封装 POST 请求
export function post(url, data) {
  return service.post(url, data);
}

// 封装 PUT 请求
export function put(url, data) {
  return service.put(url, data);
}

// 封装 DELETE 请求
export function del(url) {
  return service.delete(url);
}

// 导出 axios 实例
export default service;