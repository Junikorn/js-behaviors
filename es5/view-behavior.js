'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.ViewBehavior` sets interface for view management and document.title changes
     *
     * @polymerBehavior JS.ViewBehavior
     */
    JS.ViewBehavior = {
        properties: {
            /**
             * Property showing if usecase is currently active
             */
            opened: {
                type: Boolean,
                value: false
            }
        },
        /**
         * Placeholder for method initializing view
         */
        open: function open() {},
        /**
         * Placeholder for method destructing view
         */
        close: function close() {}
    };
})();
//# sourceMappingURL=view-behavior.js.map
