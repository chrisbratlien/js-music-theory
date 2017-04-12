var prodFiles = {};
prodFiles[require('../pipeline').prodJs] = [ 'javascript/build/app.js' ];

module.exports = {
  js: {
    files: {
      'javascript/build/app.js' : [ 'javascript/build/app.js' ]
    }
  },
  prod: { files: prodFiles },
  options: {
    mangle: true,
    preserveComments: false
  }
};
