export { debounce, throttle } from 'lodash-es'//防抖节流函数

export function requestFullScreen(element) {
    const docElm = element;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }
  }
  
  export function exitFullscreen() {
    const de = window.parent.document;
  
    if (de.exitFullscreen) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    } else if (de.msExitFullscreen) {
      de.msExitFullscreen()
    }
  }
  
  export function isFullscreen() {
    return document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen
  }