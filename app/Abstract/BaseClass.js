App.def('App.abstract.BaseClass', {
    init: function (config) {
        'use strict';
        var me = this;

        _.extend(me, Backbone.Events);
        me.trigger('init', me, arguments);
        me.initConfig(config);
    },

    callParent: function (fn, args, scope) {
        'use strict';
        this.$super[fn].apply(scope || this, args);
    },

    initConfig: function (config) {
        'use strict';
        _.extend(this, config);
    }
});