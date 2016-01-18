(function(){
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
        observers: [
            '_setTitle($t)'
        ],
        /**
         * Method setting title in context and document if usecase is selected
         */
        _setTitle(){
            this.async(() => {
                var title = this.getTitle();
                document.title = title;
                if(this.$c && this === this.$c.usecase) {
                    this.$c.set('title', title);
                }
            });
        },
        /**
         * Method getting title for usecase. Returns `$t.title - $t.subtitle`, `$t.title` or empty string. Can be overwritten
         */
        getTitle(){
            return this.$t && (this.$t.title + (this.$t.subtitle ? ' - ' + this.$t.subtitle : '')) || '';
        },
        /**
         * Method executed when usecase is selected. Should be overwritten
         */
        selected(){
            //placeholder
        }
    };
    JS.UsecaseBehavior = [JS.UsecaseBehaviorImpl, JS.ContextReceiverBehavior];

})();
