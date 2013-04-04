App.util = {};

(function () {
    'use strict';

    var u = App.util,
        nsCache = {},
        arraySlice = Array.prototype.slice;

    //optimize events
    App.clickEvent = window.Touch ? 'touchstart' : 'click';

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



