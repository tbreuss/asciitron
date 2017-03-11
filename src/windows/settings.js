"use strict"

const {ipcRenderer} = require('electron')
const store = require('electron').remote.getGlobal('store')

const elements = {
    "asciidoctor.theme": "select",
    "editor.theme": "select",
    "editor.gutter": "checkbox",
    "preview.highlightjs": "checkbox",
    "preview.highlightjs.theme": "select",
    "preview.links_in_new_window": "checkbox"
}

function loadSettings() {
    return new Promise((resolve, reject) => {
        Object.keys(elements).forEach((index) => {
            let element = document.querySelector('[name="' + index + '"]')
            if (!element) {
                reject(Error('Element ' + index + ' not found.'))
            }
            let value = store.get(index)
            switch (elements[index]) {
                case "select":
                    element.options.namedItem(value).selected = true
                    break;
                case "checkbox":
                    element.checked = value || false
                    break;
                default:
                    break;
            }
        })
        resolve()
    })
}

function saveSettings() {
    return new Promise((resolve, reject) => {

        Object.keys(elements).forEach((index) => {
            let element = document.querySelector('[name="' + index + '"]')
            if (!element) {
                reject(Error('Element ' + index + ' not found.'))
            }
            switch (elements[index]) {
                case "select":
                    store.set(index, element.options[element.selectedIndex].getAttribute('name'))
                    break;
                case "checkbox":
                    store.set(index, element.checked)
                    break;
                default:
                    break;
            }
        })

        store.sort()
        store.store()

        resolve()
    })

}

document.querySelector('#cancelButton').addEventListener('click', (e) => {
    e.preventDefault()
    ipcRenderer.send('hide-settings-windows', false)
})

document.querySelector('#saveButton').addEventListener('click', (e) => {
    e.preventDefault()
    saveSettings().then(() => {
        console.log('Settings saved')
        ipcRenderer.send('hide-settings-windows', true)
    }).catch((e) => {
        console.log(e)
    })
})

loadSettings().then(() => {
    console.log('Settings loaded')
}).catch((e) => {
    console.log(e)
})
