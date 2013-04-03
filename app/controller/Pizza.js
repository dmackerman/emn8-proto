$(function () {
    'use strict';
    App.init('App.controller.Pizza');

});

App.def('App.controller.Pizza', {
    extend : 'App.util.Controller',

    /**
     * Cached reference to canvas
     */
    canvas : undefined,

    /**
     * Cached reference to canvas
     */
    builder : undefined,

    init : function () {
        'use strict';

        var builder = this.builder = $(".pizza-builder");

        App.controllers.Pizza = this;

        builder.delegate(".pb-topping", "click", {me : this}, this.onToppingClick);
        builder.delegate(".topping-selectors li", "click", this.onToppingGroupClick);
    },

    /**
     * When user selects a topping, add it's layer on top of pizza
     * If already there, remove it
     * @param ev
     * @returns {*}
     */
    onToppingClick : function (ev) {
        'use strict';

        var me = ev.data.me,
            type = this.className.replace(/(\W*)pb\-topping(\W*)/, ''),
            selector = '.' + type,
            canvas = me.getCanvas(),
            exists = canvas.children(selector),
            pos = $(ev.currentTarget).offset();


//        me.showMenu(ev.clientX, ev.clientY);
        me.showMenu(pos.left + 35 - 97, pos.top - 40);
        console.log(ev);

        if (exists.length > 0) {
            return exists.remove();
        }

        canvas.append('<div class="' + type + '"></div>');
    },

    /**
     * Switch topping group
     */
    onToppingGroupClick : function () {
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

    },

    /**
     * Cache the reference to canvas
     * @returns {*}
     */
    getCanvas : function () {
        'use strict';

        var me = this,
            canvas = me.canvas;

        if (canvas) {
            return canvas;
        }

        canvas = me.canvas = me.builder.children('.pb-canvas');

        return canvas;
    },

    /**
     * This should belong to a Page, but is now here for lack of time
     */
    showMenu : function (x, y, ev) {
        'use strict';

        var me = this,
            html;

        console.log(x,y);

        html = [
            '<div class="pb-toppings-menu">',
            '<ul class="pb-topping-selector">',
            '<li>Left</li>',
            '<li class="selected">Whole</li>',
            '<li>Right</li>',
            '</ul>',
            '</div>'
        ].join('');

        $('.pb-toppings-menu').remove();

        $('body').append(html);

        $('.pb-toppings-menu').css({
            top  : y + 'px',
            left : x + 'px'
        });
    }
});
