const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const log = require('electron-log');

log.transports.file.level = 'info';
autoUpdater.logger = log;

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Enable context isolation
      enableRemoteModule: false,
    },
  });

  win.loadURL(`http://localhost:5173`);

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});

const { ipcMain } = require('electron');
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('some_event_from_renderer', (event, data) => {
  console.log('Received data from renderer:', data);
  // Handle data or send response back to renderer process
});
