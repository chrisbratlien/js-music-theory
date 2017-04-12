module.exports = function (grunt) {
  grunt.registerTask('prod', [
    'clean:pre',
    'concat:css',
    'cssmin:prod',
    'concat:js',
    'uglify:prod',
    'clean:post',
    'string-replace:prod'
  ]);
};
