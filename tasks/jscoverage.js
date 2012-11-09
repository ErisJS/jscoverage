/**
 * Task: jscoverage
 * Description: Generates code coverage information using jscoverage
 * Dependencies: jscoverage
 */

module.exports = function(grunt) {
  'use strict';

  var sys = require('sys');
  var exec = require('child_process').exec;

  grunt.util = grunt.util || grunt.utils;
  var _ = grunt.util._;
  var kindOf = grunt.util.kindOf;

  grunt.registerTask("jscoverage", "Generate code coverage information using jscoverage", function() {

    var done = this.async();

    // gather options
    // ------------
    var defaultOptions = {
      noInstrument: []
    };
    var options = grunt.config("jscoverage");
    _.extend(defaultOptions, options);
    grunt.verbose.writeflags(options, " Options");

    // Catch if required fields are not provided.
    if (!options.sourcePath) {
      grunt.fail.warn("No path(s) provided for jscoverage to scan.");
    }
    if (!options.resultsPath) {
      grunt.fail.warn("No path provided for output.");
    }

    // Input path: array expected, but grunt conventions allows for either a string or an array.
    if (kindOf(options.noInstrument) === "string") {
      options.noInstrument = [ options.noInstrument ];
    }

    // instrument javascript / write results
    // ------------
    function onExec(error, stdout, stderr) {
      grunt.verbose.writeln(stdout);
      if (error) {
        grunt.verbose.error();
        grunt.fail.warn(error);
        done();

        return;
      }

      sys.puts(stdout);
      grunt.log.ok();
      grunt.log.writeln("---");
      grunt.log.writeln("View uri: http://localhost:4444/cover-results/jscoverage.html?test/jasmine/index.html");
      grunt.log.writeln("A configured web server is necessary.  Adjust uri accordingly...");
      done();
    }
    // instrument the js to profile
    var i,noInstrument = options.noInstrument;
    for (i = 0; i < noInstrument.length; i++) {
      noInstrument[i] = "--no-instrument " + noInstrument[i];
    }
    noInstrument = noInstrument.join(" ");
    grunt.log.writeln("Instrumenting...");
    var command = "jscoverage "+noInstrument+" "+options.sourcePath+" "+options.resultsPath;
    grunt.log.writeln(command);
    exec(command, onExec);
  });
};
