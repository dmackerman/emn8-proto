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

    el    : undefined,
    $el   : undefined,
    $elId : undefined,

    init : function () {
        'use strict';
        var me = this;

        me.$super.init.apply(me, arguments);

        if (_.isString(me.tpl)) {
            me.initTpl();
        } else if (_.isString(me.html)) {
            me.initHtml();
        }
    },

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

    initHtml : function () {
        'use strict';
        this.setHtml();
        this.paint();
    },

    setData : function (data) {
        'use strict';

        var me = this;

        if (data) {
            me.data = data;
        }
        me.setHtml(me.tpl(me.data));
        this.paint();
        me.trigger('update', me, me.data, me.tpl);
    },

    setHtml : function (html) {
        'use strict';

        var me = this,
            content = html || me.html,
            el = me.$el,
            id = me.$elId || _.uniqueId('page_');

        if (!el) {
            me.$el = el = $(document.createElement('div')).attr('id', id);
        }

        el.html(content);
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

    hide: function () {
        'use strict';

        this.el.hide();
    },

    remove: function () {
        'use strict';

        var me = this;
        me.el.remove();
        delete me.el;
    },

    show: function () {
        'use strict';

        var me = this;

        if (me.el) {
            return me.el.show();
        }

        return me.paint();
    }
});