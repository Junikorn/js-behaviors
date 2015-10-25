'use strict';

(function () {
    'use strict';

    window.JS = window.JS || {};

    /**
     * `JS.UsecaseBehavior` sets interface for selectable usecase view management and document.title changes
     *
     * @polymerBehavior JS.UsecaseBehavior
     */
    JS.UsecaseBehaviorImpl = {
        properties: {
            /**
             * Placeholder for array of rights required to open view (sugar property)
             */
            requiredRights: {
                type: Array,
                value: null
            }
        },
        observers: ['_setTitle($t)'],
        /**
         * Method setting title in context and document if usecase is selected
         */
        _setTitle: function _setTitle() {
            var _this = this;

            this.async(function () {
                var title = _this.getTitle();
                document.title = title;
                if (_this.$c && _this === _this.$c.usecase) {
                    _this.$c.set('title', title);
                }
            });
        },
        /**
         * Method getting title for usecase. Defaults to `$t.title` or empty string. Can be overwritten
         */
        getTitle: function getTitle() {
            return this.$t && this.$t.title + (this.$t.subtitle ? ' - ' + this.$t.subtitle : '') || '';
        },
        /**
         * Method executed when usecase is selected. Should be overwritten
         */
        selected: function selected() {
            //placeholder
        }
    };
    JS.UsecaseBehavior = [Polymer.NeonAnimatableBehavior, JS.UsecaseBehaviorImpl, JS.ContextReceiverBehavior];
})();
//# sourceMappingURL=usecase-behavior.js.map
