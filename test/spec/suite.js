'use strict';

let debug = require('debug')('fastly-api-test');
let config = require('config');

let fastly = require('../../lib')({
    apiKey: config.key,
    service: config.service,
    version: config.version
});

module.exports = function(test, Promise) {

    return fastly
    .purge.all()
    .catch(err => {
        test.fail(`purge.all failed ${err}`);
    })
    .then(res => {
        if(res && res.status === 'ok') {
            test.pass('purge.all ok');
        }

        return fastly.purge.url('http://fastboil.com.global.prod.fastly.net/testimage.jpg', true)
        .then(res => {

            test.pass('purge.url ok');
        })
        .catch(err => {
            test.fail(`purge.url failed ${err}`);
        })
    })
};
