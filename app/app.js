/*jslint browser:true */
/*global $, Marionette */

//Bootstrap the app
var App = new Marionette.Application();

/**
 * Make templates look more like Ext.Tpl
 * @type {{interpolate: RegExp, evaluate: RegExp}}
 */
_.templateSettings = {
    interpolate : /\{(.+?)\}/g,
    evaluate    : /\{\[(.+?)\]\}/g
};

App.controllers = {};

$(function () {
    'use strict';
    // Simply letting me know that everything is running ok
    console.info('App is Go!!!');

});
