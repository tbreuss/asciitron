"use strict"

const {ipcRenderer} = require('electron')
const store = require('electron').remote.getGlobal('store')

const elements = {
    "asciidoctor.theme": "select",
    "editor.theme": "select",
    "editor.showGutter": "checkbox",
    "editor.showInvisibles": "checkbox",
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


document.querySelector('#closeButton').addEventListener('click', (e) => {
    e.preventDefault()
    ipcRenderer.send('close-settings-windows', false)
})

document.querySelectorAll('form select, form input').forEach((el) => {
    el.addEventListener('change', (e) => {
        saveSettings().then(() => {
            console.log('Settings saved')
            ipcRenderer.send('apply-store-settings')
        }).catch((e) => {
            console.log(e)
        })
    })
})


loadSettings().then(() => {
    console.log('Settings loaded')
}).catch((e) => {
    console.log(e)
})
