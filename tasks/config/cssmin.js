var pipeline = require('../pipeline');

var prodFiles = {};
prodFiles[pipeline.prodCss] = pipeline.css;

module.exports = {
  options: {
    keepSpecialComments: 0
  },
  dist: {
    files: {
      'styles/build/app.css': pipeline.css
    }
  },
  prod: { files: prodFiles }
};
