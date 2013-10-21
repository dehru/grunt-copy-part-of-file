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
    }
};
