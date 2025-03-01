const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 示例：暴露系统版本
  getPlatform: () => process.platform
})