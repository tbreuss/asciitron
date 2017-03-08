// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')
const fs = require('fs')
const shell = require('electron').shell

if (window.Worker) {
    console.log('WebWorker installed')
}

var delay = (function () {
    var timer = 0
    return function (callback, ms) {
        clearTimeout(timer)
        timer = setTimeout(callback, ms)
    }
})()

var margin = 10
var padding = 10
var pause = 500
var editor = ace.edit("editor")

editor.setOptions({
    // fontSize: 13,
});

editor.$blockScrolling = Infinity
editor.setTheme("ace/theme/twilight")
editor.session.setMode("ace/mode/asciidoc")
editor.session.setUseWrapMode(true)
editor.renderer.setShowGutter(false)
editor.renderer.setPadding(padding)
editor.renderer.setScrollMargin(margin, margin)
editor.renderer.setPrintMarginColumn(false)


editor.session.on('change', function(e) {

    console.log('change')

    delay(function () {

        console.log('delayed')

        var asciidoc = editor.session.getValue()
        var htmldoc = Opal.Asciidoctor.$convert(asciidoc)
        document.getElementById('preview').innerHTML = htmldoc

        var codeBlocks = document.querySelectorAll("pre.highlight code")
        for (var i = 0; i < codeBlocks.length; i++) {
            var block = codeBlocks[i]
            /*if (block.className == '') {
             block.className = 'hljs text'
             }*/
            hljs.highlightBlock(block)
        }

        // Open all links externally
        const links = document.querySelectorAll('#preview a[href]')
        Array.prototype.forEach.call(links, function (link) {
            const url = link.getAttribute('href')
            if (url.indexOf('http') === 0) {
                link.addEventListener('click', function (e) {
                    e.preventDefault()
                    shell.openExternal(url)
                })
            }
        })

    }, pause)
})

editor.session.on('changeScrollTop', function(scrollTop) {
    var lines = editor.session.getScreenLength()
    var scrollHeight = editor.renderer.lineHeight * lines
    var clientHeight = document.querySelector('#editor').clientHeight
    var editorScrollPosition = (scrollTop + margin) / (scrollHeight - clientHeight + (2 * margin))
    var preview = document.getElementById('preview')
    preview.scrollTop = editorScrollPosition * (preview.scrollHeight - preview.clientHeight)
})



// IPC Event Handler

ipcRenderer.on('replace-content', (event, arg) => {
    editor.session.setValue(arg)
})

ipcRenderer.on('save-file', (event, fileName) => {
    if (fileName) {
        var data = editor.session.getValue()
        fs.writeFile(fileName, data, {}, function () {
        })
    }
})

ipcRenderer.on('read-file', (event, fileName) => {
    if (fileName) {
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err) {
                alert("An error ocurred reading the file :" + err.message)
                return
            }
            editor.session.setValue(data)
        })
    }
})

ipcRenderer.on('set-layout-columns', (event, config) => {
    var editor = document.getElementById('editor')
    var preview = document.getElementById('preview')
    editor.style.flexBasis = config.left + '%'
    editor.style.display = 'block'
    preview.style.flexBasis = config.right + '%'
    preview.style.display = 'block'
})

ipcRenderer.on('show-editor-pane', (event, visible) => {
    var editor = document.getElementById('editor')
    if (visible) {
        editor.style.display = 'block'
    } else {
        editor.style.display = 'none'
    }
})

ipcRenderer.on('show-preview-pane', (event, visible) => {
    var editor = document.getElementById('preview')
    if (visible) {
        editor.style.display = 'block'
    } else {
        editor.style.display = 'none'
    }
})
