'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.TranslationReceiverBehavior` allows to use `$t` property as binding provider for translation
     * provided by parent element extending `JS.TranslationProviderBehavior`.
     *
     * @polymerBehavior JS.TranslationReceiverBehavior
     */
    JS.TranslationReceiverBehavior = {
        properties: {
            /**
             * Object containing fetched translation.
             */
            $t: Object
        },
        attached: function attached() {
            /**
             * Fired when element is attached. Subscribes to parent translation provider
             * @event translation-required
             */
            this.fire('translation-required', { target: this });
        },
        detached: function detached() {
            /**
             * Fired when element is detached. Unsubscribes from parent translation provider
             * @event translation-released
             */
            this.fire('translation-released', { target: this });
        }
    };
})();
//# sourceMappingURL=translation-receiver-behavior.js.map
