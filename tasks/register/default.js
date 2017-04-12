module.exports = function (grunt) {
  grunt.registerTask('default', [
    'clean:pre',
    'concat:css',
    'cssmin:dist',
    'concat:js',
    'uglify:js',
    'string-replace:dev'
  ]);
};
