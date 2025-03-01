const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js')
    },
    frame: false, /*去掉顶部导航 去掉关闭按钮 最大化最小化按钮*/
    icon: path.join(__dirname, '../../public/music.png'),
  })

  // 开发环境加载 Vite 开发服务器，生产环境加载构建后的文件
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173') // Vite 默认端口 5173
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  mainWindow.setMenu(null);
}

app.whenReady().then(createWindow)