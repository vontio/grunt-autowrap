/*
 * grunt-autowrap
 * https://github.com/vontio/grunt-autowrap
 *
 * Copyright (c) 2013 Vontio
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    autowrap: {
      testJs:{
        options: {
          ext: 'js',
        },
        files: {
          'tmp/testJs.js': ['test/fixtures/A.js', 'test/fixtures/B.js'],
        },
      },
      testCoffee:{
        options: {
          ext: 'coffee',
        },
        files: {
          'tmp/testCoffee.js': ['test/fixtures/*.coffee'],
        },
      },
      testAmd:{
        options:{
          wrapType:'amd',
          ext:'coffee',
        },
        files:{
          'tmp/testAmd.js':'test/fixtures/*.coffee',
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'autowrap', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
