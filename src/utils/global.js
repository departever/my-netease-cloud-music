import * as utils from './index';
import { defineAsyncComponent } from 'vue';

export default {
  install(app) {
    // 动态导入base目录下的所有.vue文件
    const components = import.meta.glob('../base/*.vue');

    for (const path in components) {
      // 提取文件名并转换为PascalCase格式
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

      // 使用defineAsyncComponent来定义异步组件
      app.component(componentName, defineAsyncComponent(components[path]));
    }

    app.config.globalProperties.$utils = utils;
  },
};
