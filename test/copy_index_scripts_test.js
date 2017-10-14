'use strict';

var grunt = require('grunt');

exports.copy = {
    setUp: function(done) {
    // setup here if necessary
    done();
    },
    replace_e2e_scripts: function(test) {
        test.expect(1);

        var actual = grunt.file.read('test/fixtures/index-harmony-e2e.html');
        var expected = grunt.file.read('test/expected/index-harmony-e2e.html');
        //console.log("test1", actual, expected);
        test.equal(actual, expected, 'the destination file does not match what was expected');

        test.done();
    },
    simple_replace_scripts: function(test) {
        test.expect(1);

        var actual = grunt.file.read('test/fixtures/simple-destination.html');
        var expected = grunt.file.read('test/expected/simple-expected.html');
        //console.log("actual: ", actual);
        //console.log("expected: ", expected);
        test.equal(actual, expected, 'the destination file does not match what was expected');

        test.done();
    },
    line_transformation_replace_scripts: function(test) {
        test.expect(1);

        var actual = grunt.file.read('test/fixtures/simple-transform-destination.js');
        var expected = grunt.file.read('test/expected/simple-transform-expected.js');

        test.equal(actual, expected, 'the destination file does not match what was expected');

        test.done();
    },
    line_comment_replace_scripts: function(test) {
        test.expect(1);

        var actual = grunt.file.read('test/fixtures/javascript-line-comment-destination.js');
        var expected = grunt.file.read('test/expected/javascript-line-comment-expected.js');
        //console.log("test1", actual, expected);
        test.equal(actual, expected, 'the destination file does not match what was expected');

        test.done();
    },
    block_comment_replace_scripts: function(test) {
        test.expect(1);

        var actual = grunt.file.read('test/fixtures/javascript-block-comment-destination.js');
        var expected = grunt.file.read('test/expected/javascript-block-comment-expected.js');
        //console.log("test1", actual, expected);
        test.equal(actual, expected, 'the destination file does not match what was expected');

        test.done();
    },
    copy_to_multiple_files_scripts: function(test) {
        test.expect(2);

        var Destination1Actual = grunt.file.read('test/fixtures/copy-to-multiple-files-destination1.js').replace(/[\r]/g,"");
        var Destination1Expected = grunt.file.read('test/expected/copy-to-multiple-files-destination1-expected.js').replace(/[\r]/g,"");
        test.equal(Destination1Actual, Destination1Expected, 'the destination file 1 does not match what was expected');

        var Destination2Actual = grunt.file.read('test/fixtures/copy-to-multiple-files-destination2.js').replace(/[\r]/g,"");
        var Destination2Expected = grunt.file.read('test/expected/copy-to-multiple-files-destination2-expected.js').replace(/[\r]/g,"");
        test.equal(Destination2Actual, Destination2Expected, 'the destination file 2 does not match what was expected');

       test.done();
    },
};
