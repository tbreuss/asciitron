"use strict"

const {Menu} = require('electron')
const app = require('electron').app
const dialog = require('electron').dialog
const createSettingsWindow = require('./main').createSettingsWindow

const i18n = new(require('./translations/i18n'))
let currentFilePath = ''

const template = [
    {
        label: i18n.__('File'),
        id: 'file',
        submenu: [
            {
                label: i18n.__('Open'),
                id: 'file-open',
                accelerator: 'CmdOrCtrl+O',
                click (item, focusedWindow) {
                    dialog.showOpenDialog({
                        properties: ['openFile'],
                        filters: [{ name: '*', extensions: ['adoc', 'asciidoc'] }]
                    }).then(result => {
                        if (result.filePaths) {
                            let filePath = result.filePaths[0]
                            currentFilePath = filePath
                            focusedWindow.setTitle(filePath.split('/').pop())
                            focusedWindow.webContents.send('read-file', filePath)
                        }
                    }).catch(err => {
                        console.error(err)
                    });
                }
            },
            {
                label: i18n.__('Save'),
                id: 'file-save',
                accelerator: 'CmdOrCtrl+S',
                click (item, focusedWindow) {
                    if (currentFilePath) {
                        focusedWindow.webContents.send('save-file', currentFilePath)
                        return
                    }
                    dialog.showSaveDialog({
                        filters: [{ name: '*', extensions: ['adoc'] }]
                    }).then(filePath => {
                        currentFilePath = filePath
                        focusedWindow.setTitle(filePath.split('/').pop())
                        focusedWindow.webContents.send('save-file', filePath)
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }
        ]
    },
    {
        label: i18n.__('Edit'),
        id: 'edit',
        submenu: [
            {
                label: i18n.__('Undo'),
                id: 'edit-undo',
                role: 'undo'
            },
            {
                label: i18n.__('Redo'),
                id: 'edit-redo',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Cut'),
                id: 'edit-cut',
                role: 'cut'
            },
            {
                label: i18n.__('Copy'),
                id: 'edit-copy',
                role: 'copy'
            },
            {
                label: i18n.__('Paste'),
                id: 'edit-paste',
                role: 'paste'
            },
            {
                label: i18n.__('Paste And Match Style'),
                id: 'edit-pasteandmatchstyle',
                role: 'pasteandmatchstyle'
            },
            {
                label: i18n.__('Delete'),
                id: 'edit-delete',
                role: 'delete'
            },
            {
                label: i18n.__('Select All'),
                id: 'edit-selectall',
                role: 'selectall'
            }
        ]
    },
    {
        label: i18n.__('Show'),
        id: 'show',
        submenu: [
            {
                label: i18n.__('Reload'),
                id: 'show-reload',
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.webContents.send('store-content', true)
                    }
                }
            },
            {
                label: i18n.__('Toggle Developer Tools'),
                id: 'show-toggledevtools',
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
                id: 'show-left-1-1-right',
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 50, right: 50})
                }
            },
            {
                label: i18n.__('Left 1:2 Right'),
                id: 'show-left-1-2-right',
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 33, right: 67})
                }
            },
            {
                label: i18n.__('Left 1:3 Right'),
                id: 'show-left-1-3-right',
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 25, right: 75})
                }
            },
            {
                label: i18n.__('Left 2:1 Right'),
                id: 'show-left-2-1-right',
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 67, right: 33})
                }
            },
            {
                label: i18n.__('Left 3:1 Right'),
                id: 'show-left-3-1-right',
                click (item, focusedWindow) {
                    showPaneVisibility(focusedWindow)
                    focusedWindow.webContents.send('set-layout-columns', {left: 75, right: 25})
                }
            },
            {
                label: i18n.__('Hide Editor Pane'),
                id: 'show-hide-editor-pane',
                click (item, focusedWindow) {
                    setEditorPaneVisibility(focusedWindow, false)
                },
                visible: true
            },
            {
                label: i18n.__('Show Editor Pane'),
                id: 'show-show-editor-pane',
                click (item, focusedWindow) {
                    setEditorPaneVisibility(focusedWindow, true)
                },
                visible: false
            },
            {
                label: i18n.__('Hide Preview Pane'),
                id: 'show-hide-preview-pane',
                click (item, focusedWindow) {
                    setPreviewPaneVisibility(focusedWindow, false)
                },
                visible: true
            },
            {
                label: i18n.__('Show Preview Pane'),
                id: 'show-show-preview-pane',
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
                id: 'show-resetzoom',
                role: 'resetzoom'
            },
            {
                label: i18n.__('Zoom In'),
                id: 'show-zoomin',
                role: 'zoomin'
            },
            {
                label: i18n.__('Zoom Out'),
                id: 'show-zoomout',
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Toggle Fullsceen'),
                id: 'show-togglefullscreen',
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label: i18n.__('Window'),
        id: 'window',
        role: 'window',
        submenu: [
            {
                label: i18n.__('Minimize'),
                id: 'window-minimize',
                role: 'minimize'
            },
            {
                label: i18n.__('Close'),
                id: 'window-close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            }
        ]
    },
    {
        label: i18n.__('Help'),
        role: 'help',
        id: 'help',
        submenu: [
            {
                label: i18n.__('Learn More'),
                id: 'help-learn-more',
                click () {
                    require('electron').shell.openExternal('http://electron.atom.io')
                }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    const name = app.name
    template.unshift({
        label: name,
        id: 'about',
        submenu: [
            {
                label: i18n.__('About') + ' ' + name,
                id: 'about-asciitron',
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Settings'),
                id: 'about-settings',
                accelerator: process.platform === 'darwin' ? 'Command+,' : 'Ctrl+,',
                click () {
                    createSettingsWindow()
                }
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Services'),
                id: 'about-services',
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Hide'),
                id: 'about-hide',
                role: 'hide'
            },
            {
                label: i18n.__('Hide Others'),
                id: 'about-hideothers',
                role: 'hideothers'
            },
            {
                label: i18n.__('Unhide'),
                id: 'about-unhide',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Quit'),
                id: 'about-quit',
                role: 'quit'
            }
        ]
    })
    // Window menu.
    template[4].submenu = [
        {
            label: i18n.__('Minimize'),
            id: 'window-minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: i18n.__('Zoom'),
            id: 'window-zoom',
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: i18n.__('Bring All To Front'),
            id: 'window-front',
            role: 'front'
        }
    ]
}

const mainMenu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(mainMenu)

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
