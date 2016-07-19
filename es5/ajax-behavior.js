'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
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

    var Request = (function () {
        function Request(options) {
            var _this = this;

            _classCallCheck(this, Request);

            //options processing
            this.url = options.url;
            this.async = typeof options.async !== 'undefined' ? options.async : true;
            this.withCredentials = typeof options.withCredentials !== 'undefined' ? options.withCredentials : true;
            this.method = options.method && options.method.toUpperCase() || 'GET';
            this.params = options.params || {};
            this.body = options.body;
            this.headers = options.headers || {};
            if (this.method !== 'GET') {
                this.headers['Content-Type'] = this.headers['Content-Type'] || (typeof options.body === 'string' ? 'application/x-www-form-urlencoded' : 'application/json');
            }
            this.handleAs = options.handleAs;

            //request construction
            this.promise = new Promise(function (resolve, reject) {
                _this.resolve = resolve;
                _this.reject = reject;
            });
            this.promise.$request = this;
            this.xhr = new XMLHttpRequest();
            this.status = 0;

            var xhr = this.xhr;

            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4 && !_this.aborted) {
                    _this._updateStatus();
                    try {
                        _this.response = _this.parseResponse();
                    } catch (e) {}

                    if (!_this.succeeded) {
                        var error = new Error('The request failed with status code: ' + _this.xhr.status);
                        error.$request = _this;
                        return _this.reject(error);
                    }

                    var response = _this.response || {};
                    Object.defineProperty(response, '$request', {
                        enumerable: false, value: _this
                    });

                    _this.resolve(response);
                }
            });

            xhr.addEventListener('progress', function (progress) {
                _this.progress = {
                    lengthComputable: progress.lengthComputable,
                    loaded: progress.loaded,
                    total: progress.total
                };
            });

            xhr.addEventListener('error', function (error) {
                _this._updateStatus();
                error.$request = _this;
                _this.reject(error);
            });

            xhr.addEventListener('abort', function () {
                _this._updateStatus();
                var error = new Error('Request aborted.');
                error.$request = _this;
                _this.reject(error);
            });

            xhr.open(this.method, this.requestUrl, this.async);

            if (this.headers) {
                Object.keys(this.headers).forEach(function (requestHeader) {
                    xhr.setRequestHeader(requestHeader, _this.headers[requestHeader]);
                });
            }

            var contentType;
            if (this.headers) {
                contentType = this.headers['Content-Type'];
            }
            this.encodedBody = this._encodeBodyObject(this.body, contentType);

            // In IE, `xhr.responseType` is an empty string when the response
            // returns. Hence, caching it as `xhr._responseType`.
            xhr.responseType = xhr._responseType = this.handleAs || 'json';
            xhr.withCredentials = this.withCredentials;
        }

        /**
         * @method $http
         * @param {Object} options
         * @returns {Promise} request promise
         */

        /**
         * Method encoding body based on content type
         * @param {String|Object} body
         * @param {String} contentType
         */

        _createClass(Request, [{
            key: '_encodeBodyObject',
            value: function _encodeBodyObject(body, contentType) {
                if (typeof body === 'string') {
                    return body; // Already encoded.
                }
                var bodyObj = /** @type {Object} */body;
                switch (contentType) {
                    case 'application/json':
                        return JSON.stringify(bodyObj);
                    case 'application/x-www-form-urlencoded':
                        return this._wwwFormUrlEncode(bodyObj);
                }
                return body;
            }

            /**
             * Method updating status of request based on xhr values
             */
        }, {
            key: '_updateStatus',
            value: function _updateStatus() {
                this.status = this.xhr.status;
                this.statusText = typeof this.xhr.statusText === 'undefined' ? '' : this.xhr.statusText;
            }

            /**
             * Method encoding form data object into XHR compatible body string
             * @param {Object} [object] - form data object
             * @returns {String} encoded string
             */
        }, {
            key: '_wwwFormUrlEncode',
            value: function _wwwFormUrlEncode(object) {
                var _this2 = this;

                if (!object) {
                    return '';
                }
                var pieces = [];
                Object.keys(object).forEach(function (key) {
                    pieces.push(_this2._wwwFormUrlEncodePiece(key) + '=' + _this2._wwwFormUrlEncodePiece(object[key]));
                });
                return pieces.join('&');
            }
        }, {
            key: '_wwwFormUrlEncodePiece',
            value: function _wwwFormUrlEncodePiece(str) {
                return encodeURIComponent(str.toString().replace(/\r?\n/g, '\r\n')).replace(/%20/g, '+');
            }

            /**
             * Method aborting request
             */
        }, {
            key: 'abort',
            value: function abort() {
                this.aborted = true;
                this.xhr.abort();
            }

            /**
             * Method triggering XHR send
             * @returns {Promise} request promise
             */
        }, {
            key: 'send',
            value: function send() {
                this.xhr.send(this.encodedBody);
                return this.promise;
            }

            /**
             * Method parsing response. Rejects request if response cannot be  parsed
             * @returns {Object|String} parsed response
             */
        }, {
            key: 'parseResponse',
            value: function parseResponse() {
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
        }, {
            key: 'requestUrl',
            get: function get() {
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
        }, {
            key: 'succeeded',
            get: function get() {
                var status = this.xhr.status || 0;
                // Note: if we are using the file:// protocol, the status code will be 0
                // for all outcomes (successful or otherwise).
                return fileRegex.test(this.url) && status === 0 || status >= 200 && status < 300;
            }
        }]);

        return Request;
    })();

    function ajax(options) {
        /*jshint validthis:true */
        var request = new Request(options),
            promise = request.send();
        if (typeof this !== 'undefined' && this.__isPolymerInstance__) {
            //if called from polymer element scope
            this.fire('request-sent', request);
        }

        ajax.interceptors.forEach(function (interceptor) {
            if (interceptor.res && interceptor.rej || interceptor.res) {
                promise.then(interceptor.res, interceptor.rej);
            } else {
                promise['catch'](interceptor.rej);
            }
        });

        return promise;
    }

    ajax.interceptors = [];

    //utility method
    function prepareOptions(options, body) {
        return typeof options === 'string' ? {
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
    ajax.get = function ajaxGet(options, body) {
        return ajax.call(this, prepareOptions(options, body));
    };

    /**
     * @method $http.post
     * @param {Object|String} options - options hash map or target url
     * @param {Object} [body] - body if options were URL string
     * @returns {Promise} request promise
     */
    ajax.post = function ajaxPost(options, body) {
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
    ajax.put = function ajaxPut(options, body) {
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
    ajax['delete'] = function ajaxDelete(options, body) {
        options = prepareOptions(options, body);
        options.method = 'DELETE';
        return ajax.call(this, options);
    };

    /**
     * @method $http.intercept
     * @param {Function} resolvedInterceptor
     * @param {Function} rejectedInterceptor
     */
    ajax.intercept = function intercept(resolvedInterceptor, rejectedInterceptor) {
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
        attached: function attached() {
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
//# sourceMappingURL=ajax-behavior.js.map
