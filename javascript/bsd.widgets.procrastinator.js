if (typeof BSD == "undefined") { var BSD = {}; }
if (typeof BSD.Widgets == "undefined") { BSD.Widgets = {}; }
BSD.Widgets.Procrastinator = function(spec) {

  ///console.log('spec',spec);

  var updateRequests = [];
  var lastStamp = new Date().getTime();
  var updateThresh = 1200;///500;
  
  function checkRequests() {
    ////console.log('cr updateRequests.length',updateRequests.length);
    if (updateRequests.length > 1) {
      updateRequests.pop();
      return;
    }
    spec.callback();
    updateRequests.pop();
  }

  var self = {};
  self.beg = function() {
    if (updateRequests.length > 5) { return; }
    updateRequests.push('blah');
    setTimeout(function() { checkRequests(); } ,updateThresh);
  };
  
  return self;
};
