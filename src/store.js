"use strict"

const electron = require('electron')
const path = require('path')
const fs = require('fs')

class Store {
    constructor(opts) {
        // renderer has to get `app` module via remote, main gets it directly
        const userDataPath = (electron.app || electron.remote.app).getPath('userData')
        this.path = path.join(userDataPath, opts.configName + '.json')
        this.dir = path.dirname(this.path)
        // create dir
        if (!fs.exists(this.dir)) {
            fs.mkdir(this.dir, 0o755, function () {
            })
        }
        this.data = this.restore(opts.defaults)
        this.changed = {}
    }

    get(key) {
        return this.data[key]
    }

    set(key, val) {
        this.changed[key] = this.data[key]
        this.data[key] = val
    }

    getChanged(key) {
        return this.changed[key]
    }

    restore(defaults) {
        let data = defaults
        try {
            let tempData = JSON.parse(fs.readFileSync(this.path))
            Object.keys( tempData ).forEach( key => {
                data[key] = tempData[key]
            })
        } catch (e) {}
        return data
    }

    store() {
        fs.writeFileSync(this.path, JSON.stringify(this.data))
    }

    sort() {
        const ordered = {}
        const unordered = this.data
        Object.keys(unordered).sort().forEach(function(key) {
            ordered[key] = unordered[key]
        })
        this.data = ordered
    }
}

module.exports = Store

// see: https://raw.githubusercontent.com/ccnokes/electron-tutorials/master/storing-data/store.js
