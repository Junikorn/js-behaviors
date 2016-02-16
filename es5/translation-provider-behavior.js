'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    var langRegExp = /^([A-Za-z]*)-[A-Za-z]*$/gi,
        //regular expression for navigator language descriptors
    i18n = {}; //cache for fetched translations

    /**
     * `JS.TranslationProviderBehavior` allows to use `$t` property as binding provider for translation fetched from json files in i18n directory.
     * It also provides possibility to synchronise translation with children extending `JS.TranslationReceiverBehavior`.
     * If provider is a child of another provider it will treat its translation as a prototype for own translation.
     * Provider synchronises language with `$c.lang` context property therefore it also extends `JS.ContextReceiverBehavior`.
     *
     * Translation files should be named {element.is}\_{ln}-{LN}.json or {element.is}\_{ln}.json.
     * @polymerBehavior JS.TranslationProviderBehavior
     */
    JS.TranslationProviderBehaviorImpl = {
        properties: {
            /**
             * Directory from which the translations will be fetched. If element is extending `JS.Settings{Provider|Receiver}Behavior` it will default to `$s.i18n`.
             * @default 'i18n/'
             */
            $tUrl: {
                type: String
            },
            /**
             * Default language for translation. If element is extending `JS.Settings{Provider|Receiver}Behavior` it will default to `$s.defaultLang`.
             * @default 'en'
             */
            $tDefaultLang: {
                type: String
            },
            _$tBaseListeners: {
                type: Array,
                value: function value() {
                    return [];
                }
            },
            _$tListeners: {
                type: Array,
                value: function value() {
                    return [];
                }
            },
            _$tRequest: {
                type: Object,
                computed: '_$tGetTranslation($c.lang)'
            },
            _$tBase: {
                type: Object,
                value: function value() {
                    return {};
                }
            },
            _$t: Object,
            /**
             * Object containing fetched translation.
             */
            $t: Object
        },
        observers: ['_$tTranslate(_$tBase, _$t)'],
        listeners: {
            'translation-required': '_$tRegisterElement',
            'translation-released': '_$tUnregisterElement'
        },
        ready: function ready() {
            //set initial values
            this.$tDefaultLang = this.$tDefaultLang || this._$tGetDefaultLang();
            this.$tUrl = this.$tUrl || this._$tGetUrl();
        },
        attached: function attached() {
            /**
             * Fired when element is attached. Subscribes base translation to parent provider if exists
             * @event translation-required
             */
            this.fire('translation-required', { base: this });
        },
        detached: function detached() {
            /**
             * Fired when element is detached. Unsubscribes from parent translation provider
             * @event translation-released
             */
            this.fire('translation-released', { base: this });
        },
        //Method computing locales url
        _$tGetUrl: function getUrl() {
            return this.$s && this.$s.i18n || 'i18n/';
        },
        //Method computing default language
        _$tGetDefaultLang: function getDefaultLang() {
            return this.$s && this.$s.defaultLang || 'en';
        },
        //Method registering elements that require translation
        _$tRegisterElement: function registerElement(e) {
            var detail = e.detail,
                element = detail.target || detail.base,
                array = detail.target ? this._$tListeners : this._$tBaseListeners;
            if (element !== this) {
                e.stopPropagation();
                array.push(element);
            }
        },
        //Method unregistering elements that no longer require translation
        _$tUnregisterElement: function unregisterElement(e) {
            var detail = e.detail,
                element = detail.target || detail.base,
                array = detail.target ? this._$tListeners : this._$tBaseListeners,
                index = array.indexOf(element);
            array.splice(index, 1);
        },
        //Method acquiring translation
        _$tGetTranslation: function getTranslation(lang, handleOnFail) {
            var _this = this;

            var descriptor = [this.is, '_', lang].join('');
            if (i18n[descriptor]) {
                return new Promise(function (resolve) {
                    _this.set('_$t', i18n[descriptor]);
                    _this.async(function () {
                        return resolve(i18n[descriptor]);
                    });
                });
            } else {
                return new Promise(function (resolve, reject) {
                    _this.async(function () {
                        _this.$http.get([_this.$tUrl, descriptor, '.json'].join('')).then(function (res) {
                            _this.set('_$t', res);
                            i18n[[_this.is, '_', _this.$c.lang].join('')] = res;
                            resolve(res);
                        }, function () {
                            var match = langRegExp.exec(lang);
                            if (match) {
                                getTranslation.call(_this, match[1]).then(resolve, reject);
                            } else if (!handleOnFail) {
                                getTranslation.call(_this, _this.$tDefaultLang, true).then(resolve, reject);
                            } else {
                                reject(new Error('Failed to load translation file for ' + _this.is));
                            }
                        });
                    });
                });
            }
        },
        //Method performing translation
        _$tTranslate: function translate(_$tBase, _$t) {
            var _this2 = this;

            return new Promise(function (resolve) {
                //constructor for translation object
                function Translation(json) {
                    for (var key in json) {
                        this[key] = json[key];
                    }
                }
                //prototype assignment
                Translation.prototype = _$tBase;
                var translation = new Translation(_$t);
                _this2._$tBaseListeners.forEach(function (val) {
                    val.set('_$tBase', translation);
                });
                _this2._$tListeners.forEach(function (val) {
                    val.set('$t', translation);
                });
                //bind translation
                _this2.set('$t', translation);
                resolve(translation);
            });
        }
    };
    JS.TranslationProviderBehavior = [JS.AjaxBehavior, JS.ContextReceiverBehavior, JS.TranslationProviderBehaviorImpl];
})();
//# sourceMappingURL=translation-provider-behavior.js.map
