import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const fs = require('fs')
const os = require('os')
const path = require('path')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    fullscreenable: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    center: true,
    title: 'NoteMD',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'default',
    backgroundMaterial: 'acrylic'
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const dirPath = path.join(os.homedir(), 'Note-MD_Files')

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  fs.watch(dirPath, (e, filename) => {
    console.log(`${filename} was ${e}`)
    mainWindow.webContents.send('file-changed', filename)
  })

  if (!fs.existsSync(path.join(dirPath, 'Welcome.md'))) {
    fs.writeFileSync(
      path.join(dirPath, 'Welcome.md'),
      "# 🚀 Welcome to Note-MD! 👋\n\nStart by editing this file!\n\nInsert links by going to the next line and pasting them!\n\nInsert quotes using '>'\n\n> Like This!😎😎😎😎\n\nTip: Stay in the quote using Shift+Enter\n\n## 🚀Enjoy Note MD! 🚀\n\nP.S. Check out [https://swarchat.vercel.app/about](https://swarchat.vercel.app/about) 🤫🤫🤫"
    )
  }

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  const dialog_result = (event) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender) // Get the parent window
    const result = dialog.showMessageBoxSync(browserWindow, {
      type: 'question',
      title: 'Are you sure?',
      message: 'Are you sure you want to leave current file? You have unsaved changes.',
      buttons: ['Yes', 'No']
    })
    event.sender.send('Result_Unsaved_Dialog', result)
    return result
  }

  ipcMain.on('confirm-notSaved', dialog_result)

  ipcMain.on('read-file', (event, fileName) => {
    const homeDir = path.join(os.homedir(), 'Note-MD_Files')
    const filePath = path.join(homeDir, fileName)

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        event.reply('Error_File_Reading', err)
        return
      }
      event.reply('File_Read', data)
    })
  })

  ipcMain.on('write-file', (event, fileName, data) => {
    const homeDir = path.join(os.homedir(), 'Note-MD_Files')
    const filePath = path.join(homeDir, fileName)

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('Save Success')
      }
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
