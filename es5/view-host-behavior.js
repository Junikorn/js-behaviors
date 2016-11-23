'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.ViewHostBehavior` listens to selection of elements extending `JS.ViewBehavior` and menages activation cycle
     *
     * @polymerBehavior JS.ViewHostBehavior
     */
    JS.ViewHostBehavior = {
        properties: {
            /**
             * Opened view instance
             * @default null
             */
            openedView: {
                type: Object,
                value: null
            }
        },
        listeners: {
            'iron-select': '_selectView',
            'view-select': '_selectView'
        },
        /**
         * Method managing view activation cycle
         * @param {CustomEvent} e - selection event
         */
        _selectView: function _selectView(e) {
            var view = e.detail.item,
                template;
            if (view.__isPolymerInstance__ && view.behaviors.indexOf(JS.ViewBehavior) > -1) {
                e.stopPropagation();
                if (this.openedView) {
                    this.set('openedView.opened', false);
                    if (template = this.openedView.$$('template[view]')) {
                        template.render();
                    }
                    this.openedView.close();
                }
                this.set('openedView', view);
                view.set('opened', true);
                if (template = view.$$('template[view]')) {
                    template.render();
                }
                view.open();
                view.scrollTop = 0;
            }
        }
    };
})();
//# sourceMappingURL=view-host-behavior.js.map
