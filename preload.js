const { contextBridge, ipcRenderer } = require('electron');

// Expose Electron's IPC methods to the React frontend
contextBridge.exposeInMainWorld('electron', {
  pickFile: () => ipcRenderer.invoke('pick-file'),
  pickSaveLocation: () => ipcRenderer.invoke('pick-save-location'),
  convertFile: (inputPath, outputPath) => ipcRenderer.invoke('convert-file', inputPath, outputPath),
});

