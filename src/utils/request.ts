import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
// import { Toast } from '@/tdesign-vue-next'; // 或根据你实际使用的UI库调整导入路径
import { getToken } from '@/utils/auth';

// 创建一个 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // API 基础路径
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json', // 默认请求头
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: import('axios').InternalAxiosRequestConfig) => {
    // 从本地存储中获取 token
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error: AxiosError) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 处理响应数据
    return response.data;
  },
  (error: AxiosError) => {
    // 处理响应错误
    if (error.response) {
      // 服务器返回了响应，但状态码不在 2xx 范围内
      const status = error.response.status;
      if (status === 401) {
        // token 过期或无效
        // Toast.warning({
        //   content: '登录已过期，请重新登录',
        //   duration: 3000,
        // });
        // 可以在这里跳转到登录页面
        // window.location.href = '/login';
      } else if (status === 403) {
        // 没有权限
        // Toast.warning({
        //   content: '没有权限，请联系管理员',
        //   duration: 3000,
        // });
      } else if (status === 500) {
        // 服务器内部错误
        // Toast.error({
        //   content: '服务器内部错误',
        //   duration: 3000,
        // });
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      // Toast.error({
      //   content: '网络错误，请检查网络连接',
      //   duration: 3000,
      // });
    } else {
      // 请求设置出错
      // Toast.error({
      //   content: '请求设置出错',
      //   duration: 3000,
      // });
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
const request = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return service.get<T>(url, config).then(res => res as T);
  },
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return service.post<T>(url, data, config).then(res => res as T);
  },
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return service.put<T>(url, data, config).then(res => res as T);
  },
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return service.delete<T>(url, config).then(res => res as T);
  },
};

export default request;
