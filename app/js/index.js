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

        var codeBlocks = document.querySelectorAll("pre.highlight code");
        for (var i = 0; i < codeBlocks.length; i++) {
            var block = codeBlocks[i];
            /*if (block.className == '') {
                block.className = 'hljs text';
            }*/
            hljs.highlightBlock(block);
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

    }, 200)
}

var editor = document.getElementById('editor')

editor.addEventListener('paste', function (event) {

    // cancel paste
    event.preventDefault();

    // get text representation of clipboard
    var text = event.clipboardData.getData("text/plain");

    // insert text manually
    document.execCommand("inserttext", false, text);
})

editor.addEventListener('scroll', function (event) {
    // see: http://stackoverflow.com/questions/2481350/how-to-get-scrollbar-position-with-javascript
    var editor = event.srcElement
    var preview = document.getElementById('preview')
    var editorScrollPosition = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
    preview.scrollTop = editorScrollPosition * (preview.scrollHeight - preview.clientHeight)
})

editor.addEventListener('keydown', function(e){
    if (e.shiftKey && e.keyCode==9) {
        //document.execCommand('outdent',true,null);
        e.preventDefault();
        return
    }
    if(e.keyCode==9){
        //document.execCommand('styleWithCSS', true, null);
        //document.execCommand('indent', true, null);
        //document.execCommand('insertHTML', false, '&#009');
        e.preventDefault();
        return
    }
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
            var editor = document.getElementById('editor')
            editor.innerText = data
            editor.dispatchEvent(new Event('input'))
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
