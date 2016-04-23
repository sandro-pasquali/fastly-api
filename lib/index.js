'use strict';

let Promise = require('bluebird');
let request = require('request');
let _ = require('lodash');
let debug = require('debug')('fastly-api');

module.exports = (opts) => {

    opts = opts || {};

    let apiKey = opts.apiKey;

    delete opts.apiKey;

    opts.endpoint = opts.endpoint || 'https://api.fastly.com';

    opts.callApi = callApi;

    if(!_.isString(opts.endpoint)) {
        throw new Error(`Invalid #endpoint received. Must be String. Got: ${opts.endpoint}`);
    }

    if(!_.isString(opts.service)) {
        throw new Error(`Invalid #service received. Must be String. Got: ${opts.service}`);
    }

    if(!_.isInteger(_.toInteger(opts.version))) {
        throw new Error(`Invalid #version received. Must be Integer. Got: ${opts.version}`);
    }

    return {
        purge : require('./api/purge')(opts)
    };

    function callApi(args) {

        let headers = {
            'fastly-key': apiKey,
            'accept': 'application/vnd.api+json'
        };

        if(args.headers) {
            headers = Object.assign(headers, args.headers);
        }

        debug('call', args.method, args.url, headers);

        return new Promise((resolve, reject) => {
            request({
                method: args.method,
                url: args.url,
                headers: headers,
                form: null
            }, (err, response, body) => {

                if(err) {
                    return reject(new Error(err));
                }

                let statusCode = response.statusCode;

                if(statusCode !== 200) {
                    return reject(new Error(`Failed, status code ${statusCode}`));
                }

                resolve(JSON.parse(body));
            });
        });
    }
};