import axios from "axios";
import { ElLoading } from "element-plus";
import { confirm } from "./confirm.js"
import { useAxiosLoaderStore } from "@/store/global";

//注意，这个axios.js不能放入$utils中，因为使用了pinia中的东西

//这里用的是现成搭好的，后续可以更换为自己的
const BASE_URL = "https://mu-api.yuk0.com/";

//不带全局loading的请求实例
export const requestWithoutLoading = createBaseInstance();

// 带全局loading的请求实例
// 传入函数是因为需要在处理请求结果handleResponse之前处理loading
// 所以要在内部插入loading拦截器的处理逻辑
export const request = createBaseInstance();
mixinLoading(request.interceptors);

//通用的axios实例
function createBaseInstance() {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  instance.interceptors.response.use(handleResponse, handleError);
  return instance;
}

function handleError(e) {
  confirm(e.message, "出错辣>3<");
  throw e;
}

function handleResponse(response) {
  return response.data;
}

let loading;
let loadingCount = 0;

function mixinLoading(interceptors) {
  const axiosLoaderStore = useAxiosLoaderStore();

  interceptors.request.use(loadingRequestInterceptor);
  interceptors.response.use(
    loadingResponseInterceptor,
    loadingResponseErrorInterceptor
  );

  function loadingRequestInterceptor(config) {
    if (!loading) {
      loading = ElLoading.service({
        target: "body",
        background: "transparent",
        text: "载入中",
      });
      axiosLoaderStore.setAxiosLoading(true);
    }
    loadingCount++;

    return config;
  }

  function handleResponseLoading() {
    loadingCount--;
    if (loadingCount === 0) {
      loading.close();
      loading = null;
      axiosLoaderStore.setAxiosLoading(false);
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
