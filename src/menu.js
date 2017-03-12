"use strict"

const {Menu} = require('electron')
const electron = require('electron')
const app = electron.app
const dialog = require('electron').dialog
const createSettingswindow = require('./main').createSettingswindow

let i18n = new(require('./translations/i18n'))
let currentFilePath = ''

const template = [
    {
        label: i18n.__('File'),
        submenu: [
            {
                label: i18n.__('Open'),
                accelerator: 'CmdOrCtrl+O',
                click (item, focusedWindow) {
                    dialog.showOpenDialog({
                        properties: ['openFile'],
                        filters: [{ name: '*', extensions: ['adoc', 'asciidoc'] }]
                    }, function (filePaths) {
                        if (filePaths) {
                            let filePath = filePaths[0]
                            currentFilePath = filePath
                            focusedWindow.setTitle(filePath.split('/').pop())
                            focusedWindow.webContents.send('read-file', filePath)
                        }
                    })
                }
            },
            {
                label: i18n.__('Save'),
                accelerator: 'CmdOrCtrl+S',
                click (item, focusedWindow) {
                    if (currentFilePath) {
                        focusedWindow.webContents.send('save-file', currentFilePath)
                        return
                    }
                    dialog.showSaveDialog({
                        filters: [{ name: '*', extensions: ['adoc'] }]
                    }, function (filePath) {
                        if (filePath) {
                            currentFilePath = filePath
                            focusedWindow.setTitle(filePath.split('/').pop())
                            focusedWindow.webContents.send('save-file', filePath)
                        }
                    })
                }
            }
        ]
    },
    {
        label: i18n.__('Edit'),
        submenu: [
            {
                label: i18n.__('Undo'),
                role: 'undo'
            },
            {
                label: i18n.__('Redo'),
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Cut'),
                role: 'cut'
            },
            {
                label: i18n.__('Copy'),
                role: 'copy'
            },
            {
                label: i18n.__('Paste'),
                role: 'paste'
            },
            {
                label: i18n.__('Paste And Match Style'),
                role: 'pasteandmatchstyle'
            },
            {
                label: i18n.__('Delete'),
                role: 'delete'
            },
            {
                label: i18n.__('Select All'),
                role: 'selectall'
            }
        ]
    },
    {
        label: i18n.__('Show'),
        submenu: [
            {
                label: i18n.__('Reload'),
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload()
                }
            },
            {
                label: i18n.__('Toggle Developer Tools'),
                role: 'toggledevtools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                },
                visible: true
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Left 1:1 Right'),
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 50, right: 50})
                }
            },
            {
                label: i18n.__('Left 1:2 Right'),
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 33, right: 67})
                }
            },
            {
                label: i18n.__('Left 1:3 Right'),
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 25, right: 75})
                }
            },
            {
                label: i18n.__('Left 2:1 Right'),
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 67, right: 33})
                }
            },
            {
                label: i18n.__('Left 3:1 Right'),
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 75, right: 25})
                }
            },
            {
                label: i18n.__('Hide Editor Pane'),
                click (item, focusedWindow) {
                    setEditorPaneVisibility(focusedWindow, false)
                },
                visible: true
            },
            {
                label: i18n.__('Show Editor Pane'),
                click (item, focusedWindow) {
                    setEditorPaneVisibility(focusedWindow, true)
                },
                visible: false
            },
            {
                label: i18n.__('Hide Preview Pane'),
                click (item, focusedWindow) {
                    setPreviewPaneVisibility(focusedWindow, false)
                },
                visible: true
            },
            {
                label: i18n.__('Show Preview Pane'),
                click (item, focusedWindow) {
                    setPreviewPaneVisibility(focusedWindow, true)
                },
                visible: false
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Reset Zoom'),
                role: 'resetzoom'
            },
            {
                label: i18n.__('Zoom In'),
                role: 'zoomin'
            },
            {
                label: i18n.__('Zoom Out'),
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Toggle Fullsceen'),
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label: i18n.__('Window'),
        role: 'window',
        submenu: [
            {
                label: i18n.__('Minimize'),
                role: 'minimize'
            },
            {
                label: i18n.__('Close'),
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            }
        ]
    },
    {
        label: i18n.__('Help'),
        role: 'help',
        submenu: [
            {
                label: i18n.__('Learn More'),
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
        //label: name,
        submenu: [
            {
                label: i18n.__('About') + ' ' + name,
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Settings'),
                click () {
                    createSettingswindow()
                }
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Services'),
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Hide'),
                role: 'hide'
            },
            {
                label: i18n.__('Hide Others'),
                role: 'hideothers'
            },
            {
                label: i18n.__('Unhide'),
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Quit'),
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
            label: i18n.__('Minimize'),
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: i18n.__('Zoom'),
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: i18n.__('Bring All To Front'),
            role: 'front'
        }
    ]
}

const menu = Menu.buildFromTemplate(template)

function setEditorPaneVisibility(focusedWindow, visible) {
    focusedWindow.webContents.send('show-editor-pane', visible)
    menu.items[3].submenu.items[8].visible = visible
    menu.items[3].submenu.items[9].visible = !visible
    if (!visible && menu.items[3].submenu.items[11].visible) {
        setPreviewPaneVisibility(focusedWindow, true)
    }
}

function setPreviewPaneVisibility(focusedWindow, visible) {
    focusedWindow.webContents.send('show-preview-pane', visible)
    menu.items[3].submenu.items[10].visible = visible
    menu.items[3].submenu.items[11].visible = !visible
    if (!visible && menu.items[3].submenu.items[9].visible) {
        setEditorPaneVisibility(focusedWindow, true)
    }
}

function showPaneVisibility(focusedWindow) {
    setEditorPaneVisibility(focusedWindow, true)
    setPreviewPaneVisibility(focusedWindow, true)
}

Menu.setApplicationMenu(menu)

