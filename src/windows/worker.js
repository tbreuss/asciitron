"use strict"

importScripts(['../vendor/asciidoctor.js/asciidoctor-all.min.js'])

onmessage = (e) => {
    let htmldoc = Opal.Asciidoctor.$convert(e.data[0])
    postMessage(htmldoc);
}
