(function(){
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
        attached(){
            /**
             * Fired when element is attached. Subscribes to parent context
             * @event context-required
             */
            this.fire('context-required', { receiver: this });
            this.$e.addEventListener('context-changed', (e) => {
                if(e.srcElement !== this){
                    this.notifyPath(e.detail.path, e.detail.value);
                }
            });
        },
        _contextChanged(e){
            if(this.$e){
                this.$e.fire('context-changed', { path: e.path, value: e.value });
            }
        }
    };
    JS.ContextReceiverBehavior = [JS.ContextReceiverBehaviorImpl, JS.EventBusListenerBehavior];

})();
