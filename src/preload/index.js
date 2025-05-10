import { contextBridge, ipcMain, ipcRenderer } from 'electron'

const fs = require('fs')
const path = require('path')
const os = require('os')

const dirPath = path.join(os.homedir(), 'Note-MD_Files')

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true })
}

contextBridge.exposeInMainWorld('electron', {
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args)
})

contextBridge.exposeInMainWorld('electronAPI', {
  askUserInput: () => ipcRenderer.invoke('ask-user-input')
})

contextBridge.exposeInMainWorld('markdownFiles', {
  listMarkdownFiles: () => {
    const files = fs.readdirSync(dirPath)
    const initList = files.filter((file) => path.extname(file).toLowerCase() === '.md')
    let list = []
    const formatter = new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium'
    })
    initList.map((obj) => {
      const file = {
        title: path.basename(obj, '.md'),
        sub: formatter.format(fs.statSync(path.join(dirPath, obj)).mtime)
      }
      list.push(file)
    })
    return list
  },
  getFolderPath: () => {
    return dirPath
  }
})

// // Custom APIs for renderer
// const api = {}

// // Use `contextBridge` APIs to expose Electron APIs to
// // renderer only if context isolation is enabled, otherwise
// // just add to the DOM global.
// if (process.contextIsolated) {
//   try {
//     contextBridge.exposeInMainWorld('electron', electronAPI)
//     contextBridge.exposeInMainWorld('api', api)
//   } catch (error) {
//     console.error(error)
//   }
// } else {
//   window.electron = electronAPI
//   window.api = api
// }
