App.util = {};

(function () {
    var u = App.util,
        nsCache = {};

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

            parent[lastNs] = value;
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
                _super: extend.prototype
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
            Class.prototype.constructor = Class;

            u.ns(ns, Class);
        },

        /**
         * Instantiate and initialize a class
         * @param {Function} Class
         */
        init : function (Class, config) {
            var instance = new u.ns(Class)(config);
            return instance;
        }
    });

    /**
     * Copy references to App for easier access
     */
    _.extend(App, {
        apply : u.apply,
        def   : u.def,
        ns    : u.ns
    })
}());



