App.util = {};

(function () {
    var u = App.util,
        nsCache = {};

    _.extend(u, {
        /**
         * Create a custom namespace. Allows deep creation
         * @param {String} ns
         */
        ns : function (ns) {
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
                for (; i<last; i++ ) {
                    part = parts[i];
                    obj = parent[part];
                    if (typeof obj !== 'object') {
                        parent[part] = {};
                    }
                    parent = parent[part];
                }
            }

            parent[lastNs] = undefined;
            parent = parent[lastNs];

            nsCache[ns] = parent;

            return parent;
        },

        /**
         * Define a new class
         * @
         */
        def : function (ns, config) {
            var extend = config.extend,
                init = config.init,
                constructor = config.constructor;


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



