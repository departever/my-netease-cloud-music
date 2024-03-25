import { throttle } from './common'

export const remBase = 14

let htmlFontSize
!(function() {
  // 定义一个计算根字体大小的函数
  const calc = function() {
    const maxFontSize = 18; // 最大字体大小
    const minFontSize = 14; // 最小字体大小
    const html = document.getElementsByTagName('html')[0]; // 获取html元素
    const width = html.clientWidth; // 获取html元素的宽度
    let size = remBase * (width / 1440); // 计算基于remBase的字体大小
    size = Math.min(maxFontSize, size); // 确保字体大小不超过最大值
    size = Math.max(minFontSize, size); // 确保字体大小不小于最小值
    html.style.fontSize = size + 'px'; // 设置html元素的字体大小
    htmlFontSize = size; // 更新全局变量htmlFontSize
  };
  calc(); // 首次调用calc函数来设置字体大小
  // 添加resize事件监听器，当窗口大小变化时调用calc函数
  // 使用节流函数throttle来限制calc函数的调用频率，避免性能问题
  window.addEventListener('resize', throttle(calc, 500));
})();


// 根据基准字号计算
// 用于静态样式
export function toRem(px) {
  return `${px / remBase}rem`
}

// 根据当前的html根字体大小计算
// 用于某些js的动态计算
export function toCurrentRem(px) {
  return `${px / htmlFontSize}rem`
}