App.def('App.abstract.BaseClass', {
    init: function () {
        _.extend(this, Backbone.Events);
        this.trigger('init', this, arguments);
    },

    callParent: function (fn, args, scope) {
        this.$super[fn].apply(scope || this, args);
    }
});