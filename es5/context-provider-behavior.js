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
    JS.ContextProviderBehavior = [JS.ContextProviderBehaviorImpl, JS.ContextReceiverBehaviorImpl, JS.EventBusListenerBehavior];
})();
//# sourceMappingURL=context-provider-behavior.js.map
