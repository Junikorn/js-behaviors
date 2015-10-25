(function(){
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.TranslationReceiverBehavior` allows to use `$t` property as binding provider for translation
     * provided by parent element extending `JS.TranslationProviderBehavior`.
     *
     * @polymerBehavior
     */
    JS.TranslationReceiverBehavior = {
        properties: {
            /**
             * Object containing fetched translation.
             */
            $t: Object
        },
        attached(){
            /**
             * Fired when element is attached. Unsubscribes parent translation provider.
             * @event translation-required
             */
            this.fire('translation-required', { target: this });
        },
        detached(){
            /**
             * Fired when element is detached. Lets element unsubscribe to parent translation provider.
             * @event translation-released
             */
            this.fire('translation-released', { target: this });
        }
    };

})();
