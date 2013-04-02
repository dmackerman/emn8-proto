/*! Pizza-Hut-Pilot-App v0.0.1a 2013-04-02 22:27 */
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
    var u = App.util,
        nsCache = {},
        arraySlice = Array.prototype.slice;

    _.extend(u, {
        emptyFn : function () {},

        /**
         * Create a custom namespace. Allows deep creation
         * @param {String} ns
         * @param {Mixed} value
         */
        ns : function (ns, value) {
            if (typeof ns != 'string') {
                throw new Error("Invalid namespace, must be a string");
            }

            //if NS already exists, return it
            if (nsCache.hasOwnProperty(ns)) {
                return nsCache[ns];
            }

            var parts = ns.split('.'),
                i = 0,
                last = parts.length - 1,
                lastNs = parts[last],
                parent = window,
                part,
                obj;

            if (last > 0) {
                for (; i < last; i++) {
                    part = parts[i];
                    obj = parent[part];
                    if (typeof obj !== 'object') {
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
                extend = config.extend ? u.ns(config.extend) : Base,
                initializing = false,
                prototype,
                Class;

            _.extend(config, {
                _super : extend.prototype
            });

            initializing = true;
            prototype = new extend();
            initializing = false;

            _.extend(prototype, config);

            Class = function () {
                if (!initializing && this.init) {
                    this.init.apply(this, arguments);
                }
            }

            Class.prototype = prototype;

            _.extend(Class.prototype, {
                constructor  : Class,
                "$className" : ns,
                "$super"     : Base.prototype
            });

            u.ns(ns, Class);
        },

        /**
         * Instantiate and initialize a class
         * @param {String} ns
         */
        init : function (ns) {
            var name = arguments[0],
                args = arraySlice.call(arguments, 1),
                cls;

            if (typeof name != 'function') {
                //<debug error>
                if ((typeof name != 'string' || name.length < 1)) {
                    throw new Error("Invalid class name '" + name.toString() + "' specified, must be a non-empty string");
                }
                //</debug>

                cls = u.ns(name);
            }
            else {
                cls = name;
            }

            if (!cls) {
                throw new Error("Cannot create an instance of unrecognized class name: " + name.toString());
            }

            if (typeof cls != 'function') {
                throw new Error(name.toString() + "' is a singleton and cannot be instantiated");
            }

            return new (u.instantiator(args))(cls, args);
        },

        instantiator : function (args) {
            var q = [];
            for (var i = 0; i < args.length; i++) {
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
    })
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
    init: function () {
        _.extend(this, Backbone.Events);
        this.trigger('init', this, arguments);
    },

    callParent: function (fn, args, scope) {
        this.$super[fn].apply(scope || this, args);
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
    tpl: '',

    /**
     * Template data object
     */
    data: undefined,


    init: function () {
        // sve the original string
        this.$tpl = this.tpl;

        // compile the template
        this.tpl = _.template(this.tpl);

        if (_.isObject(this.data) || _.isArray(this.data)) {
            this.setData(data);
        }
    },

    setData: function (data) {
        this.data = data;
        this.tpl()
        this.trigger('update', this, data);
    }
});
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