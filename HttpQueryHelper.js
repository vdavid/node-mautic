class HttpQueryHelper {

    /**
     * @param {{method: string, url: string, body: string?}} requestParams
     * @param {string} username
     * @param {string} password
     * @returns {{method: string, url: string, body: string?, headers: {Authorization: string, "Content-Type": string}}}
     */
    addBasicAuthenticationHeader(requestParams, username, password) {
        const base64EncodedUsernameAndPassword = Buffer.from(username + ':' + password).toString('base64');
        return {
            ...requestParams, headers:
                {
                    'Authorization': 'Basic ' + base64EncodedUsernameAndPassword,
                    'Content-Type': 'application/json'
                }
        };
    }

    /**
     * @param {{method: string, url: string, body: string?}} requestParams
     * @param {int} requestTimeoutInMilliseconds
     * @returns {{method: string, url: string, body: string?, timeout: number?}}
     */
    addTimeoutToRequestParameters(requestParams, requestTimeoutInMilliseconds) {
        return requestTimeoutInMilliseconds ? {timeout: requestTimeoutInMilliseconds, ...requestParams} : requestParams;
    }

    /**
     * @param {Object<string, string>?} queryParameters As key-value pairs.
     * @returns {string} The query string, without the question mark.
     */
    convertQueryParametersToString(queryParameters = {}) {
        queryParameters = (queryParameters && (typeof queryParameters === 'object')) ? queryParameters : {};
        return Object.entries(queryParameters).map(([key, value]) => Array.isArray(value) ? value.map(v => key + '[]=' + encodeURIComponent(v)).join('&') : key + '=' + encodeURIComponent(value)).join('&');
    }
    /**
     * In the name, the two instances of the word “query” mean two different things.
     * First: as in HTML’s “query parameters”
     * Second: as in Mautic’s API to query a certain type of objects.
     *
     * @param {Object<string, string>?} queryParameters As key-value pairs.
     * @returns {string} The query string, without the question mark.
     */
    convertQueryParametersToStringForQuery(queryParameters = {}) {
        queryParameters = (queryParameters && (typeof queryParameters === 'object')) ? queryParameters : {};
        return Object.entries(queryParameters).map(([key, value], index) => `where[${index}][col]=${key}&where[${index}][val]=${value}&where[${index}][expr]=eq`).join('&');
    }


    /**
     * @param {Object<string, any>} object
     * @returns {Object<string, any>}
     */
    removeUndefinedValues(object = {}) {
        return Object.entries(object).filter(([, value]) => value !== undefined)
            .reduce((result, [key, value]) => {
                result[key] = value;
                return result;
            }, {});
    }
}

module.exports = HttpQueryHelper;
