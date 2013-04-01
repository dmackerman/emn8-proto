/*jslint browser:true */
/*global $, Marionette */

//Bootstrap the app
var App = new Marionette.Application();

_.templateSettings = {
    interpolate : /\{(.+?)\}/g,
    evaluate    : /\{\[(.+?)\]\}/g
};


$(function () {
    'use strict';
    // Simply letting me know that everything is running ok
    console.info('App is Go!!!');
});
