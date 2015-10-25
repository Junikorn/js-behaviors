(function(){
    'use strict';

    window.JS = window.JS || {};

    var connectors = new Set(); //list of all subscribed connectors

    class EventBusConnector{
        constructor(element) {
            this.connector = {};
            this.element = element;
        }
        /**
         * @method $e.fire
         */
        fire(event, data){
            connectors.forEach((val) => {
                if(val[event]){
                    val[event].forEach((val) => {
                        try{
                            val({
                                type: event,
                                detail: data,
                                timeStamp: new Date().getTime(),
                                sourceElement: this.element
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
            this.connector[event] = this.connector[event] || new Set();
            this.connector[event].add(callback);
            return {
                e: event,
                c: callback
            };
        }
        /**
         * @method $e.removeEventListener
         */
        removeEventListener(descriptor){
            this.connector[descriptor.e].remove(descriptor.c);
        }
        /**
         * @method $e.subscribe
         */
        subscribe(){
            connectors.add(this.connector);
        }
        /**
         * @method $e.unsubscribe
         */
        unsubscribe(){
            connectors.delete(this.connector);
        }
    }

    /**
     * `JS.EventBusListenerBehavior` allows to use `$e` property as event bus connecting all listeners.
     * Behavior replaces `<iron-signals>` element functionality without the need of adding any markup to extended elements `<template>`.
     *
     * @polymerBehavior
     */
    JS.EventBusListenerBehavior = {
        properties: {
            /**
             * EventBusConnector instance
             *
             * Available methods:
             * - `addEventListener(eventName, callback)` - adds event listener to bus and returns EventListenerDescriptor
             * - `removeEventListener(eventListenerDescriptor)` - removes event listener from bus
             * - `fire(eventName, details)` - fires event on bus
             * - `unsubscribe()` - unsubscribes from event bus
             * - `subscribe()` - subscribes to event bus
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
