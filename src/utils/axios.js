import axios from "axios";
import { ElLoading } from "element-plus";
import { confirm } from "./confirm.js";
import { useAxiosLoaderStore } from "@/store/global";

//注意，这个axios.js不能放入$utils中，因为使用了pinia中的东西

//这里用的是现成搭好的，后续可以更换为自己的
const BASE_URL = "https://mu-api.yuk0.com/";
// const BASE_URL =
//   "https://fetch1.488848.xyz/https://servencmapi-kltu2mmna3l0.runkit.sh";

//不带全局loading的请求实例
export const requestWithoutLoading = createBaseInstance();

// 带全局loading的请求实例
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
      const axiosLoaderStore = useAxiosLoaderStore();
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
      const axiosLoaderStore = useAxiosLoaderStore();
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
