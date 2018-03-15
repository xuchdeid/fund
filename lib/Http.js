require('http').globalAgent.maxSockets = 10;
const request = require('request');

'use strict';

module.exports = {
    Http: Http
};

function Http(url) {
    this._url = url;
}

Http.prototype.get = function(url, params) {
    let _url = this._url + buildGetRequest(url, params);
    return new Promise((resolve, reject) => {
        request.get(_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(new Error(error));
            }
        });
    });
};

function buildGetRequest(url, params) {
    url += '?';
    let name;
    for (name in params) {
        url += name + '=' + params[name] + '&';
    }
    return url.substr(0, url.length - 1);
}