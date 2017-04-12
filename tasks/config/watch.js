module.exports = {
  css: {
    files: ['styles/src/*'],
    tasks: ['concat:css', 'string-replace:dev']
  },
  js: {
    files: ['javascript/src/*'],
    tasks: ['concat:js', 'string-replace:dev'],
  },
  php: {
    files: ['*.php'],
    tasks: [],
  },
  options: { livereload: true }
};
