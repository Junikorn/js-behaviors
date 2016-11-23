'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    window.JS = window.JS || {};

    var connectors = []; //list of all subscribed connectors

    var EventBusConnector = (function () {
        function EventBusConnector(element) {
            _classCallCheck(this, EventBusConnector);

            this.connector = {};
            this.element = element;
        }

        /**
         * `JS.EventBusListenerBehavior` allows to use `$e` property as event bus connecting all listeners.
         * Behavior replaces `<iron-signals>` element functionality without the need of adding any markup to extended elements `<template>`
         *
         * @polymerBehavior JS.EventBusListenerBehavior
         */

        /**
         * @method $e.fire
         */

        _createClass(EventBusConnector, [{
            key: 'fire',
            value: function fire(event, data, triggerSelf) {
                var _this = this;

                connectors.forEach(function (val) {
                    if (val[event] && (triggerSelf || val !== _this.connector)) {
                        val[event].forEach(function (val) {
                            try {
                                val({
                                    type: event,
                                    detail: data,
                                    timeStamp: new Date().getTime(),
                                    srcElement: _this.element
                                });
                            } catch (e) {
                                console.warn(e);
                            }
                        });
                    }
                });
            }

            /**
             * @method $e.addEventListener
             */
        }, {
            key: 'addEventListener',
            value: function addEventListener(event, callback) {
                this.connector[event] = this.connector[event] || [];
                this.connector[event].push(callback);
                return {
                    e: event,
                    c: callback
                };
            }

            /**
             * @method $e.removeEventListener
             */
        }, {
            key: 'removeEventListener',
            value: function removeEventListener(descriptor) {
                var array = this.connector[descriptor.e],
                    index = array.indexOf(descriptor.c);
                array.splice(index, 1);
            }

            /**
             * @method $e.subscribe
             */
        }, {
            key: 'subscribe',
            value: function subscribe() {
                connectors.push(this.connector);
            }

            /**
             * @method $e.unsubscribe
             */
        }, {
            key: 'unsubscribe',
            value: function unsubscribe() {
                connectors.splice(connectors.indexOf(this.connector), 1);
            }

            /**
             * @property $e.subscribed
             */
        }, {
            key: 'subscribed',
            get: function get() {
                return connectors.indexOf(this.connector) > -1;
            }
        }]);

        return EventBusConnector;
    })();

    JS.EventBusListenerBehavior = {
        properties: {
            /**
             * EventBusConnector instance
             *
             * Available methods:
             * - `addEventListener(eventName, callback)` - adds event listener to bus and returns EventListenerDescriptor
             * - `removeEventListener(eventListenerDescriptor)` - removes event listener from bus
             * - `fire(eventName, details, triggerSelf)` - fires event on bus
             * - `unsubscribe()` - unsubscribes from event bus
             * - `subscribe()` - subscribes to event bus
             *
             * You can also check property `subscribed` for current subscription status
             * @default new EventBusConnector()
             */
            $e: {
                type: Object,
                value: function value() {
                    return new EventBusConnector(this);
                }
            }
        },
        attached: function attached() {
            this.$e.subscribe();
        },
        detached: function detached() {
            this.$e.unsubscribe();
        }
    };
})();
//# sourceMappingURL=event-bus-listener-behavior.js.map
