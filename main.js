// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    darkTheme: true
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // const child = new BrowserWindow({parent: mainWindow, modal: true, show: false})
  // child.loadURL('https://github.com')
  // child.once('ready-to-show', () => {
  //   child.show()
  //   mainWindow.setOpacity(0.9)
  // })

  mainWindow.on('blur', ()=>{
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on('browser-window-blur', function() {
  console.log('browser-window-blur')
  // app.quit()
  // app.relaunch()
})

app.on('session-created', function() {
  console.log('session-created')
  // app.showAboutPanel()
})

fs.access(path.join(os.homedir(), "_vimrc"), (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("_vimrc exists at " + path.join(os.homedir(), "_vimrc"))
  }
})