// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

convertAsciidoc = function(event) {
	var asciidoc = this.innerText;				
	//console.log(asciidoc);
	var html_doc =Opal.Asciidoctor.$convert(asciidoc)
	document.getElementById('preview').innerHTML = html_doc;		
};

var editor = document.getElementById('editor');
editor.addEventListener('input', convertAsciidoc);
editor.dispatchEvent(new Event('input'));

ipcRenderer.on('replace-content', (event, arg) => {  
	var editor = document.getElementById('editor');
	editor.innerText = arg;
	editor.dispatchEvent(new Event('input'));  
})

