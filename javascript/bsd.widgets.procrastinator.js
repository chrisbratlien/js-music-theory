if (typeof BSD == "undefined") { var BSD = {}; }
if (typeof BSD.Widgets == "undefined") { BSD.Widgets = {}; }
BSD.Widgets.Procrastinator = function(spec) {

  ///console.log('spec',spec);

  var updateRequests = [];
  var lastStamp = new Date().getTime();
  var timeout = spec.timeout || 1200; //update Threshold
  
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
    if (updateRequests.length > 5) { return false; }
    updateRequests.push('blah');
    setTimeout(function() { checkRequests(); } ,timeout);
  };
  
  return self;
};
