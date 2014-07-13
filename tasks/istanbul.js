module.exports = function (grunt) {

  grunt.registerMultiTask('istanbul', 'Run Istanbul commands', function () {

    var options = this.options(), file = options.file, fileArgs = options.fileArgs,
      cmdArgs = [options.command || 'help'], done = this.async(),
      path = require('path'), fork = require('child_process').fork;

    delete options.file;
    delete options.fileArgs;
    delete options.command;

    for(var key in options) {
      if (options.hasOwnProperty(key)) {
        var arg = options[key];
        if (typeof arg === 'boolean') {
          if (arg) cmdArgs.push('--' + key);
        } else {
          cmdArgs.push('--' + key);
          cmdArgs.push(String(arg));
        }
      }
    }

    if (file) {
      cmdArgs.push(file);
      if (fileArgs) {
        cmdArgs.push('--');
        cmdArgs = cmdArgs.concat(fileArgs.split(' '));
      }
    }

    fork(path.normalize(__dirname + '../lib/cli.js'), cmdArgs)
      .on('exit', function (code, signal) {
        done(code === 0 ? true : false);
      });
  });
};