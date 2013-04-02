App.def('App.util.Controller', {
    init: function () {
        'use strict';

        var name;

        this.$name = name = this.$className.replace('App.controller.', '');

        App.ns("App.controllers." + name, this);
    }
});
