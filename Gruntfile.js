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
        },
        line_comment_replace_scripts: {
            options: {
                sourceFileStartPattern: '// Start Source',
                sourceFileEndPattern: '// End Source',
                destinationFileStartPattern: '// Start Destination',
                destinationFileEndPattern: '// End Destination'
            },
            files: {
                'test/fixtures/javascript-line-comment-destination.js': ['test/fixtures/javascript-line-comment-source.js']
            }
        },
        block_comment_replace_scripts: {
            options: {
                sourceFileStartPattern: '/* Start Source */',
                sourceFileEndPattern: '/* End Source */',
                destinationFileStartPattern: '/* Start Destination */',
                destinationFileEndPattern: '/* End Destination */'
            },
            files: {
                'test/fixtures/javascript-block-comment-destination.js': ['test/fixtures/javascript-block-comment-source.js']
            }
        },
        copy_to_multiple_files: {
          options: {
              //When having muliple destination files -
              //As a postfix to sourceFileStartPattern and sourceFileEndPattern, the filepath will be added as a file marker
              //Thus, in the source file one has to specify the start pattern following the file path of the destination file.
              sourceFileStartPattern: '//start',
              sourceFileEndPattern: '//end',
              destinationFileStartPattern: '//start',
              //If specified, the destinationFileStartPattern will be added before the locationDestinationStartPattern.
              locationDestinationStartPattern: 'var testFunction',
              destinationFileEndPattern: '//end',
              //If specified, the destinationFileEndPattern will be added after the locationDestinationEndPattern.
              locationDestinationEndPattern: '\\}\\;'
            },
            files: [{
                src: 'test/fixtures/copy-to-multiple-files-source.js',
                dest: ['test/fixtures/copy-to-multiple-files-destination1.js', 'test/fixtures/copy-to-multiple-files-destination2.js']
            }]
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
