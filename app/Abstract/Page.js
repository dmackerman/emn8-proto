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