/*
 * grunt-manage-index-files
 *
 *
 * Copyright (c) 2013 Dehru Cromer
 * Licensed under the MIT license.
 */
'use strict';

var grunt = require('grunt');

/**
 * Will turn a regexp object if a string is provided
 * @param regexOrStr
 * @returns RegExp
 */
var getRegex = function(regexOrStr) {
    return ( regexOrStr instanceof RegExp ) ? regexOrStr : new RegExp(regexOrStr);
};


/**
 * This function uses the startPattern and endPattern to match a portion of the content
 * and return the matched portion.
 *
 * @param content - [String] content of the source to be searched
 * @param startPattern - [String|RegExp] the start pattern to match in the source to start the copy
 * @param endPattern - [String|RegExp] the end pattern to match in the source to stop the copy
 * @return String
 *
 */
var getSourceScripts = function (content, startPattern, endPattern) {

    if (!content || !startPattern || !endPattern) {
        var message = 'You must provide a source file, source start pattern, and source end pattern.';
        grunt.log.error(message);
        throw new TypeError(message);
    }
    startPattern = getRegex(startPattern);
    endPattern = getRegex(endPattern);

    var lines = content.replace(/\r\n/g, '\n').split(/\n/),
        block = false,
        first,
        scripts = [];

    lines.forEach(function (l) {
        //console.log("Start Pattern: ", startPattern);
        //console.log("LINE: ", l);
        //console.log("Match: ", l.match(startPattern));
        var build = l.match(startPattern);
        var endbuild = endPattern.test(l);

        if (build) {
            block = true;
            first = true;
        }

        if (block && endbuild) {
            block = false;
        }

        if (block && scripts) {

            if (!first && !endbuild) {
                scripts.push(l);
            }
        }

        if (build) {
            first = false;
        }
    });

    return scripts.join('\n');
};

/**
 * This function takes the destinationContent and places the scriptsStr into the destinationContent
 * based on the start and end patterns that are provided.  It returns the destinationContent with the
 * scripts inserted into it.
 * @param destinationContent
 * @param scriptsStr
 * @param start
 * @param end
 * @returns {*}
 */
var insertScriptsIntoDestinationFile = function(destinationContent, scriptsStr, startPattern, endPattern) {

    if (!destinationContent || !startPattern || !endPattern) {
        var message = 'You must provide a destination file, destination start pattern, and destination end pattern.';
        grunt.log.error(message);
        throw new TypeError(message);
    }

    var start = getRegex(startPattern);
    var end = getRegex(endPattern);
    var matcher = getRegex(start.source + '[^]*' + end.source);
    //console.log("Matcher: " + matcher);
    //console.log("TEST: ", matcher.test(destinationContent));
    var replacer = start.source + '\n' + scriptsStr + '\n' + end.source;
    var replaced = destinationContent.replace(matcher, replacer);
    //console.log("Replaced: ", replaced);
    return replaced;
};

module.exports = function(grunt) {


    /**
     * This task takes can help you keep 1 section of 1 file in sync with another section of another file.
     */
  grunt.registerMultiTask('copy-part-of-file', 'This plugin helps us copy sections from 1 file and insert it into to another.  like index-harmony.html to index-harmony-e2e.html', function() {

    for (var i = 0; i < this.files.length; i++) {
      var file = this.files[i];

      //get filepaths as strings
      var indexFilePath = file.orig.src[0];
      var e2eFilePath = file.dest;
      var sourceFileStartPattern = this.options().sourceFileStartPattern;
      var sourceFileEndPattern = this.options().sourceFileEndPattern;
      var destinationFileStartPattern = this.options().destinationFileStartPattern;
      var destinationFileEndPattern = this.options().destinationFileEndPattern;

      if (!grunt.file.exists(indexFilePath)) {
          grunt.log.warn('Source file ' + indexFilePath + ' not found.');
      }

      if (!grunt.file.exists(e2eFilePath)) {
          grunt.log.warn('E2E file ' + e2eFilePath + ' not found.');
      }

      var indexFile = file.src[0];
      var e2eFile = grunt.file.read(e2eFilePath);

      var scripts = getSourceScripts(grunt.file.read(indexFile), sourceFileStartPattern, sourceFileEndPattern);

      var newE2eSource = insertScriptsIntoDestinationFile(e2eFile, scripts, destinationFileStartPattern, destinationFileEndPattern);

      // Write the destination file.
      grunt.file.write(e2eFilePath, newE2eSource);

      // Print a success message.
      grunt.log.writeln('File "' + e2eFilePath + '" created.');
    }

  });

};
