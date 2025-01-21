const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
require('electron-reload')(path.join(__dirname, 'public'), {
  electron: path.join(__dirname, 'node_modules/.bin/electron'),
});

const sharp = require('sharp');

let mainWindow;

// Function to create the main window
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Secure bridge between Electron and React
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  // Load React's index.html
  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));

  // Open developer tools during development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Electron app lifecycle hooks
app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// IPC Handlers
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
      .tiff({ tile: true, pyramid: true, compression: 'webp' })
      .toFile(outputPath);
    return { success: true };
  } catch (err) {
    console.error('Conversion error:', err);
    return { success: false, error: err.message };
  }
});

