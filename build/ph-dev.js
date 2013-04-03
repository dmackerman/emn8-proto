/*! Pizza-Hut-Pilot-App v0.0.1a 2013-04-03 23:46 */
/*jslint browser:true */
/*global $, Marionette */

//Bootstrap the app
var App = new Marionette.Application();

/**
 * Make templates look more like Ext.Tpl
 * @type {{interpolate: RegExp, evaluate: RegExp}}
 */
_.templateSettings = {
    interpolate : /\{(.+?)\}/g,
    evaluate    : /\{\[(.+?)\]\}/g
};

App.controllers = {};

$(function () {
    'use strict';
    // Simply letting me know that everything is running ok
    console.info('App is Go!!!');

});

App.util = {};

(function () {
    'use strict';

    var u = App.util,
        nsCache = {},
        arraySlice = Array.prototype.slice;

    _.extend(u, {
        emptyFn : function () {},

        /**
         * Create a custom namespace. Allows deep creation
         * @param {String} ns
         * @param {Object} value
         */
        ns : function (ns, value) {
            if (!_.isString(ns)) {
                throw new Error("Invalid namespace, must be a string");
            }

            //if NS already exists, return it
            if (nsCache.hasOwnProperty(ns)) {
                return nsCache[ns];
            }

            var parts = ns.split('.'),
                last = parts.length - 1,
                lastNs = parts[last],
                parent = window,
                part,
                obj,
                i;

            if (last > 0) {
                for (i = 0; i < last; i += 1) {
                    part = parts[i];
                    obj = parent[part];
                    if (!_.isObject(obj)) {
                        parent[part] = {};
                    }
                    parent = parent[part];
                }
            }

            parent[lastNs] = parent[lastNs] || value;
            parent = parent[lastNs];

            nsCache[ns] = parent;

            return parent;
        },

        /**
         * Define a new class
         * @
         */
        def : function (ns, config) {
            var Base = App.abstract ? App.abstract.BaseClass : function () {},
                Extend = config.extend ? u.ns(config.extend) : Base,
                initializing = false,
                prototype,
                Class;

            _.extend(config, {
                $super : Extend.prototype
            });

            initializing = true;
            prototype = new Extend();
            initializing = false;

            _.extend(prototype, config);

            Class = function () {
                if (!initializing && this.init) {
                    this.init.apply(this, arguments);
                }
            };

            Class.prototype = prototype;

            _.extend(Class.prototype, {
                constructor  : Class,
                "$className" : ns
            });

            u.ns(ns, Class);
        },

        /**
         * Instantiate and initialize a class
         * @param {String} ns
         */
        init : function (ns) {
            var a = arguments,
                name = a[0],
                args = arraySlice.call(arguments, 1),
                cls;

            if (!_.isFunction(name)) {
                //<debug error>
                if (!_.isString(name) || name.length < 1) {
                    throw new Error("Invalid class name '" + name.toString() + "' specified, must be a non-empty string");
                }
                //</debug>

                cls = u.ns(name);
            } else {
                cls = name;
            }

            if (!cls) {
                throw new Error("Cannot create an instance of unrecognized class name: " + name.toString());
            }

            if (!_.isFunction(cls)) {
                throw new Error(name.toString() + "' is a singleton and cannot be instantiated");
            }

            return new (u.instantiator(args))(cls, args);
        },

        instantiator : function (args) {
            var q = [],
                i;

            for (i = 0; i < args.length; i += 1) {
                q.push("a[" + i + "]");
            }

            return new Function('c', "a", "return new c(" + q.join(",") + ")");
        }
    });

    /**
     * Copy references to App for easier access
     */
    _.extend(App, {
        apply : u.apply,
        def   : u.def,
        init  : u.init,
        ns    : u.ns
    });
}());




App.def('App.util.Controller', {
    init: function () {
        'use strict';

        var name;

        this.$name = name = this.$className.replace('App.controller.', '');

        App.ns("App.controllers." + name, this);
    }
});

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
/**
 *
 */
App.def('App.abstract.Page', {
    /**
     * Template string
     * Based on _.template
     * Variables in {}
     * Evaluate in {[]}
     *
     * Example
     * '<div>{name}</div>
     * '<div>{[for (i in obj) {print obj[i];}]}</div'>
     *
     */
    tpl : undefined,

    /**
     * Template data object
     */
    data : undefined,

    /**
     * Plain html to be used instead of template
     */
    html : undefined,

    /**
     * DOM node to apply html to
     */
    applyTo : undefined,

    /**
     * reference to element placed in DOM
     */
    el : undefined,

    /**
     * Template element for use with rapid removal and add. It gets cloned to this.el
     */
    $el : undefined,

    /**
     * Element ID and Page ID all in one
     */
    id : undefined,

    /**
     * True to automatically paint the component
     */
    autoShow : false,

    /**
     * Initialize tpl and/or html
     */
    init : function () {
        'use strict';
        var me = this;

        // Call superclass
        me.$super.init.apply(me, arguments);

        if (_.isString(me.tpl)) {
            me.initTpl();
        } else if (_.isString(me.html)) {
            me.setHtml();
        }
    },

    /**
     * Initialize and compile template
     */
    initTpl : function () {
        'use strict';

        var me = this;

        // save the original string
        me.$tpl = me.tpl;

        // compile the template
        me.tpl = _.template(me.tpl);

        if (_.isObject(me.data) || _.isArray(me.data)) {
            me.setData();
        }
    },

    /**
     * Update template with object data
     * @param data
     */
    setData : function (data) {
        'use strict';

        var me = this;

        if (data) {
            me.data = data;
        }

        me.reset();

        if (me.autoShow === true || me.el) {
            me.paint();
        }

        me.trigger('update', me, me.data, me.tpl);
    },

    /**
     * Set html content
     * @param html
     */
    setHtml : function (html) {
        'use strict';

        var me = this,
            content = html || me.html,
            el = me.$el,
            id = me.id || _.uniqueId('page_');

        if (!el) {
            me.$el = el = $(document.createElement('div')).attr('id', id);
        }

        el.html(content);

        if (me.autoShow === true) {
            // helps with performance on consecutive paints
            setTimeout(function () {
                me.paint();
            }, 1);
        }
    },

    /**
     * Removes references to element (el and $el)
     * @private
     */
    reset : function () {
        'use strict';

        var me = this;

        me.remove();
        delete me.el;
    },

    paint : function (target) {
        'use strict';

        var me = this;

        if (me.el) {
            // already painted
            return false;
        }

        target = target || me.applyTo;

        me.el = me.$el.clone(true);

        me.trigger('beforepainted', me, me.$el, me.html);

        me.el.appendTo(target);
        me.trigger('painted', me, me.$el, me.html);
    },

    destroy : function () {
        'use strict';

        var me = this;

        // remove listeners
        me.off();

        // remove dom
        me.remove();
    },

    hide : function () {
        'use strict';

        this.el.hide();
    },

    remove : function () {
        'use strict';

        var me = this;

        if (me.el) {
            me.el.remove();
        }
        delete me.el;
    },

    show : function () {
        'use strict';

        var me = this;

        if (me.el) {
            return me.el.show();
        }

        return me.paint();
    }
});
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
        me.showMenu(pos.left + 35 - 97, pos.top - 40, type);
        console.log(ev);

        if (exists.length > 0) {
            //            return exists.remove();
        }

        //        canvas.append('<div class="' + type + '"></div>');
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

        //        console.log(ev.data);

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
    }
});

App.def('App.util.Registry', {
    init : function () {
        this.model = Backbone.Model.extend({});
        this.collection = new Backbone.Collection([], {
            model : this.model
        });

//        console.log('args', arguments);
    }
});

App.reg = App.init('App.util.Registry', 'Jebi', 'se');
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