// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  },
  pickFile: () => ipcRenderer.invoke('pick-file'),
  pickSaveLocation: () => ipcRenderer.invoke('pick-save-location'),
  convertFile: (inputPath, outputPath) =>
    ipcRenderer.invoke('convert-file', inputPath, outputPath),
});
