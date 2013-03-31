/*jslint node:true */
/*global module, grunt */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
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
                    'lib/backbone.js'
                ],
                dest: 'build/libs.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:ii") %> */\n'
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

        watch: {
            scripts: {
                files: ['app/**/*.js'],
                tasks: ['minimal'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'watch']);
    grunt.registerTask('minimal', ['concat:project']);
    grunt.registerTask('full', ['concat', 'uglify']);

};