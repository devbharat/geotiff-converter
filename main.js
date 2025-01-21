// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
require('electron-reload')(path.join(__dirname, 'public'), {
  electron: path.join(__dirname, 'node_modules/.bin/electron'),
});

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
    const initialProcessed = sharp.counters().process;
    // Start processing the file
    const sharpTask = sharp(inputPath, { limitInputPixels: false })
      .tiff({ tile: true, pyramid: true, compression: 'webp' })
      .toFile(outputPath);
    // Poll for progress
    const pollInterval = 100; // milliseconds
    const pollProgress = setInterval(() => {
      const currentProcessed = sharp.counters().process;
      const queueSize = sharp.counters().queue;

      // Estimate progress (queue size decreases, process count increases)
      const progress = queueSize === 0
        ? 100
        : ((currentProcessed - initialProcessed) / (currentProcessed - initialProcessed + queueSize)) * 100;

      event.sender.send('conversion-progress', progress.toFixed(2));

      // Stop polling if the task is complete
      if (queueSize === 0) {
        clearInterval(pollProgress);
      }
    }, pollInterval);

    await sharpTask;
    return { success: true };
  } catch (err) {
    console.error('Conversion error:', err);
    return { success: false, error: err.message };
  }
});
