// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  pickFile: () => ipcRenderer.invoke('pick-file'),
  pickSaveLocation: () => ipcRenderer.invoke('pick-save-location'),
  convertFile: (inputPath, outputPath) =>
    ipcRenderer.invoke('convert-file', inputPath, outputPath),
});
