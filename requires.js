/*jslint browser:true */
/*global $, requirejs, require */
requirejs.config({
    baseUrl: 'app',

    paths: {
        lib: '../lib'
    },
    urlArgs: "nc=" + (new Date()).getTime(),

    shim: {
        'app': {
            deps: ['lib/backbone'],
            exports: 'App'
        },

        'lib/backbone': {
            deps: ['lib/underscore', 'lib/jquery', 'lib/json2'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require(["app"]);
