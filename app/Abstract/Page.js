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
    },

    setData : function (data) {
        'use strict';

        var me = this;

        if (data) {
            me.data = data;
        }
        me.setHtml(me.tpl(me.data));
        me.trigger('update', me, me.data, me.tpl);
    },

    setHtml : function (html, target) {
        'use strict';

        var me = this,
            to = target || me.applyTo,
            content = html || me.html,

            fragment = me.$fragment || document.createDocumentFragment(),
            div = me.$el,
            el;

        if (!div) {
            div = document.createElement('div');
            div.id = _.uniqueId('page_');
        }

        div.innerHTML = content;

        fragment.appendChild(div);
        el = fragment.cloneNode(true);
        $(to).append(el);

        _.extend(me, {
            $fragment : fragment,
            $el       : el
        });
    }
});