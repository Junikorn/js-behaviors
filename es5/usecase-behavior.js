'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.UsecaseBehavior` sets interface for selectable usecase view management and document.title changes
     *
     * @polymerBehavior JS.UsecaseBehavior
     */
    JS.UsecaseBehavior = {
        properties: {
            /**
             * Property showing if usecase is currently active
             */
            _selected: {
                type: Boolean,
                value: false
            },
            /**
             * Placeholder for array of rights required to open view (sugar property)
             * @default null
             */
            requiredRights: {
                type: Array,
                value: null
            }
        }
    };
})();
//# sourceMappingURL=usecase-behavior.js.map
