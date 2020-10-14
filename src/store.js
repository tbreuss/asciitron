'use strict'

const {app} = require('electron')
const path = require('path')
const fs = require('fs')

function defaults() {
    return {
        'asciidoctor.theme': 'asciidoctor',
        'editor.theme': 'ace/theme/twilight',
        'editor.showGutter': false,
        'editor.showInvisibles': false,
        'preview.highlightjs': true,
        'preview.highlightjs.theme': 'default',
        'preview.openLinksInNewWindow': true,
        'window.height': 600,
        'window.width': 800,
        'window.x': 1,
        'window.y': 1,
    }
}

function getPath()
{
    const userDataPath = app.getPath('userData')
    return path.join(userDataPath, 'user-preferences.json')
}

function sort(data) {
    const ordered = {}
    Object.keys(data).sort().forEach(function(key) {
        ordered[key] = data[key]
    })
    return ordered
}

function read() {
    let path = getPath()
    return readInternal(path)
}

function readInternal(filePath) {
    let data = defaults()
    try {
        let tempData = JSON.parse(fs.readFileSync(filePath))
        Object.keys( tempData ).forEach( key => {
            data[key] = tempData[key]
        })
    } catch (e) {
        // handle error
    }
    return sort(data)
}

function write(data) {
    let path = getPath()
    writeInternal(path, data)
}

function writeInternal(filePath, data) {
    makeDir(filePath)
    data = Object.assign(read(filePath), data)
    data = sort(data)
    fs.writeFileSync(filePath, JSON.stringify(data))
}

function makeDir(filePath) {
    let dir = path.dirname(filePath)
    // create dir
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0o755)
    }
}

module.exports = {
    write: write,
    read: read
}
