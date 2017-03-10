"use strict"

module.exports = {

    // Include CSS file
    addCSS: function(filename) {
        let head = document.getElementsByTagName('head')[0]
        let style = document.createElement('link')
        style.href = filename
        style.type = 'text/css'
        style.rel = 'stylesheet'
        head.append(style)
    }

}
