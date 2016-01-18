'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.UsecaseHostBehavior` listens to selection of elements extending `JS.UsecaseBehavior` and menages activation cycle
     *
     * @polymerBehavior JS.UsecaseHostBehavior
     */
    JS.UsecaseHostBehaviorImpl = {
        listeners: {
            'iron-select': '_selectUsecase',
            'usecase-selected': '_selectUsecase'
        },
        /**
         * Method managing selected usecase activation cycle
         * @param {CustomEvent} e - selection event
         */
        _selectUsecase: function _selectUsecase(e) {
            var usecase = e.detail.item;
            if (usecase.__isPolymerInstance__ && usecase.behaviors.indexOf(JS.UsecaseBehaviorImpl) > -1) {
                e.stopPropagation();
                usecase._setTitle();
                usecase.selected();
                usecase.scrollTop = 0;
            }
        }
    };
    JS.UsecaseHostBehavior = [JS.ContextProviderBehavior, JS.UsecaseHostBehaviorImpl];
})();
//# sourceMappingURL=usecase-host-behavior.js.map
