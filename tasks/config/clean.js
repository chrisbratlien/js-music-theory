module.exports = {
  pre: [ 'styles/build', 'javascript/build' ],
  post: [ 'styles/build/app.*', 'javascript/build/app.*' ]
};
