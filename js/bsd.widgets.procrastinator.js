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
      updateRequests.shift();
      return;
    }
    
    var winner = updateRequests.shift();
    winner.receiver.publish(winner.topic,winner.payload);
  }

  var self = BSD.PubSub({});
  self.beg = function(receiver,topic,payload) {
    if (updateRequests.length > 5) { return false; }
    
    /////console.log('yay!!!',receiver,topic,payload);
    
    updateRequests.push({ receiver: receiver, topic: topic, payload: payload });
    setTimeout(function() { checkRequests(); } ,timeout);
  };
  
  return self;
};
