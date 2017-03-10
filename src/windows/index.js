// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict"

const {ipcRenderer} = require('electron')
const fs = require('fs')
const shell = require('electron').shell
const store = require('electron').remote.getGlobal('store')
const asset = require('../lib/asset')
const util = require('../lib/util')

let margin = 10
let padding = 10
let editor = ace.edit("editor")
let worker = new Worker('worker.js');


worker.onmessage = (event) => {

    // Converted data from worker
    document.getElementById('preview').innerHTML = event.data

    if (store.get('preview.highlightjs') === true) {

        //console.log('preview.highlightjs')

        asset.addCSS('../vendor/highlight/styles/' + store.get('preview.highlightjs.theme') + '.css')

        // Highlight JS
        let codeBlocks = document.querySelectorAll("pre.highlight code")
        for (let i = 0; i < codeBlocks.length; i++) {
            let block = codeBlocks[i]
            /*if (block.className == '') {
             block.className = 'hljs text'
             }*/
            hljs.highlightBlock(block)
        }

    }

    if (store.get('preview.links_in_new_window') === true) {

        // Open all links externally
        const links = document.querySelectorAll('#preview a[href]')
        Array.prototype.forEach.call(links, (link) => {
            const url = link.getAttribute('href')
            if (url.indexOf('http') === 0) {
                link.addEventListener('click', (e) => {
                    e.preventDefault()
                    shell.openExternal(url)
                })
            }
        })

    }

};


editor.$blockScrolling = Infinity
editor.setTheme(store.get('editor.theme'))
editor.session.setMode('ace/mode/asciidoc')
editor.session.setUseWrapMode(true)
editor.renderer.setShowGutter(store.get('editor.gutter'))
editor.renderer.setPadding(padding)
editor.renderer.setScrollMargin(margin, margin)
editor.renderer.setPrintMarginColumn(false)


editor.session.on('change', () => {
    util.wait(() => {
        let asciidoc = editor.session.getValue()
        worker.postMessage([asciidoc])
    }, 500)
})

editor.session.on('changeScrollTop', (scrollTop) => {
    let lines = editor.session.getScreenLength()
    let scrollHeight = editor.renderer.lineHeight * lines
    let clientHeight = document.querySelector('#editor').clientHeight
    let editorScrollPosition = (scrollTop + margin) / (scrollHeight - clientHeight + (2 * margin))
    let preview = document.getElementById('preview')
    preview.scrollTop = editorScrollPosition * (preview.scrollHeight - preview.clientHeight)
})


// IPC Event Handler

ipcRenderer.on('replace-content', (event, arg) => {
    editor.session.setValue(arg)
})

ipcRenderer.on('save-file', (event, fileName) => {
    if (fileName) {
        let data = editor.session.getValue()
        fs.writeFile(fileName, data, {}, () => {
        })
    }
})

ipcRenderer.on('read-file', (event, fileName) => {
    if (fileName) {
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                alert("An error ocurred reading the file :" + err.message)
                return
            }
            editor.session.setValue(data)
        })
    }
})

ipcRenderer.on('set-layout-columns', (event, config) => {
    let editor = document.getElementById('editor')
    let preview = document.getElementById('preview')
    editor.style.flexBasis = config.left + '%'
    editor.style.display = 'block'
    preview.style.flexBasis = config.right + '%'
    preview.style.display = 'block'
})

ipcRenderer.on('show-editor-pane', (event, visible) => {
    let editor = document.getElementById('editor')
    editor.style.display = visible ? 'block' : 'none'
})

ipcRenderer.on('show-preview-pane', (event, visible) => {
    let editor = document.getElementById('preview')
    editor.style.display = visible ? 'block': 'none'
})
