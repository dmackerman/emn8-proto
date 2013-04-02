$(function () {
    'use strict';
    App.init('App.controller.Pizza');

});

App.def('App.controller.Pizza', {
    extend : 'App.util.Controller',
    init   : function () {
        'use strict';

        App.controllers.Pizza = this;

        $(".pizza-builder").delegate(".pb-topping", "click", this.onToppingClick);
        $(".pizza-builder").delegate(".topping-selectors li", "click", this.onToppingGroupClick);
    },

    onToppingClick: function () {
        'use strict';

        var type = this.className.replace(/(\W*)pb\-topping(\W*)/, ''),
            selector = '.' + type,
            canvas = $('.pb-canvas'),
            exists = canvas.children(selector);

        if (exists.length>0) {
            return exists.remove();
        }

        canvas.append('<div class="' + type + '"></div>');
    },

    onToppingGroupClick: function () {
        'use strict';

        var el = $(this),
            isSelected = el.hasClass('selected');

        if (isSelected) {
            // this is already selected. Exit gracefully
            return;
        }

        //select another group
        el.siblings('.selected').removeClass('selected');
        el.addClass('selected');

        //todo: now load that group

    }
});
