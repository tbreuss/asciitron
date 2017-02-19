// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')
const fs = require('fs')
const shell = require('electron').shell

var delay = (function () {
    var timer = 0
    return function (callback, ms) {
        clearTimeout(timer)
        timer = setTimeout(callback, ms)
    }
})()

var convertAsciidoc = function (event) {
    var $this = this
    delay(function () {
        var asciidoc = $this.innerText
        var htmldoc = Opal.Asciidoctor.$convert(asciidoc)
        document.getElementById('preview').innerHTML = htmldoc

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

    }, 200)
}

var editor = document.getElementById('editor')

editor.addEventListener('scroll', function (event) {
    // see: http://stackoverflow.com/questions/2481350/how-to-get-scrollbar-position-with-javascript
    var editor = event.srcElement
    var preview = document.getElementById('preview')
    var editorScrollPosition = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
    preview.scrollTop = editorScrollPosition * (preview.scrollHeight - preview.clientHeight)
})

editor.addEventListener('input', convertAsciidoc)
editor.dispatchEvent(new Event('input'))



// IPC Event Handler

ipcRenderer.on('replace-content', (event, arg) => {
    var editor = document.getElementById('editor')
    editor.innerText = arg
    editor.dispatchEvent(new Event('input'))
})

ipcRenderer.on('save-file', (event, fileName) => {
    if (fileName) {
        var data = document.getElementById('editor').innerText
        fs.writeFile(fileName, data, {}, function () {
            alert('Datei wurde gespeichert.')
        })
    } else {
        console.log("No file selected")
    }
})

ipcRenderer.on('read-file', (event, filePaths) => {
    if (filePaths) {
        fs.readFile(filePaths[0], 'utf-8', function (err, data) {
            if (err) {
                alert("An error ocurred reading the file :" + err.message)
                return
            }
            var editor = document.getElementById('editor')
            editor.innerText = data
            editor.dispatchEvent(new Event('input'))
        })
    } else {
        console.log("No file selected")
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

ipcRenderer.on('toggle-preview-pane', (event) => {
    var editor = document.getElementById('preview')
    if (editor.style.display === 'none') {
        editor.style.display = 'block'
    } else {
        editor.style.display = 'none'
    }
})

ipcRenderer.on('toggle-editor-pane', (event) => {
    var editor = document.getElementById('editor')
    if (editor.style.display === 'none') {
        editor.style.display = 'block'
    } else {
        editor.style.display = 'none'
    }
})
