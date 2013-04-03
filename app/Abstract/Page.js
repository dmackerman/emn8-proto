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