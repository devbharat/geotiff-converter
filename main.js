const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
});

ipcMain.handle('pick-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'GeoTIFF Files', extensions: ['tif', 'tiff'] }],
  });
  return result.filePaths[0];
});

ipcMain.handle('pick-save-location', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'GeoTIFF Files', extensions: ['tif', 'tiff'] }],
  });
  return result.filePath;
});

ipcMain.handle('convert-file', async (_, inputPath, outputPath) => {
  try {
    await sharp(inputPath, { limitInputPixels: false })
      .tiff({ tile: true, pyramid: true, compression: 'lzw' })
      .toFile(outputPath);
    return { success: true };
  } catch (err) {
    console.error('Conversion error:', err);
    return { success: false, error: err.message };
  }
});

