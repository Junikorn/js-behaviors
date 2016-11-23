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
            $c: Object,
            _$cChanges: {
                type: Array,
                value: () => []
            },
            _$cListener: Object
        },
        observers: ['_$cContextChanged($c.*)'],
        attached(){
            /**
             * Fired when element is attached. Subscribes to parent context
             * @event context-required
             */
            this.fire('context-required', { receiver: this });
            this._$cListener = this.$e.addEventListener('context-changed', (e) => {
                this._$cChanges.push(e.detail);
                this.notifyPath(e.detail.path, e.detail.value);
            });
        },
        detached(){
            this.$e.removeEventListener(this._$cListener);
        },
        _$cContextChanged(e){
            if(this.$e){
                var externalChanges = this._$cChanges,
                    externalChange = this._$cChanges.find(change => change.path === e.path && change.value === e.value);
                if(!externalChange){
                    this.$e.fire('context-changed', { path: e.path, value: e.value });
                }else{
                    externalChanges.splice(externalChanges.indexOf(externalChange), 1);
                }
            }
        }
    };
    JS.ContextReceiverBehavior = [JS.ContextReceiverBehaviorImpl, JS.EventBusListenerBehavior];

})();
