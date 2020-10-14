'use strict'

const api = window.api || {}

const elements = {
    'asciidoctor.theme': 'select',
    'editor.theme': 'select',
    'editor.showGutter': 'checkbox',
    'editor.showInvisibles': 'checkbox',
    'preview.highlightjs': 'checkbox',
    'preview.highlightjs.theme': 'select',
    'preview.openLinksInNewWindow': 'checkbox'
}

function loadSettings(settings) {
    return new Promise((resolve, reject) => {
        Object.keys(elements).forEach((index) => {
            let element = document.querySelector('[name="' + index + '"]')
            if (!element) {
                reject(Error('Element ' + index + ' not found.'))
            }
            let value = settings[index]
            switch (elements[index]) {
                case 'select':
                    element.options.namedItem(value).selected = true
                    break
                case 'checkbox':
                    element.checked = value || false
                    break
                default:
                    break
            }
        })
        resolve()
    })
}

function saveSettings() {
    return new Promise((resolve, reject) => {
        let settings = {}
        Object.keys(elements).forEach((index) => {
            let element = document.querySelector('[name="' + index + '"]')
            if (!element) {
                reject(Error('Element ' + index + ' not found.'))
            }
            switch (elements[index]) {
                case 'select':
                    settings[index] = element.options[element.selectedIndex].getAttribute('name')
                    break
                case 'checkbox':
                    settings[index] = element.checked
                    break
                default:
                    break
            }
        })
        resolve(settings)
    })

}

document.querySelector('#closeButton').addEventListener('click', (e) => {
    e.preventDefault()
    api.send('close-settings-windows')
})

document.querySelectorAll('form select, form input').forEach((el) => {
    el.addEventListener('change', (e) => {
        saveSettings().then((settings) => {
            api.send('save-settings', settings)
        })
    })
})

api.receive('settings-loaded', (data) => {
    loadSettings(data)
})

api.send('load-settings')
