/*jslint node:true */
/*global module, grunt */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Just concatenate files. Libs and project files are separate.
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n',
                separator: ';'
            },
            project: {
                src: ['app/**/*.js'],
                dest: 'build/<%= pkg.filename %>-dev.js'
            },
            libs: {
                src: [
                    'lib/jquery.js',
                    'lib/underscore.js',
                    'lib/json2.js',
                    'lib/backbone.js',
                    'lib/backbone.marionette.js'
                ],
                dest: 'build/libs.js'
            }
        },

        // Minify project
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:ii") %> */\n'
            },
            project: {
                files: {
                    'build/<%= pkg.filename %>-min.js': [
                        '<%= concat.project.dest %>'
                    ]
                }
            },
            libs: {
                files: {
                    'build/libs-min.js': [
                        '<%= concat.libs.dest %>'
                    ]
                }
            },
            all: {
                files: {
                    'build/<%= pkg.filename %>-all-min.js': [
                        '<%= concat.libs.dest %>',
                        '<%= concat.project.dest %>'
                    ]
                }
            }
        },

        // Watch application js files and Gruntfile for changes
        watch: {
            scripts: {
                files: ['app/**/*.js', 'Gruntfile.js'],
                tasks: ['minimal'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    // Load task dependencies
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task - concat dev and watch for changes
    grunt.registerTask('default', ['concat', 'watch']);

    // Task used for watch where only project is concatenated
    grunt.registerTask('minimal', ['concat:project']);

    // Task for a full build and minification
    grunt.registerTask('full', ['concat', 'uglify']);
};