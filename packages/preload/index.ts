// @ts-nocheck
/* eslint node/no-callback-literal: 0 */
import fs from 'fs'
import { contextBridge, ipcRenderer } from 'electron'
import { domReady } from './utils'
// const rarbgApi = require('rarbg-api')
  // import { useLoading } from './loading'

  // const { appendLoading, removeLoading } = useLoading()

  ; (async () => {
    await domReady()

    // appendLoading()
  })()

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs)
// contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))
contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send('notify', message);
    }
  },
  topButtonApi: {
    updateWindow(command) {
      ipcRenderer.send('window-update', command);

    }
  },

  batteryApi: {

  },

  filesApi: {

  },
  fetchRARBGApi: {
    retrieveRARBG(command) {
      rarbgApi.list({
        category: rarbgApi.CATEGORY.MOVIES
      }).then(data => console.log(data))
    }
  },
})

contextBridge.exposeInMainWorld('IPC', {
  emit: (event, data) => {
    ipcRenderer.send(event, data)
  },
  on: (event, callback) => {
    ipcRenderer.on(event, (event, ...args) => callback(...args))
  }
})
contextBridge.exposeInMainWorld('version', {
  arch: process.arch,
  platform: process.platform
})

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}
