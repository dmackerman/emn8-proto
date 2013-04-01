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



