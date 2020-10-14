"use strict"

import asset from '../lib/asset.js'
import util from '../lib/util.js'

const margin = 10
const padding = 10
const editor = ace.edit("editor")
const worker = new Worker('worker.js')

const store = {
    get: () => {},
    getChanged: () => {}
}

// Functions

function applyStoreSettings(settings)
{
    editor.$blockScrolling = Infinity

    editor.session.setMode('ace/mode/asciidoc')
    editor.session.setUseWrapMode(true)
    editor.setTheme(settings['editor.theme'])

    // remove unused editor style and script
    let editorTheme = store.getChanged('editor.theme')
    if (editorTheme && (editorTheme != settings['editor.theme'])) {
        editorTheme = editorTheme.replace('ace/theme/', '')
        let styleId = 'ace-' + editorTheme.replace(/_/g, '-')
        asset.removeStyle(styleId)
        asset.removeStyle(styleId + '-theme')
        let srcSubString = 'theme-' + editorTheme + '.js'
        asset.removeScript(srcSubString)
    }

    editor.renderer.setShowGutter(settings['editor.showGutter'])
    editor.renderer.setShowInvisibles(settings['editor.showInvisibles'])
    editor.renderer.setOptions({
        showGutter: settings['editor.showGutter'],
        showInvisibles: settings['editor.showInvisibles'],
        printMarginColumn: false
    })
    editor.renderer.setPadding(padding)
    editor.renderer.setScrollMargin(margin, margin)

    if (settings['preview.highlightjs'] === true) {
        let href = '../vendor/highlight/styles/' + settings['preview.highlightjs.theme'] + '.css'
        asset.swapCSS('highlight-css', href)
    }
    let href = '../vendor/asciidoctor-stylesheet-factory/stylesheets/' + settings['asciidoctor.theme'] + '.css'
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
                    //shell.openExternal(url)
                })
            }
        })

    }

    var imgs = document.querySelectorAll('#preview img')
    for (var img of imgs) {
        img.onerror = function () {
            img.src = '../assets/img/image-notfound.gif'
        }
    }

}



// IPC Event Handler

window.api.receive('save-file', (fileName) => {
    if (fileName) {
        let data = editor.session.getValue()
        window.api.send('save-file', {path: fileName, data: data})
    }
})

window.api.receive('read-file', (fileName) => {
    window.api.send('read-file', fileName)
})

window.api.receive('file-read', (data) => {
    editor.session.setValue(data)
})

window.api.receive('set-layout-columns', (config) => {
    let editor = document.getElementById('editor')
    let preview = document.getElementById('preview')
    editor.style.flexBasis = config.left + '%'
    editor.style.display = 'block'
    preview.style.flexBasis = config.right + '%'
    preview.style.display = 'block'
})

window.api.receive('show-editor-pane', (visible) => {
    let editor = document.getElementById('editor')
    editor.style.display = visible ? 'block' : 'none'
})

window.api.receive('show-preview-pane', (visible) => {
    let editor = document.getElementById('preview')
    editor.style.display = visible ? 'block': 'none'
})

window.api.receive('store-content', (reload) => {
    localStorage.setItem('content', editor.getValue())
    window.api.send('content-stored', reload)
})

window.api.receive('restore-content', () => {
    let content = localStorage.getItem('content')
    localStorage.removeItem('content')
    if (content === null) {
        content = 'http://asciidoctor.org[*Asciidoctor*] ' +
            'running on http://opalrb.org[_Opal_] ' +
            'brings AsciiDoc to the browser!!'
    }
    editor.session.setValue(content)
    window.api.send('content-restored')
})

window.api.receive('apply-settings', (settings) => {
    applyStoreSettings(settings)
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

window.api.send('apply-settings')
