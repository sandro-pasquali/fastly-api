'use strict';

module.exports = (opts) => {

    opts = opts || {};

    let endpoint = opts.endpoint;
    let callApi = opts.callApi;
    let service = opts.service;

    return {
        url : purge_url,
        all : purge_all,
        key : purge_key
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

}