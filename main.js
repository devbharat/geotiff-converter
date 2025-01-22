// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
require('electron-reload')(path.join(__dirname, 'public'), {
  electron: path.join(__dirname, 'node_modules/.bin/electron'),
});

const fs = require('fs');
const sharp = require('sharp');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createMainWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) createMainWindow();
});

// IPC handlers
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

ipcMain.handle('convert-file', async (event, inputPath, outputPath) => {
  try {
    // Get file size in bytes
    const fileSizeInBytes = fs.statSync(inputPath).size;
    const fileSizeInGB = fileSizeInBytes / (1024 ** 3); // Convert bytes to GB
    const estimatedTimeInSeconds = fileSizeInGB * 18; // 18 seconds per GB

    // Start processing the file
    const sharpTask = sharp(inputPath, { limitInputPixels: false })
      .tiff({ tile: true, pyramid: true, compression: 'webp' })
      .toFile(outputPath);

    // Emit heuristic progress updates
    let elapsedTime = 0;
    const pollInterval = 100; // milliseconds
    const totalPolls = Math.ceil((estimatedTimeInSeconds * 1000) / pollInterval); // Total number of intervals
    let currentPoll = 0;

    const pollProgress = setInterval(() => {
      elapsedTime += pollInterval / 1000; // Convert milliseconds to seconds
      currentPoll++;

      // Estimate progress as a percentage
      const progress = Math.min((elapsedTime / estimatedTimeInSeconds) * 100, 100);

      event.sender.send('conversion-progress', progress.toFixed(2));

      // Stop polling if we reach 100% or the sharp task is complete
      if (progress >= 100 || currentPoll >= totalPolls) {
        clearInterval(pollProgress);
      }
    }, pollInterval);

    // Wait for sharp to complete processing
    await sharpTask;

    // Ensure we send 100% progress when done
    event.sender.send('conversion-progress', '100');
    return { success: true };
  } catch (err) {
    console.error('Conversion error:', err);
    return { success: false, error: err.message };
  }
});