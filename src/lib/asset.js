"use strict"

// Include CSS file
function addCSS(id, href) {
    let head = document.getElementsByTagName('head')[0]
    let style = document.createElement('link')
    style.id = id
    style.href = href
    style.type = 'text/css'
    style.rel = 'stylesheet'
    head.append(style)
}

// Swaps CSS file, adds one when not exist
function swapCSS(id, href) {
    let el = document.getElementById(id)
    if (el) {
        el.setAttribute('href', href)
    } else {
        addCSS(id, href)
    }
}

// Removes style by element ID
function removeStyle(id) {
    let style = document.getElementById(id)
    if (style) {
        style.setAttribute('disabled', 'disabled')
        style.remove()
    }
}

// Removes script by source substring
function removeScript(srcSubString) {
    let scripts = document.querySelectorAll('script')
    scripts.forEach((script) => {
        let src = script.getAttribute('src')
        if (src) {
            if (src.indexOf(srcSubString) > -1) {
                script.setAttribute('disabled', 'disabled')
                script.remove()
            }
        }
    })
}

module.exports = {
    addCSS: addCSS,
    swapCSS: swapCSS,
    removeStyle: removeStyle,
    removeScript: removeScript
}
