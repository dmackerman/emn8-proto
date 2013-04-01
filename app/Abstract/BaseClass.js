App.def('App.abstract.BaseClass', {
    init: function () {
        _.extend(this, Backbone.Events);
        this.trigger('init', this, arguments);
    },

    regEvents: function () {

    }
});