'use strict';

let debug = require('debug')('fastly-api-test');

let apiKey = process.env.FASTLY_KEY;
let service = process.env.FASTLY_SERVICE;

if(!apiKey) {
    return console.log('Cannot start. No FASTLY_KEY passed to ENV');
}

if(!service) {
    return console.log('Cannot start. No FASTLY_SERVICE passed to ENV');
}

let fastly = require('../../lib')({
    apiKey: apiKey,
    service: service
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

        return fastly.purge.url('http://www.example.com/example.jpg', true);
    })
    .catch(err => {
        test.fail(`purge.url failed ${err}`);
    })
    .then(res => {

        test.pass('purge.url ok');
    })
};
