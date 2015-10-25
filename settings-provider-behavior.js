(function(){
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.SettingsProviderBehavior` allows to attach element's settings (`$s`) to all of it's children extending `JS.SettingsReceiverBehavior`
     *
     * @polymerBehavior JS.SettingsProviderBehavior
     */
    JS.SettingsProviderBehavior = {
        properties: {
            /**
             * Settings object (has no default, you should set it by yourself)
             * @default undefined
             */
            $s: Object
        },
        listeners: {
            'settings-required': '_attachSettings'
        },
        /**
         * Method attaching settings to subscribing child element
         * @listens settings-required
         */
        _attachSettings: function(e){
            if(e.detail.receiver !== this){
                e.stopPropagation();
                e.detail.receiver.set('$s', this.$s);
            }
        }
    };

})();
