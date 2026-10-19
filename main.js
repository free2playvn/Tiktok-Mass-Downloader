const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;
let serverProcess = null;

// Start local server if not already running
function startLocalServer() {
  try {
    require('./server.js');
    console.log('[Electron] Server initialized inside process.');
  } catch (e) {
    console.log('[Electron] Server already running or initialized elsewhere:', e.message);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    title: 'TMD Studio Pro - Video Editor & Vietnamese Humanizer',
    backgroundColor: '#0d0f15',
    frame: false, // Custom sleek window titlebar (macOS / Windows 11)
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    icon: path.join(__dirname, 'studio', 'icon.png')
  });

  // Load local studio server
  const loadStudio = () => {
    mainWindow.loadURL('http://localhost:3000').catch(() => {
      // Retry in 500ms if server is still starting
      setTimeout(loadStudio, 500);
    });
  };

  loadStudio();

  // Handle Window State IPC
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow.close());
  ipcMain.handle('window-is-maximized', () => mainWindow.isMaximized());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startLocalServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
