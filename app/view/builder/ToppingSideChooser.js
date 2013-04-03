App.def('App.view.builder.ToppingSideChooser', {
    extend : 'App.abstract.Page',
    tpl    : [
        '<div class="pb-toppings-menu">',
        '<ul class="pb-topping-selector">',
        '<li>Left</li>',
        '<li class="selected">Whole</li>',
        '<li>Right</li>',
        '</ul>',
        '</div>'
    ].join(),

    data : {
        left  : 0,
        whole : 1,
        right : 0
    },

    xy : undefined,

    init : function (config) {
        'use strict';

        var me = this;
        me.$super.init.apply(me, arguments);

        if (me.xy) {
            me.on('beforepainted', me.showAt, me);
        }
    },

    showAt : function () {
        'use strict';

        var me = this,
            xy = (_.isNumeric(arguments[0]) && _.isNumeric(arguments[1])) ? arguments : me.xy;

        me.el.css({
            top  : xy[1] + 'px',
            left : xy[0] + 'px'
        });

    }

});