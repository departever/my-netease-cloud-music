import axios from "axios";
import { ElLoading } from "element-plus";
import { confirm } from "./confirm.js";
import { useAxiosLoaderStore } from "@/store/global";


//备用站点 const BASE_URL = "https://fetch1.488848.xyz/https://servencmapi-kltu2mmna3l0.runkit.sh";
const BASE_URL = "https://musicapi.roxybest.top/"


export const requestWithoutLoading = createBaseInstance();

export const request = createBaseInstance();

mixinLoading(request.interceptors);

//通用的axios实例
function createBaseInstance() {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000
  });

  instance.interceptors.response.use(handleResponse, handleError);
  return instance;
}

function handleError(e) {
  if (e.code === "ECONNABORTED") {
    confirm("请求超时，请稍后重试", "超时错误");
  } else {
    confirm(e.message, "出错辣>3<");
  }
  throw e;
}

function handleResponse(response) {
  return response.data;
}

let loading;
let loadingCount = 0;

function mixinLoading(interceptors) {
  interceptors.request.use(loadingRequestInterceptor);
  interceptors.response.use(
    loadingResponseInterceptor,
    loadingResponseErrorInterceptor
  );

  function loadingRequestInterceptor(config) {
    if (!loading) {
      loading = ElLoading.service({
        target: "#app",
        background: "transparent",
        text: "载入中",
      });
    }
    useAxiosLoaderStore().setAxiosLoading(true);
    loadingCount++;

    return config;
  }

  function handleResponseLoading() {
    loadingCount--;
    if (loadingCount === 0) {
      loading.close();
      loading = null;
      useAxiosLoaderStore().setAxiosLoading(false);
    }
  }

  function loadingResponseInterceptor(response) {
    handleResponseLoading();
    return response;
  }

  function loadingResponseErrorInterceptor(e) {
    handleResponseLoading();
    throw e;
  }
}