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

        var me = this,
            builder = me.builder = $(".pizza-builder");

        App.controllers.Pizza = me;

        builder.delegate(".pb-topping", "click", {me : me}, me.onToppingClick);
        builder.delegate(".topping-selectors li", "click", me.onToppingGroupClick);
        $(document).on('click', {me : me}, me.clearMenus);
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

        ev.stopPropagation();

        //        me.showMenu(ev.clientX, ev.clientY);
        me.showMenu(pos.left + 35 - 97, pos.top - 40, type);

        if (exists.length > 0) {
            //            return exists.remove();
        }

        //        canvas.append('<div class="' + type + '"></div>');
    },

    /**
     * Switch topping group
     */
    onToppingGroupClick : function (ev) {
        'use strict';

        var el = $(this),
            isSelected = el.hasClass('selected');

        ev.stopPropagation();

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
    showMenu : function (x, y, type) {
        'use strict';

        var me = this,
            html,
            el,
            exists,
            side;

        html = [
            '<div class="pb-toppings-menu">',
            '<ul class="pb-topping-selector">',
            '<li class="side-left">Left</li>',
            '<li class="side-whole">Whole</li>',
            '<li class="side-right">Right</li>',
            '</ul>',
            '</div>'
        ].join('');

        $('.pb-toppings-menu').remove();

        $('body').append(html);

        el = $('.pb-toppings-menu').css({
            top  : y + 'px',
            left : x + 'px'
        });

        exists = me.findTopping(new RegExp("(.*)" + type + "(.*)"));
        if (exists.length > 0) {
            side = exists[0].className.replace(type, "");
        }

        $('.pb-toppings-menu li.side' + side).addClass('selected');

        $('.pb-toppings-menu li').on('click', {me : me, type : type}, me.showTopping);
    },

    showTopping : function (ev) {
        'use strict';

        var me = ev.data.me,
            type = ev.data.type,
            el = $(this),
            canvas = me.getCanvas(),
            where = this.className.match(/side\-(\S*)/)[1],
            exists = canvas.children('.' + type + '-' + where),
            pattern = new RegExp(type + "-(\S*)");

        //remove all
        me.findTopping(pattern).remove();
        el.siblings().removeClass('selected')

        if (el.hasClass('selected')) {
            return el.removeClass('selected');
        }

        canvas.append('<div class="' + type + '-' + where + '"></div>');
        el.addClass('selected');
    },

    findTopping : function (regexp) {
        'use strict';

        var me = this,
            canvas = me.getCanvas(),
            els = canvas.children(),
            found;

        found = els.filter(function () {
            return this.className.match(regexp);
        });

        return found;
    },

    clearMenus : function (ev) {
        'use strict';
        if (!$(ev.target).parents('.pb-toppings-menu').length) {
            $('.pb-toppings-menu').remove();
        }
    }
});
