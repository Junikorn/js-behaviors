'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.ViewBehavior` sets interface for view management and document.title changes
     * If you want to menage state of view DOM you need to put it in
     * `<template is="dom-if" if="[[opened]]" view restamp></template>` tag.
     * (restamp attribute makes browser unload view DOM when it is not used)
     * Please remember that close method may have to set properties
     * to initial state for view to work properly when reopened.
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
