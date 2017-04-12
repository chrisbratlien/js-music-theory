module.exports = {
  dev: {
    files: {
      'home.php': 'home.php'
    },
    options: {
      replacements: [{
        pattern: /javascript\/build\/app.*\.js/,
        replacement: 'javascript/build/app.js'
      }, {
        pattern: /styles\/build\/app.*\.css/,
        replacement: 'styles/build/app.css'
      }]
    }
  },
  prod: {
    files: {
      'home.php': 'home.php'
    },
    options: {
      replacements: [{
        pattern: /javascript\/build\/app.*\.js/,
        replacement: require('../pipeline').prodJs
      }, {
        pattern: /styles\/build\/app.*\.css/,
        replacement: require('../pipeline').prodCss
      }]
    }
  }
};
