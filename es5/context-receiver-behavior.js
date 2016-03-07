'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.ContextReceiverBehavior` allows to synchronise element with context (`$c`) provided by parent element extending `JS.ContextProviderBehavior`
     *
     * @polymerBehavior JS.ContextReceiverBehavior
     */
    JS.ContextReceiverBehaviorImpl = {
        properties: {
            /**
             * Synchronised context object
             *
             * Available methods:
             * - `set(path, value)` - set context path value & trigger change notification on all subscribed elements
             * - `notifyPath(path, value)` - trigger path change notification on all subscribed elements
             */
            $c: Object
        },
        observers: ['_contextChanged($c.*)'],
        attached: function attached() {
            var _this = this;

            /**
             * Fired when element is attached. Subscribes to parent context
             * @event context-required
             */
            this.fire('context-required', { receiver: this });
            this.$e.addEventListener('context-changed', function (e) {
                if (e.srcElement !== _this) {
                    _this.notifyPath(e.detail.path, e.detail.value);
                }
            });
        },
        _contextChanged: function _contextChanged(e) {
            if (this.$e) {
                this.$e.fire('context-changed', { path: e.path, value: e.value });
            }
        }
    };
    JS.ContextReceiverBehavior = [JS.ContextReceiverBehaviorImpl, JS.EventBusListenerBehavior];
})();
//# sourceMappingURL=context-receiver-behavior.js.map
