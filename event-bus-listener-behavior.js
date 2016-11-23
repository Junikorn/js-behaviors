(function(){
    'use strict';

    window.JS = window.JS || {};

    var connectors = []; //list of all subscribed connectors

    class EventBusConnector{
        constructor(element) {
            this.connector = {};
            this.element = element;
        }
        /**
         * @method $e.fire
         */
        fire(event, data, triggerSelf){
            connectors.forEach((val) => {
                if(val[event] && (triggerSelf || val !== this.connector)){
                    val[event].forEach((val) => {
                        try{
                            val({
                                type: event,
                                detail: data,
                                timeStamp: new Date().getTime(),
                                srcElement: this.element
                            });
                        }catch(e){
                            console.warn(e);
                        }
                    });
                }
            });
        }
        /**
         * @method $e.addEventListener
         */
        addEventListener(event, callback){
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
        removeEventListener(descriptor){
            var array = this.connector[descriptor.e],
                index = array.indexOf(descriptor.c);
            array.splice(index, 1);
        }
        /**
         * @method $e.subscribe
         */
        subscribe(){
            connectors.push(this.connector);
        }
        /**
         * @method $e.unsubscribe
         */
        unsubscribe(){
            connectors.splice(connectors.indexOf(this.connector), 1);
        }
        /**
         * @property $e.subscribed
         */
        get subscribed(){
            return connectors.indexOf(this.connector) > -1;
        }
    }

    /**
     * `JS.EventBusListenerBehavior` allows to use `$e` property as event bus connecting all listeners.
     * Behavior replaces `<iron-signals>` element functionality without the need of adding any markup to extended elements `<template>`
     *
     * @polymerBehavior JS.EventBusListenerBehavior
     */
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
                value: function(){
                    return new EventBusConnector(this);
                }
            }
        },
        attached(){
            this.$e.subscribe();
        },
        detached(){
            this.$e.unsubscribe();
        }
    };

})();
