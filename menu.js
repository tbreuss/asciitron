const {Menu} = require('electron')
const electron = require('electron')
const app = electron.app
const dialog = require('electron').dialog

const template = [
    {
        label: 'Datei',
        submenu: [
            {
                label: 'Öffnen',
                accelerator: 'CmdOrCtrl+O',
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
                accelerator: 'CmdOrCtrl+S',
                click (item, focusedWindow) {
                    dialog.showSaveDialog({}, function (fileName) {
                        focusedWindow.webContents.send('save-file', fileName)
                    })
                }
            },
            {
                label: 'Test',
                click (item, focusedWindow, event) {
                    clickFunction(item, focusedWindow, event)
                }
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
                label: 'Left 1:2 Right',
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 33, right: 67})
                }
            },
            {
                label: 'Left 1:1 Right',
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 50, right: 50})
                }
            },
            {
                label: 'Left 2:1 Right',
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 67, right: 33})
                }
            },
            {
                label: 'Hide Editor Pane',
                click (item, focusedWindow) {
                    setEditorPaneVisibility(focusedWindow, false)
                },
                visible: true
            },
            {
                label: 'Show Editor Pane',
                click (item, focusedWindow) {
                    setEditorPaneVisibility(focusedWindow, true)
                },
                visible: false
            },
            {
                label: 'Hide Preview Pane',
                click (item, focusedWindow) {
                    setPreviewPaneVisibility(focusedWindow, false)
                },
                visible: true
            },
            {
                label: 'Show Preview Pane',
                click (item, focusedWindow) {
                    setPreviewPaneVisibility(focusedWindow, true)
                },
                visible: false
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
                label: `About ${name}`,
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
    /*
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
    */
    // Window menu.
    template[4].submenu = [
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

function setEditorPaneVisibility(focusedWindow, visible) {
    focusedWindow.webContents.send('show-editor-pane', visible)
    menu.items[3].submenu.items[6].visible = visible
    menu.items[3].submenu.items[7].visible = !visible
    if (!visible && menu.items[3].submenu.items[9].visible) {
        setPreviewPaneVisibility(focusedWindow, true)
    }
}

function setPreviewPaneVisibility(focusedWindow, visible) {
    focusedWindow.webContents.send('show-preview-pane', visible)
    menu.items[3].submenu.items[8].visible = visible
    menu.items[3].submenu.items[9].visible = !visible
    if (!visible && menu.items[3].submenu.items[7].visible) {
        setEditorPaneVisibility(focusedWindow, true)
    }
}

function showPaneVisibility(focusedWindow) {
    setEditorPaneVisibility(focusedWindow, true)
    setPreviewPaneVisibility(focusedWindow, true)
}

Menu.setApplicationMenu(menu)
