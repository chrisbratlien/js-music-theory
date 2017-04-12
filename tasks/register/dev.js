module.exports = function (grunt) {
  grunt.registerTask('dev', [
    'clean:pre',
    'concat:css',
    'concat:js',
    'string-replace:dev'
  ]);
};
