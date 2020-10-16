'use strict'

const {app, BrowserWindow, Menu, ipcMain} = require('electron')

const store = require('./store')
const path = require('path')
const url = require('url')
const fs = require('fs')

let mainWindow = null
let settingsWindow = null

function createSettingsWindow() {
    if (!mainWindow || settingsWindow) {
        return
    }

    let {width, height, x, y} = mainWindow.getBounds()

    // Create the browser window.
    settingsWindow = new BrowserWindow({
        frame: false,
        parent: mainWindow,
        resizable: false,
        alwaysOnTop: true,
        modal: false,
        width: 600,
        height: 600,
        x: x + (width / 2) - 300,
        y: y + (height / 2) - 300,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(app.getAppPath(), 'src/preload.js')
        }
    })

    settingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/settings.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Emitted when the window is closed.
    settingsWindow.on('closed', () => {
        settingsWindow = null
    })
}

function createMainWindow() {

    const settings = store.read();

    // Create the browser window.
    mainWindow = new BrowserWindow({
        frame: true,
        /*titleBarStyle: 'hidden', */
        resizable: true,
        minWidth: 800,
        minHeight: 600,
        width: settings['window.width'],
        height: settings['window.height'],
        x: settings['window.x'],
        y: settings['window.y'],
        title: '',
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(app.getAppPath(), 'src/preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.on('devtools-opened', () => {
        // mainWindow.webContents.closeDevTools()
    })

    mainWindow.on('close', () => {
        let {width, height, x, y} = mainWindow.getBounds()
        store.write({
            'window.width': width,
            'window.height': height,
            'window.x': x,
            'window.y': y
        })
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
        const menu = Menu.getApplicationMenu()
        menu.items[1].submenu.items[1].enabled = false
    })

    mainWindow.on('show', () => {
        const menu = Menu.getApplicationMenu()
        menu.items[1].submenu.items[1].enabled = true
    })

    require('./menu')

}

app.on('ready', () => {
    createMainWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow()
    }
})

ipcMain.on('apply-settings', () => {
    if (mainWindow) {
        const settings = store.read()
        mainWindow.webContents.send('apply-settings', settings)
    }
})

ipcMain.on('content-stored', (event, reload) => {
    if (mainWindow && reload) {
        mainWindow.reload()
    }
})

ipcMain.on('content-restored', () => {
})

ipcMain.on('close-settings-windows', () => {
    if (settingsWindow) {
        settingsWindow.close()
    }
})

ipcMain.on('load-settings', () => {
    const settings = store.read();
    settingsWindow.webContents.send('settings-loaded', settings)
})

ipcMain.on('save-settings', (event, settings) => {
    store.write(settings);
    mainWindow.webContents.send('apply-settings', settings)
})

ipcMain.on('read-file', (event, fileName) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            console.error('An error ocurred reading the file :' + err.message)
            return
        }
        mainWindow.webContents.send('file-read', data);
    })
})

ipcMain.on('save-file', (event, args) => {
    fs.writeFile(args.path, args.data, {}, (err) => {
        if (err) {
            console.error('An error ocurred reading the file :' + err.message)
            return
        }
        console.info('File saved', args.path)
    })
})

exports.createSettingsWindow = createSettingsWindow
