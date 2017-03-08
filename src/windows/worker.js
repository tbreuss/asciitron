importScripts(['../vendor/asciidoctor.js/asciidoctor-all.min.js'])

onmessage = function(e) {
    let htmldoc = Opal.Asciidoctor.$convert(e.data[0])
    postMessage(htmldoc);
}
