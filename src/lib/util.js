'use strict'

export default {

    wait: (function () {
        let timer = 0
        return function (callback, ms) {
            clearTimeout(timer)
            timer = setTimeout(callback, ms)
        }
    })()

}
