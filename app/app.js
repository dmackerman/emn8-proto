/*jslint browser:true */
/*global $, Marionette */

$(function () {
    'use strict';
    // Simply letting me know that everything is running ok
    $('body').append('<p>App is Go!!!</p>');

    //Bootstrap the app
    window.App = new Marionette.Application();

});
