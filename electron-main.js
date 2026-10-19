// Electron Native Window wrapper for TMD Studio Pro
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProcess = null;
let mainWindow = null;

function startServer() {
  serverProcess = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'ignore',
    shell: true
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1540,
    height: 960,
    minWidth: 1280,
    minHeight: 800,
    title: 'TMD Studio Pro v3.2 AI Cinematic Edition',
    backgroundColor: '#09090b',
    icon: path.join(__dirname, 'studio', 'favicon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://localhost:3000/studio/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startServer();
  setTimeout(createWindow, 1200);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
