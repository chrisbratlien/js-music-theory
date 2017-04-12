/**
 * Gruntfile
 *
 * This Node script is executed when you run `grunt`. It's purpose is to load
 * the Grunt tasks in your project's `tasks` folder, and allow you to add and
 * remove tasks as you see fit.
 */

module.exports = function(grunt) {
  var includeAll;
  try {
    includeAll = require('include-all');
  } catch (e) {
    grunt.log.error('Could not find `include-all` module.');
    grunt.log.error('Perhaps you forgot to run `npm install`?');
    return;
  }

  function loadTasks(relativePath) {
    return includeAll({
      dirname: require('path').resolve(__dirname, relativePath),
      filter: /(.+)\.js$/
    });
  }

  function registerTasks(tasks) {
    var registration = {};
    for (var task in tasks) {
      if (tasks.hasOwnProperty(task)) {
        if (typeof tasks[task] === 'function') {
          tasks[task](grunt);
        } else {
          registration[task] = tasks[task];
        }
      }
    }
    return registration;
  }

  var config = loadTasks('./tasks/config');
  config.pkg = grunt.file.readJSON('package.json');
  //config.bower = grunt.file.readJSON('bower.json');

  grunt.initConfig(registerTasks(config));

  try {
    require('load-grunt-tasks')(grunt);
  } catch (e) {
    grunt.log.error('Could not find `load-grunt-tasks` module.');
    grunt.log.error('Perhaps you forgot to run `npm install`?');
    return;
  }

  var tasks = loadTasks('./tasks/register');
  if (!tasks.default) {
    // Ensure that a "default" tasks exists for Grunt so it doesn't complain.
    tasks.default = function (grunt) { grunt.registerTask('default', []); };
  }
  registerTasks(tasks);
};
