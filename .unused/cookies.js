// http://www.2ality.com/2014/09/es6-modules-final.html

const {session} = require('electron')

let url = 'https://www.example.com';

function set(name, value, callback) {
    if (!callback) {
        callback = function() {}
    }
    var cookie = {'url': url, 'name': name, 'value': value}
    session.defaultSession.cookies.set(cookie, callback)
}

function get(name, callback) {

    session.defaultSession.cookies.get({'url': url, 'name': name}, (error, cookies) => {
        if (error === null) {
            callback(cookies[0])
            //console.log(value);
        }
    })
}

module.exports = {
    get: get,
    set: set
};
