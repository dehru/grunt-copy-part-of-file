# grunt-copy-part-of-file

> This grunt tasks will copy a portion of one file and insert it into another file. I use this to keep my angular index.html file in sync with my index-e2e.html file rather than trying to manually copy all the scripts each time the index.html changes.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-copy-part-of-file --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-copy-part-of-file');
```

## The "manage_index_files" task

### Overview
In your project's Gruntfile, add a section named `copy-part-of-file` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
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
})
```

### Options

#### options.soureFileStartPattern
Type: `String`
Default value: `A STRING OR REGEX`

A string or regexp value that is used to match part of the source file and start to copy the content at this line.

#### options.soureFileEndPattern
Type: `String`
Default value: `A STRING OR REGEX`

A string or regexp value that is used to match part of the source file and stop copying at this line.

#### options.destinationFileStartPattern
Type: `String`
Default value: `A STRING OR REGEX`

A string or regexp value that is used to match part of the destination file and begin to copy into it.

#### options.destinationFileEndPattern
Type: `String`
Default value: `A STRING OR REGEX`

A string or regexp value that is used to match part of the source file and start to copy.

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
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
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0 - First release...supports what I need it to do.

