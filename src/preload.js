const {
    contextBridge,
    ipcRenderer
} = require('electron');

const validSendChannels = [
    'apply-settings',
    'close-settings-windows',
    'load-settings',
    'save-settings',
    'content-restored',
    'content-stored',
    'read-file',
    'save-file',
    'open-external-url'
];

const validReceiveChannels = [
    'settings-loaded',
    'save-file',
    'read-file',
    'set-layout-columns',
    'show-editor-pane',
    'show-preview-pane',
    'store-content',
    'restore-content',
    'apply-settings',
    'file-read',
];

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        send: (channel, data) => {
            if (validSendChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            } else {
                console.warn('Invalid send channel ' + channel)
            }
        },
        receive: (channel, func) => {
            if (validReceiveChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            } else {
                console.warn('Invalid receive channel ' + channel)
            }
        }
    }
);
