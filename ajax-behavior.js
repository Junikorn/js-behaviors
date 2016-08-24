(function(){
    'use strict';

    window.JS = window.JS || {};

    var fileRegex = /^file:\/\//i;

    /**
     * Class providing reasonable XHR handling based on `<iron-request>` with some minor tweaks
     *
     * `<iron-request>` BSD License by Polymer Project Authors:
     * `This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt`
     * `The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt`
     * `The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt`
     *
     * @class Request
     */
    class Request {
        constructor(options) {
            //options processing
            this.url = options.url;
            this.async = (typeof(options.async) !== 'undefined') ? options.async : true;
            this.withCredentials = (typeof(options.withCredentials) !== 'undefined') ?
                options.withCredentials : true;
            this.method = options.method && options.method.toUpperCase() || 'GET';
            this.params = options.params || {};
            this.body = options.body;
            this.headers = options.headers || {};
            if(this.method !== 'GET'){
                this.headers['Content-Type'] = this.headers['Content-Type'] ||
                    (typeof(options.body) === 'string' ? 'application/x-www-form-urlencoded' : 'application/json');
            }
            this.handleAs = options.handleAs;

            //request construction
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
            this.promise.$request = this;
            this.xhr = new XMLHttpRequest();
            this.status = 0;

            var xhr = this.xhr;

            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState === 4 && !this.aborted) {
                    this._updateStatus();
                    try {
                        this.response = this.parseResponse();
                    } catch (e) {}

                    if (!this.succeeded) {
                        var error = new Error('The request failed with status code: ' + this.xhr.status);
                        error.$request = this;
                        return this.reject(error);
                    }

                    var response = this.response || {};
                    Object.defineProperty(response, '$request', {
                        enumerable: false, value: this
                    });

                    this.resolve(response);
                }
            });

            xhr.addEventListener('progress', (progress) => {
                this.progress = {
                    lengthComputable: progress.lengthComputable,
                    loaded: progress.loaded,
                    total: progress.total
                };
                if(typeof(this.onProgress) === 'function'){
                    this.onProgress(this.progress, progress);
                }
            });

            xhr.upload.addEventListener('progress', (progress) => {
                this.uploadProgress = {
                    loaded: progress.loaded,
                    total: progress.total
                };
                if(typeof(this.onUploadProgress) === 'function'){
                    this.onUploadProgress(this.uploadProgress, progress);
                }
            });

            xhr.addEventListener('error', (error) => {
                this._updateStatus();
                error.$request = this;
                this.reject(error);
            });

            xhr.addEventListener('abort', () => {
                this._updateStatus();
                var error = new Error('Request aborted.');
                error.$request = this;
                this.reject(error);
            });

            xhr.open(this.method, this.requestUrl, this.async);

            if (this.headers) {
                Object.keys(this.headers).forEach((requestHeader) => {
                    xhr.setRequestHeader(requestHeader, this.headers[requestHeader]);
                });
            }

            var contentType;
            if (this.headers) {
                contentType = this.headers['Content-Type'];
            }
            this.encodedBody = this._encodeBodyObject(this.body, contentType);

            // In IE, `xhr.responseType` is an empty string when the response
            // returns. Hence, caching it as `xhr._responseType`.
            xhr.responseType = xhr._responseType = (this.handleAs || 'json');
            xhr.withCredentials = this.withCredentials;
        }
        /**
         * Method encoding body based on content type
         * @param {String|Object} body
         * @param {String} contentType
         */
        _encodeBodyObject(body, contentType) {
            if(typeof body === 'string') {
                return body;  // Already encoded.
            }
            var bodyObj = /** @type {Object} */ (body);
            switch (contentType) {
                case('application/json'):
                    return JSON.stringify(bodyObj);
                case('application/x-www-form-urlencoded'):
                    return this._wwwFormUrlEncode(bodyObj);
            }
            return body;
        }
        /**
         * Method updating status of request based on xhr values
         */
        _updateStatus() {
            this.status = this.xhr.status;
            this.statusText = (typeof(this.xhr.statusText) === 'undefined') ? '' : this.xhr.statusText;
        }
        /**
         * Method encoding form data object into XHR compatible body string
         * @param {Object} [object] - form data object
         * @returns {String} encoded string
         */
        _wwwFormUrlEncode(object) {
            if (!object) {
                return '';
            }
            var pieces = [];
            Object.keys(object).forEach((key) => {
                pieces.push(this._wwwFormUrlEncodePiece(key) + '=' + this._wwwFormUrlEncodePiece(object[key]));
            });
            return pieces.join('&');
        }
        _wwwFormUrlEncodePiece(str) {
            return encodeURIComponent(str.toString().replace(/\r?\n/g, '\r\n')).replace(/%20/g, '+');
        }
        /**
         * Method aborting request
         */
        abort() {
            this.aborted = true;
            this.xhr.abort();
        }
        /**
         * Method triggering XHR send
         * @returns {Promise} request promise
         */
        send() {
            this.xhr.send(this.encodedBody);
            return this.promise;
        }
        /**
         * Method parsing response. Rejects request if response cannot be  parsed
         * @returns {Object|String} parsed response
         */
        parseResponse() {
            var xhr = this.xhr;
            var responseType = this.xhr.responseType || this.xhr._responseType;
            // If we don't have a natural `xhr.responseType`, we prefer parsing
            // `xhr.responseText` over returning `xhr.response`..
            var preferResponseText = !this.xhr.responseType;

            try {
                switch (responseType) {
                    case 'json':
                        // If xhr.response is undefined, responseType `json` may
                        // not be supported.
                        if (preferResponseText || xhr.response === undefined) {
                            // If accessing `xhr.responseText` throws, responseType `json`
                            // is supported and the result is rightly `undefined`.
                            try {
                                /* jshint ignore:start */
                                xhr.responseText;
                                /* jshint ignore:end */
                            } catch (e) {
                                return xhr.response;
                            }

                            // Otherwise, attempt to parse `xhr.responseText` as JSON.
                            if (xhr.responseText) {
                                return JSON.parse(xhr.responseText);
                            }
                        }

                        return xhr.response;
                    case 'xml':
                        return xhr.responseXML;
                    case 'blob':
                    case 'document':
                    case 'arraybuffer':
                        return xhr.response;
                    case 'text':
                        return xhr.responseText;
                    default:
                        return xhr.responseText;
                }
            } catch (e) {
                this.reject(new Error('Could not parse response. ' + e.message));
            }
        }
        /**
         * Getter creating query string from request params
         * @returns {String} request URL with query string
         **/
        get requestUrl() {
            var queryParts = [],
                param,
                value;

            for (param in this.params) {
                if (this.params.hasOwnProperty(param)) {
                    value = this.params[param];
                    param = window.encodeURIComponent(param);
                    if (value !== null) {
                        param += '=' + window.encodeURIComponent(value);
                    }
                    queryParts.push(param);
                }
            }

            return this.url + (queryParts.length ? '?' + queryParts.join('&') : '');
        }
        /**
         * Getter checking if request succeeded
         * @returns {Boolean} succeeded
         */
        get succeeded() {
            var status = this.xhr.status || 0;
            // Note: if we are using the file:// protocol, the status code will be 0
            // for all outcomes (successful or otherwise).
            return (fileRegex.test(this.url) && status === 0) || (status >= 200 && status < 300);
        }
    }

    /**
     * @method $http
     * @param {Object} options
     * @returns {Promise} request promise
     */
    function ajax(options){
        /*jshint validthis:true */
        var request = new Request(options),
            promise = request.send();
        if(typeof(this) !== 'undefined' && this.__isPolymerInstance__){ //if called from polymer element scope
            this.fire('request-sent', request);
        }

        ajax.interceptors.forEach((interceptor) => {
            if(interceptor.res && interceptor.rej || interceptor.res){
                promise.then(interceptor.res, interceptor.rej);
            }else{
                promise.catch(interceptor.rej);
            }
        });

        return promise;
    }

    ajax.interceptors = [];

    //utility method
    function prepareOptions(options, body){
        return (typeof(options) === 'string') ? {
            url: options,
            body: body
        } : options;
    }

    //shortcut methods
    /**
     * @method $http.get
     * @param {Object|String} options - options hash map or target url
     * @param {Object} [body] - body if options were URL string
     * @returns {Promise} request promise
     */
    ajax.get = function ajaxGet(options, body){
        return ajax.call(this, prepareOptions(options, body));
    };

    /**
     * @method $http.post
     * @param {Object|String} options - options hash map or target url
     * @param {Object} [body] - body if options were URL string
     * @returns {Promise} request promise
     */
    ajax.post = function ajaxPost(options, body){
        options = prepareOptions(options, body);
        options.method = 'POST';
        return ajax.call(this, options);
    };

    /**
     * @method $http.put
     * @param {Object|String} options - options hash map or target url
     * @param {Object} [body] - body if options were URL string
     * @returns {Promise} request promise
     */
    ajax.put = function ajaxPut(options, body){
        options = prepareOptions(options, body);
        options.method = 'PUT';
        return ajax.call(this, options);
    };

    /**
     * @method $http.delete
     * @param {Object|String} options - options hash map or target url
     * @param {Object} [body] - body if options were URL string
     * @returns {Promise} request promise
     */
    ajax['delete'] = function ajaxDelete(options, body){
        options = prepareOptions(options, body);
        options.method = 'DELETE';
        return ajax.call(this, options);
    };

    /**
     * @method $http.intercept
     * @param {Function} resolvedInterceptor
     * @param {Function} rejectedInterceptor
     */
    ajax.intercept = function intercept(resolvedInterceptor, rejectedInterceptor){
        ajax.interceptors.push({
            res: resolvedInterceptor,
            rej: rejectedInterceptor
        });
    };

    /**
     * `JS.AjaxBehavior` allows to send requests with ajax without using elements declared in template such as `<iron-ajax>`.
     * It provides $http method returning request Promise and 4 shortcut methods for all http methods.
     *
     * @polymerBehavior JS.AjaxBehavior
     */
    JS.AjaxBehavior = {
        attached(){
            this.$http = ajax;
        },
        /**
         * Method performing ajax request based on passed configuration. Returns request Promise
         *
         * Options that can be passed:
         * - `{String} url`
         * - `{Object|String} body`
         * - `{String} [method='GET']`
         * - `{Object} [headers]`
         * - `{Object} [params]`
         * - `{Boolean} [async=true]`
         * - `{Boolean} [withCredentials=true]`
         * - `{String} [handleAs='json']`
         *
         * You can also use it through shortcut methods:
         * - `$http.get(options|url, [body])`
         * - `$http.post(options|url, [body])`
         * - `$http.put(options|url, [body])`
         * - `$http.delete(options|url, [body])`
         *
         * The shortcut methods write selected method into options and allow to use shorter form of call with default parameters `$http.{method}(url, body)`
         *
         * @param {Object} options
         * @param {String} options.url
         * @param {Object|String} options.body
         * @param {String} [options.method='GET'] - GET, POST, PUT or DELETE
         * @param {Object} [options.headers]
         * @param {Object} [options.params]
         * @param {Boolean} [options.async=true] - if call has to be async (true by default)
         * @param {Boolean} [options.withCredentials=true]
         * @param {String} [options.handleAs='json']
         * @returns {Promise} request promise
         **/
        $http: ajax
        /**
         * Fired when XHR request is sent
         * @event request-sent
         */
    };

})();
