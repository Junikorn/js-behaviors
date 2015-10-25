'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.SettingsReceiverBehavior` allows to attach parent's settings (`$s`) to extending element
     *
     * @polymerBehavior
     */
    JS.SettingsReceiverBehavior = {
        properties: {
            /**
             * Settings object
             * @default undefined
             */
            $s: Object
        },
        attached: function attached() {
            /**
             * Fired when element is attached. Subscribes to parent settings.
             * @event settings-required
             */
            this.fire('settings-required', { receiver: this });
        }
    };
})();
//# sourceMappingURL=settings-receiver-behavior.js.map
