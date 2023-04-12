const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')

const path = require('path')
const os = require('os')
const fs = require('fs')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    darkTheme: true
  })

  ipcMain.handle('ping', () => 'pong')
  ipcMain.handle('check', check_file)

  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // const child = new BrowserWindow({parent: mainWindow, modal: true, show: false})
  // child.loadURL('https://github.com')
  // child.once('ready-to-show', () => {
  //   child.show()
  //   mainWindow.setOpacity(0.9)
  // })

  mainWindow.on('blur', () => {
    console.log('main window blur')
  })

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })

  })  // end will-download

  // mainWindow.webContents.downloadURL('https://raw.githubusercontent.com/altercation/vim-colors-solarized/master/colors/solarized.vim')

}

app.whenReady().then(() => {
  createWindow()

  // For Mac OS
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// For Mac OS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('browser-window-blur', function () {
  console.log('browser-window-blur')
})

app.on('session-created', function () {
  console.log('session-created')
})


function check_file() {
  fs.access(path.join(os.homedir(), "_vimrc"), (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log("_vimrc exists at " + path.join(os.homedir(), "_vimrc"))
      console.log(process.env.USERPROFILE)
    }
  })
}