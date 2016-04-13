'use strict';

let Promise = require('bluebird');
let request = require('request');
let _ = require('lodash');
let debug = require('debug')('fastly-api');

module.exports = (opts) => {

    opts = opts || {};

    let apiKey = opts.apiKey;
    let endpoint = opts.endpoint || 'https://api.fastly.com';
    let service = opts.service;

    return {
        purge : {
            url : purge_url,
            all : purge_all,
            key : purge_key
        }
    };

    function purge_key(key, soft) {

        return callApi({
            method: 'POST',
            url: `${endpoint}/service/${service}/purge/${key}`,
            headers: soft ? {
                'Fastly-Soft-Purge': 1
            } : {}
        });
    }

    function purge_all() {

        return callApi({
            method: 'POST',
            url: `${endpoint}/service/${service}/purge_all`
        });
    }

    function purge_url(url, soft) {
        return callApi({
            method: 'PURGE',
            url: url,
            headers: soft ? {
                'Fastly-Soft-Purge': 1
            } : {}
        })
    }

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