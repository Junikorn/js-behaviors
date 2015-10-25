'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.ContextProviderBehavior` allows to synchronise elements context (`$c`) with all of it's children extending `JS.ContextReceiverBehavior`
     *
     * @polymerBehavior JS.ContextProviderBehavior
     */
    JS.ContextProviderBehaviorImpl = {
        properties: {
            /**
             * Synchronised context object (you can initialize it yourself with default values)
             *
             * Available methods:
             * - `set(path, value)` - set context path value & trigger change notification on all subscribed elements
             * - `notifyPath(path, value)` - trigger path change notification on all subscribed elements
             */
            $c: {
                type: Object,
                value: function value() {
                    return {};
                }
            }
        },
        listeners: {
            'context-required': '_attachContext'
        },
        attached: function attached() {
            if (!this.$c.set) {
                Object.defineProperties(this.$c, {
                    'set': {
                        enumerable: false, value: (function set(path, value, context) {
                            this.set('$c.' + path, value);
                            (context || this).$e.fire('context-changed', { path: path, value: value });
                        }).bind(this)
                    },
                    notifyPath: {
                        enumerable: false, value: (function notifyPath(path, value, context) {
                            this.notifyPath('$c.' + path, value);
                            (context || this).$e.fire('context-changed', { path: path, value: value });
                        }).bind(this)
                    }
                });
            }
        },
        /**
         * Method attaching context to listening child element
         * @listens context-required
         */
        _attachContext: function _attachContext(e) {
            if (e.detail.receiver !== this) {
                e.stopPropagation();
                e.detail.receiver.set('$c', this.$c);
            }
        }
    };
    JS.ContextProviderBehavior = [JS.ContextProviderBehaviorImpl, JS.EventBusListenerBehavior];
})();
//# sourceMappingURL=context-provider-behavior.js.map
