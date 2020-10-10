// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict"

const fs = require('fs')
const ipcRenderer = require('electron').ipcRenderer
const shell = require('electron').shell
const store = require('electron').remote.getGlobal('store')
const asset = require('../lib/asset')
const util = require('../lib/util')

let margin = 10
let padding = 10
let editor = ace.edit("editor")
let worker = new Worker('worker.js');


// Functions

function setStoreSettings()
{
    editor.$blockScrolling = Infinity

    editor.session.setMode('ace/mode/asciidoc')
    editor.session.setUseWrapMode(true)
    editor.setTheme(store.get('editor.theme'))

    // remove unused editor style and script
    let editorTheme = store.getChanged('editor.theme')
    if (editorTheme && (editorTheme != store.get('editor.theme'))) {
        editorTheme = editorTheme.replace('ace/theme/', '')
        let styleId = 'ace-' + editorTheme.replace(/_/g, '-');
        asset.removeStyle(styleId)
        asset.removeStyle(styleId + '-theme')
        let srcSubString = 'theme-' + editorTheme + '.js'
        asset.removeScript(srcSubString)
    }

    editor.renderer.setShowGutter(store.get('editor.showGutter'))
    editor.renderer.setShowInvisibles(store.get('editor.showInvisibles'))
    editor.renderer.setOptions({
        showGutter: store.get('editor.showGutter'),
        showInvisibles: store.get('editor.showInvisibles'),
        printMarginColumn: false
    })
    editor.renderer.setPadding(padding)
    editor.renderer.setScrollMargin(margin, margin)

    if (store.get('preview.highlightjs') === true) {
        let href = '../vendor/highlight/styles/' + store.get('preview.highlightjs.theme') + '.css'
        asset.swapCSS('highlight-css', href)
    }
    let href = '../vendor/asciidoctor-stylesheet-factory/stylesheets/' + store.get('asciidoctor.theme') + '.css'
    asset.swapCSS('asciidoctor-css', href)
}


// Worker Event Handler

worker.onmessage = (event) => {

    // Converted data from worker
    document.getElementById('preview').innerHTML = event.data

    if (store.get('preview.highlightjs') === true) {

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

    if (store.get('preview.openLinksInNewWindow') === true) {

        // Open all links externally
        const links = document.querySelectorAll('#preview a[href]')
        links.forEach((link) => {
            const url = link.getAttribute('href')
            if (url.indexOf('http') === 0) {
                link.addEventListener('click', (e) => {
                    e.preventDefault()
                    shell.openExternal(url)
                })
            }
        })

    }

    var imgs = document.querySelectorAll('#preview img');
    for (var img of imgs) {
        img.onerror = function () {
            img.src = '../assets/img/image-notfound.gif'
        }
    }

};


// IPC Event Handler

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

ipcRenderer.on('store-content', (event, reload) => {
    localStorage.setItem('content', editor.getValue())
    event.sender.send('content-stored', reload)
})

ipcRenderer.on('restore-content', (event) => {
    let content = localStorage.getItem('content')
    localStorage.removeItem('content')
    if (content === null) {
        content = 'http://asciidoctor.org[*Asciidoctor*] ' +
            'running on http://opalrb.org[_Opal_] ' +
            'brings AsciiDoc to the browser!!'
    }
    editor.session.setValue(content)
    event.sender.send('content-restored')
})

ipcRenderer.on('apply-store-settings', () => {
    setStoreSettings()
})


// Editor Event Handler

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


setStoreSettings()
