var pipeline = require('../pipeline');

module.exports = {
  js: {
    src: pipeline.libraries.concat(['js/config/parse.prod.env'], pipeline.js),
    dest: 'javascript/build/app.js'
  },
  css: {
    src: pipeline.css,
    dest: 'styles/build/app.css'
  },
};
