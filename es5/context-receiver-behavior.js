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
            $c: Object,
            _$cChanges: {
                type: Array,
                value: function value() {
                    return [];
                }
            },
            _$cListener: Object
        },
        observers: ['_$cContextChanged($c.*)'],
        attached: function attached() {
            var _this = this;

            /**
             * Fired when element is attached. Subscribes to parent context
             * @event context-required
             */
            this.fire('context-required', { receiver: this });
            this._$cListener = this.$e.addEventListener('context-changed', function (e) {
                _this._$cChanges.push(e.detail);
                _this.notifyPath(e.detail.path, e.detail.value);
            });
        },
        detached: function detached() {
            this.$e.removeEventListener(this._$cListener);
        },
        _$cContextChanged: function _$cContextChanged(e) {
            if (this.$e) {
                var externalChanges = this._$cChanges,
                    externalChange = this._$cChanges.find(function (change) {
                    return change.path === e.path && change.value === e.value;
                });
                if (!externalChange) {
                    this.$e.fire('context-changed', { path: e.path, value: e.value });
                } else {
                    externalChanges.splice(externalChanges.indexOf(externalChange), 1);
                }
            }
        }
    };
    JS.ContextReceiverBehavior = [JS.ContextReceiverBehaviorImpl, JS.EventBusListenerBehavior];
})();
//# sourceMappingURL=context-receiver-behavior.js.map
