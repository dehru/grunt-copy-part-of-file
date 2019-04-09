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
 * @param transformer - [Function] a mapper function to transform each line  
 * @return String
 *
 */
var getSourceScripts = function (content, startPattern, endPattern, transformer = (l) => l) {

    if (!content || !startPattern || !endPattern) {
        var message = 'You must provide a source file, source start pattern, and source end pattern.';
        grunt.log.error(message);
        throw new TypeError(message);
    }
    startPattern = getRegex(startPattern);
    endPattern = getRegex(endPattern);

    if(typeof transformer != "function")
      transformer = (l) => l

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
                scripts.push(transformer(l));
            }
        }

        if (build) {
            first = false;
        }
    });

    return scripts.join('\r\n');
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
    var replacer = startPattern + '\r\n' + scriptsStr + '\r\n' + endPattern;
    var replaced = destinationContent.replace(matcher, replacer);
    //console.log("Replaced: ", replaced);
    return replaced;
};

/**
 * This function removes the destination file patterns that were generated before from the file.
 * 
 * @param  destinationFilePath        [The file path of the file.]
 * @param destinationFileStartPattern [The file start pattern]
 * @param destinationFileEndPattern   [The file end pattern]
 */
var removeDestinationFilePatterns = function(destinationFilePath, destinationFileStartPattern, destinationFileEndPattern){
  
    var fileContent = grunt.file.read(destinationFilePath);
    // break the fileContent into an array of lines.
    var lines = fileContent.split('\n');

    for(var i =0; i < lines.length; i++) {
      //Match the start of the content.
      var matchedStartPattern = lines[i].match(destinationFileStartPattern);

      //Match the end of the content.
      var matchedEndPattern = lines[i].match(destinationFileEndPattern);

      if(matchedStartPattern || matchedEndPattern) {
        lines.splice(i,1);
      }
    }

    // join the array back into a single string
    var newFileContent = lines.join('\n');
    grunt.file.write(destinationFilePath, newFileContent);
};

/**
 * This function adds destination file patterns to act as a marker when the update is done.
 * 
 * @param destinationFilePath         [The file path of the destination file.]
 * @param destinationFileStartPattern [The destination file start pattern.]
 * @param destinationFileEndPattern   [The destination file end pattern.]
 * @param insertStartPattern          [The pattern that indicates where the destinationFileStartPattern must be added in the file.]
 * @param insertEndPattern            [The pattern that indicates where the destinationFileEndPattern must be added in the file.]
 */
var addDestinationFilePatterns = function(destinationFilePath, destinationFileStartPattern, destinationFileEndPattern, insertStartPattern, insertEndPattern){
  var fileContent = grunt.file.read(destinationFilePath);

  //First break the fileContent into an array of lines
  var lines = fileContent.split('\n');

  var matchedContentStart = 0;
  var matchedContentEnd = 0;

  for(var i =0; i < lines.length; i++) {
    //Match the start of the content defined by the insertStartPattern.
     var matchedContent = lines[i].match(insertStartPattern);
     if(matchedContent) {
       matchedContentStart = i;

       //Match the end of the content defined by the insertEndPattern.
       for(matchedContentEnd = i; matchedContentEnd<lines.length; matchedContentEnd++){
          var contentMatched = lines[matchedContentEnd].match(insertEndPattern);
          if(contentMatched) {
            matchedContentEnd++;
            break;
          }
       }
     }
  }

  var preMatchedContent = lines.slice(0, matchedContentStart).join('\n');
  var content = lines.slice(matchedContentStart, matchedContentEnd).join('\n');
  var postMatchedContent = lines.slice(matchedContentEnd, lines.length).join('\n');

  //If the translations for the specified locale already exist in its respective file
  var newFileContent = fileContent + "\n" + destinationFileStartPattern+ destinationFileEndPattern;
  
  if(content) {
    newFileContent = preMatchedContent +"\n"+ destinationFileStartPattern+ "\n" + content + "\n"+ destinationFileEndPattern + "\n" + postMatchedContent;
  }

  grunt.file.write(destinationFilePath, newFileContent);
};

/**
 * This function takes care to copy different parts of the source file representing to the corresponding destination files.
 * 
 * @param  filepath   [The file path of the destination file.]
 * @param  sourceFile [The file path of the source file.]
 * @param  file       [The file]
 * @param  options    [A method containing all the options detail defined in the task.]
 */
var copyTranslationsToDestinationFile = function(filepath, sourceFile, file, options) {
  var sourceFileStartPattern = options.sourceFileStartPattern;
  var sourceFileEndPattern = options.sourceFileEndPattern;
  var destinationFileStartPattern = options.destinationFileStartPattern;
  var destinationFileEndPattern = options.destinationFileEndPattern;
  var lineTransformer = options.lineTransformer;
  var locationDestinationStartPattern = options.locationDestinationStartPattern ? getRegex(options.locationDestinationStartPattern) : null;
  var locationDestinationEndPattern = options.locationDestinationEndPattern ? getRegex(options.locationDestinationEndPattern) : null;

  var e2eFilePath = filepath;
  var indexFilePath = sourceFile.toString();

  if (!grunt.file.exists(indexFilePath)) {
      grunt.log.warn('Source file ' + indexFilePath + ' not found.');
  }

  if (!grunt.file.exists(e2eFilePath)) {
      grunt.log.warn('E2E file ' + e2eFilePath + ' not found.');
  }

  if(locationDestinationStartPattern && locationDestinationEndPattern) {
    //Add the destinationFileStartPattern and destinationFileEndPattern tags.
    addDestinationFilePatterns(filepath, destinationFileStartPattern, destinationFileEndPattern, locationDestinationStartPattern, locationDestinationEndPattern);
  }

  var e2eFile = grunt.file.read(e2eFilePath);

  //NOTE: If we have multiple destination files - sourceFileStartPattern and sourceFileEndPattern will always end with the filepath as a file marker.
  //This way the sourceFilePattern will always be unique.
  var sourceStartPattern = sourceFileStartPattern;
  var sourceEndPattern = sourceFileEndPattern;

  if(grunt.file.expand(options, file.dest).length > 1){
    sourceStartPattern = sourceFileStartPattern + ' ' + filepath;
    sourceEndPattern = sourceFileEndPattern + ' ' + filepath;
  }

  var scripts = getSourceScripts(grunt.file.read(indexFilePath), sourceStartPattern, sourceEndPattern, lineTransformer);

  var newE2eSource = insertScriptsIntoDestinationFile(e2eFile, scripts, destinationFileStartPattern, destinationFileEndPattern);

  // Write the destination file.
  grunt.file.write(e2eFilePath, newE2eSource);

  if(locationDestinationStartPattern && locationDestinationEndPattern) {
    // Remove the destinationFileStartPattern and destinationFileEndPattern tags.
    removeDestinationFilePatterns(filepath, destinationFileStartPattern, destinationFileEndPattern);
  }
  
  // Print a success message.
  grunt.log.writeln('File "' + e2eFilePath + '" created.');
};

module.exports = function(grunt) {

  /**
   * This task takes can help you keep 1 section of 1 file in sync with another section of another file.
   */
  grunt.registerMultiTask('copy-part-of-file', 'This plugin helps us copy sections from 1 file and insert it into other files.', function() {

    this.files.forEach(function(file) { 
      var sourceFile = file.src;
      var destinationFiles = grunt.file.expand(this.options(), file.dest);

      var dest = destinationFiles.filter(function(filepath) {  
        // Warn on and remove invalid source files.
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Destination file ' + filepath + ' not found.');
          return false;
        } else {
          return true;
        }
      }, this).map(function(filepath) {
          copyTranslationsToDestinationFile(filepath, sourceFile, file, this.options());

      }, this);
    }, this);
  });
};
