const {Menu} = require('electron')
const electron = require('electron')
const app = electron.app
const dialog = require('electron').dialog
const mainWindow = require('../main').mainWindow

const template = [
    {
        label: 'Datei',
        submenu: [
            {
                label: 'Öffnen',
                click (item, focusedWindow) {
                    dialog.showOpenDialog({
                        properties: ['openFile'],
                        filters: [/*{ name: 'GPX', extensions: ['gpx'] }*/]
                    }, function (filePaths) {
                        focusedWindow.webContents.send('read-file', filePaths)
                    })
                }
            },
            {
                label: 'Speichern',
                click (item, focusedWindow) {
                    dialog.showSaveDialog({}, function (fileName) {
                        focusedWindow.webContents.send('save-file', fileName)
                    })
                }
            },
            {
                label: 'Test',
                click (item, focusedWindow, event) {
                    console.log(item)
                    console.log(focusedWindow)
                    console.log(event)
                },
                xenable: mainWindow === null
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload()
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click () {
                    require('electron').shell.openExternal('http://electron.atom.io')
                }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
        label: name,
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })
    // Edit menu.
    template[1].submenu.push(
        {
            type: 'separator'
        },
        {
            label: 'Speech',
            submenu: [
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        }
    )
    // Window menu.
    template[3].submenu = [
        {
            label: 'Schliessen',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        },
        {
            label: 'Minimieren',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: 'Zoom',
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: 'Alle nach vorne bringen',
            role: 'front'
        }
    ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

mainWindow.on('activate', function () {
    //contextMenu.items[0].visible = false;
    //contextMenu.items[1].visible = true;
    console.log('activate')
    menu.items[1].submenu.items[0].enabled = true
    menu.items[1].submenu.items[1].enabled = true
    menu.items[1].submenu.items[2].enabled = true
    Menu.setApplicationMenu(menu)
});

mainWindow.on('restore', function () {
    //contextMenu.items[0].visible = true;
    //contextMenu.items[1].visible = false;
    console.log('restore')
});

mainWindow.on('closed', function () {
    console.log('closed')
    menu.items[1].submenu.items[0].enabled = false
    menu.items[1].submenu.items[1].enabled = false
    menu.items[1].submenu.items[2].enabled = false
    Menu.setApplicationMenu(menu)
});
