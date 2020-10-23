"use strict"

import asset from '../lib/asset.js'
import util from '../lib/util.js'

const margin = 10
const padding = 10
const editor = ace.edit("editor")
const worker = new Worker('worker.js')
let localSettings = {}


// Functions

function handleClickedLinks(event) {
    event.preventDefault()
    const link = event.target.closest('a');
    if (!link) {
        return
    }
    if (!('preview.openLinksInNewWindow' in localSettings)) {
        return
    }
    if (localSettings['preview.openLinksInNewWindow'] === true) {
        link.setAttribute('target', '_blank')
        const href = link.getAttribute('href')
        if (href.indexOf('http') === 0) {
            window.api.send('open-external-url', href);
        }
    }
}

function applyStoreSettings(settings) {
    editor.$blockScrolling = Infinity

    editor.session.setMode('ace/mode/asciidoc')
    editor.session.setUseWrapMode(true)
    editor.setTheme(settings['editor.theme'])

    /*
    // remove unused editor style and script
    let editorTheme = store.getChanged('editor.theme')
    if (editorTheme && (editorTheme != settings['editor.theme'])) {
        editorTheme = editorTheme.replace('ace/theme/', '')
        const styleId = 'ace-' + editorTheme.replace(/_/g, '-')
        asset.removeStyle(styleId)
        asset.removeStyle(styleId + '-theme')
        const srcSubString = 'theme-' + editorTheme + '.js'
        asset.removeScript(srcSubString)
    }
    */

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
        const href = '../vendor/highlight/styles/' + settings['preview.highlightjs.theme'] + '.css'
        asset.swapCSS('highlight-css', href)
    }
    const href = '../vendor/asciidoctor-stylesheet-factory/stylesheets/' + settings['asciidoctor.theme'] + '.css'
    asset.swapCSS('asciidoctor-css', href)
}

function highlightBlocks(selector) {
    const codeBlocks = document.querySelectorAll(selector)
    for (let i = 0; i < codeBlocks.length; i++) {
        const block = codeBlocks[i]
        /*if (block.className == '') {
         block.className = 'hljs text'
         }*/
        hljs.highlightBlock(block)
    }
}

function handleNotFoundImages(selector) {
    const images = document.querySelectorAll(selector)
    for (const image of images) {
        image.onerror = function () {
            image.src = '../assets/img/image-notfound.gif'
        }
    }
}


// Worker Event Handler

worker.onmessage = (event) => {

    // Converted data from worker
    document.getElementById('preview').innerHTML = event.data

    if (typeof localSettings['preview.highlightjs'] !== 'undefined') {
        if (localSettings['preview.highlightjs'] === true) {
            highlightBlocks("pre.highlight code")
        }
    }

    handleNotFoundImages('#preview img')
}


// IPC Event Handler

window.api.receive('save-file', (fileName) => {
    const data = editor.session.getValue()
    window.api.send('save-file', {path: fileName, data: data})
})

window.api.receive('read-file', (fileName) => {
    window.api.send('read-file', fileName)
})

window.api.receive('file-read', (data) => {
    editor.session.setValue(data)
})

window.api.receive('set-layout-columns', (config) => {
    const editor = document.getElementById('editor')
    const preview = document.getElementById('preview')
    editor.style.flexBasis = config.left + '%'
    editor.style.display = 'block'
    preview.style.flexBasis = config.right + '%'
    preview.style.display = 'block'
})

window.api.receive('show-editor-pane', (visible) => {
    const editor = document.getElementById('editor')
    editor.style.display = visible ? 'block' : 'none'
})

window.api.receive('show-preview-pane', (visible) => {
    const editor = document.getElementById('preview')
    editor.style.display = visible ? 'block' : 'none'
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
    localSettings = settings
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
    const screenLength = editor.session.getScreenLength()
    const scrollHeight = editor.renderer.lineHeight * screenLength
    const clientHeight = document.querySelector('#editor').clientHeight
    const editorScrollPosition = (scrollTop + margin) / (scrollHeight - clientHeight + (2 * margin))
    const preview = document.getElementById('preview')
    preview.scrollTop = editorScrollPosition * (preview.scrollHeight - preview.clientHeight)
})


// Preview event handlers

const preview = document.querySelector('#preview')
if (preview) {
    preview.addEventListener('click', handleClickedLinks)
}

window.api.send('apply-settings')
