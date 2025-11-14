import axios from "axios";

let lang = new URLSearchParams(new URL(window.location.href).search).get(
  "lang"
);
if (lang) {
  if (lang == "en" || lang.indexOf("en") > -1) {
    lang = "en";
  } else if (lang == "ar" || lang.indexOf("ar") > -1) {
    lang = "ar";
  } else {
    lang = "ar";
  }
} else {
  lang = "ar";
}

// 创建axios实例
export const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_DOMAIN + "/" + __APP_NAME__ + "/", // api的base_url
  timeout: 20000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头等信息
    // 例如：config.headers['Authorization'] = 'Bearer your-token';
    
    if (config.formData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    const method = config.method.toLowerCase();

    let params = {
      language: lang,
    };
    if (method === "get") {
      if (config.params) {
        if (config.params.language) {
          params.language = config.params.language;
        }
        config.params = Object.assign(config.params, params);
      } else {
        config.params = params;
      }
    } else if (method === "post") {
      if (config.data) {
        if (config.data.language) {
          params.language = config.data.language;
        }
        config.data = Object.assign(config.data, params);
      } else {
        config.data = params;
      }

      // if (config.formData) {
      //   let formData = new FormData();
      //   Object.keys(config.data).forEach((key) => {
      //     formData.append(key, config.data[key]);
      //   });
      //   config.data = formData;
      // }
    }

    return config;
  },
  (error) => {
    // 请求错误处理
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做处理，例如只返回data部分
    const res = response.data;
    // 如果返回的状态码为200，说明成功，可以直接返回数据
    if (res.code === 200) {
      return res.data;
    } else {
      // 其他状态码都当作错误处理
      // 可以在这里对不同的错误码进行不同处理
      return Promise.reject({
        message: res.message || "Error",
        code: res.code,
      });
    }
  },
  (error) => {
    // 对响应错误做处理
    return Promise.reject(error);
  }
);
