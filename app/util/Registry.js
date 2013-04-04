App.def('App.util.Registry', {
    init : function () {
        this.model = Backbone.Model.extend({});
        this.collection = new Backbone.Collection([], {
            model : this.model
        });

//        console.log('args', arguments);
    }
});