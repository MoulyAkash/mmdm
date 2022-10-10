// @ts-nocheck
import { dialog, app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'os'
import { join } from 'path'
import './samples/electron-store'
import './samples/npm-esm-packages'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

ipcMain.on('dialog', async (event, data) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (filePaths.length) {
    let path = filePaths[0]
    if (!(path.endsWith('\\') || path.endsWith('/'))) {
      if (path.indexOf('\\') !== -1) {
        path += '\\'
      } else if (path.indexOf('/') !== -1) {
        path += '/'
      }
    }
    event.sender.send('path', path)
  }
})

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1600,
    height: 900,
    minWidth: 940,
    minHeight: 560,
    frame: false,
    backgroundColor: '#191c20',
    experimentalFeatures: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      enableBlinkFeatures: 'AudioVideoTracks',
      preload: join(__dirname, '../preload/index.cjs')
    },
  })

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

    win.loadURL(url)
    // win.webContents.openDevTools()
  }

  win.webContents.openDevTools({ mode: 'detach' })

  ipcMain.on('notify', (_, message) => {
    new Notification({ title: 'Notification', body: message }).show();
  })

  // MINIMZE MAXIMIZE AND CLOSE
  ipcMain.on('window-update', (_, command) => {
    if (command == 'closeApp') {
      win.close()
    }
    else if (command == 'minimizeApp') {
      win.minimize()
    }
    else if (command == 'toggleMaximizeApp') {
      if (win.isMaximized()) {
        win.restore()
      }
      else {
        win.maximize()
      }
    }
  })

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // Make all links open with the browser, not with the application
  // win.webContents.setWindowOpenHandler(({ url }) => {
  //   if (url.startsWith('https:')) shell.openExternal(url)
  //   return { action: 'deny' }
  // })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.on('version', (event) => {
  event.sender.send('version', app.getVersion()) // fucking stupid
})