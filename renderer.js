// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')
const fs = require('fs')

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
    }, 200)
}

var editor = document.getElementById('editor')

editor.addEventListener('scroll', function (event) {
    // see: http://stackoverflow.com/questions/2481350/how-to-get-scrollbar-position-with-javascript
    var editor = event.srcElement;
    var preview = document.getElementById('preview')
    var editorScrollPosition = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop = editorScrollPosition * (preview.scrollHeight - preview.clientHeight)
})

editor.addEventListener('input', convertAsciidoc)
editor.dispatchEvent(new Event('input'))

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
