'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.UsecaseHostBehavior` listens to selection of elements extending `JS.UsecaseBehavior` and menages activation cycle
     *
     * @polymerBehavior JS.UsecaseHostBehavior
     */
    JS.UsecaseHostBehavior = {
        properties: {
            /**
             * Selected usecase instance
             * @default null
             */
            _selectedUsecase: {
                type: Object,
                value: null
            }
        },
        listeners: {
            'iron-select': '_selectUsecase',
            'usecase-select': '_selectUsecase'
        },
        /**
         * Method managing selected usecase activation cycle
         * @param {CustomEvent} e - selection event
         */
        _selectUsecase: function _selectUsecase(e) {
            var usecase = e.detail.item;
            if (usecase.__isPolymerInstance__ && usecase.behaviors.indexOf(JS.UsecaseBehavior) > -1) {
                if (this._selectedUsecase) {
                    this._selectedUsecase._selected = false;
                }
                this._selectedUsecase = usecase;
                usecase._selected = true;
                usecase.scrollTop = 0;
                e.stopPropagation();
            }
        }
    };
})();
//# sourceMappingURL=usecase-host-behavior.js.map
