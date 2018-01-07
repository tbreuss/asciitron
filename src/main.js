"use strict"

const electron = require('electron')
const Store = require('./store')
const {ipcMain} = require('electron')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let content = null
let mainWindow = null
let settingsWindow = null


function createSettingswindow() {
    if (!mainWindow || settingsWindow) {
        return
    }

    //let { width, height, x, y} = mainWindow.getBounds()

    // Create the browser window.
    settingsWindow = new BrowserWindow({
        frame: false,
        parent: mainWindow,
        resizable: false,
        alwaysOnTop: true,
        modal: false,
        width: 600,
        height: 500
        //x: x + (width / 2) - 300,
        //y: y + (height / 2) - 200
    })

    settingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/settings.html'),
        protocol: 'file:',
        slashes: true
    }))

    //settingsWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    settingsWindow.on('closed', () => {
        settingsWindow = null
    })
}

ipcMain.on('apply-store-settings', () => {
    if (mainWindow) {
        mainWindow.webContents.send('apply-store-settings')
    }
})

ipcMain.on('close-settings-windows', () => {
    if (settingsWindow) {
        settingsWindow.close()
    }
})

ipcMain.on('content-stored', (event, reload) => {
    console.log('content stored')
    if (mainWindow && reload) {
        mainWindow.reload()
    }
})

ipcMain.on('content-restored', () => {
    console.log('content restored')
})

// initialize the store
global.store = new Store({
    configName: 'user-preferences',
    defaults: {
        "asciidoctor.theme": "asciidoctor",
        "window.width": 800,
        "window.height": 600,
        "editor.theme": "ace/theme/twilight",
        "editor.showGutter": false,
        "editor.showInvisibles": false,
        "preview.highlightjs": true,
        "preview.highlightjs.theme": "default",
        "preview.links_in_new_window": true
    }
});


function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        frame: true,
        /*titleBarStyle: 'hidden', */
        resizable: true,
        minWidth: 800,
        minHeight: 600,
        width: store.get('window.width'),
        height: store.get('window.height'),
        x: store.get('window.x'),
        y: store.get('window.y'),
        title: ''
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.on("devtools-opened", () => {
        // mainWindow.webContents.closeDevTools();
    });

    mainWindow.on('resize', () => {
        let {width, height, x, y} = mainWindow.getBounds();
        store.set('window.width', width)
        store.set('window.height', height)
        store.set('window.x', x)
        store.set('window.y', y)
    });

    mainWindow.on('move', () => {
        let {width, height, x, y} = mainWindow.getBounds();
        store.set('window.width', width)
        store.set('window.height', height)
        store.set('window.x', x)
        store.set('window.y', y)
    });

    mainWindow.on('close', () => {
        console.log('close')
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        settingsWindow = null
        app.quit()
    })

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('restore-content')
    })

    mainWindow.on('hide', () => {
        let menu = electron.Menu.getApplicationMenu()
        menu.items[1].submenu.items[1].enabled = false
    })

    mainWindow.on('show', () => {
        let menu = electron.Menu.getApplicationMenu()
        menu.items[1].submenu.items[1].enabled = true
    })

    require('./menu')

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {

    store.sort()
    store.store()

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

exports.createSettingswindow = createSettingswindow
exports.mainWindow = mainWindow
