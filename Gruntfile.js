/*
 * grunt-manage-index-files
 * 
 *
 * Copyright (c) 2013 Dehru Cromer
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
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    'copy-part-of-file': {
        replace_e2e_scripts: {
          options: {
              //this matches patterns that are already in place for usemin:prepare
              sourceFileStartPattern: /<!--\s*build:js(?:\(([^\)]+)\))?\s*([^\s]+)\s*-->/,
              sourceFileEndPattern: /<!--\s*endbuild\s*-->/,
              destinationFileStartPattern: '<!-- START SCRIPTS REPLACED HERE BY GRUNT -->',
              destinationFileEndPattern: '<!-- END SCRIPTS REPLACED HERE BY GRUNT -->'
          },
          files: {
              'test/fixtures/index-harmony-e2e.html': ['test/fixtures/index-harmony.html']
          }
        },
        simple_replace_scripts: {
            options: {
                sourceFileStartPattern: '<!-- SIMPLE START -->',
                sourceFileEndPattern: '<!-- SIMPLE END -->',
                destinationFileStartPattern: '<!-- START -->',
                destinationFileEndPattern: '<!-- END -->'
            },
            files: {
                'test/fixtures/simple-destination.html': ['test/fixtures/simple-source.html']
            }
        }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy-part-of-file', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
