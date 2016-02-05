if (typeof BSD == "undefined") { var BSD = {}; }

BSD.PubSub = function(spec) {

  var self = {};
  
  self.hash = Math.random().toString(36).slice(11);
  
  var nickname = (spec && spec.nickname) ? spec.nickname : '';
  
  var callbacks = {};
  self.subscribe = function(topic,callback) {
    if (typeof callbacks[topic] == "undefined") {
      callbacks[topic] = [];
    }  
    callbacks[topic].push(callback);
  };
  self.publish = function(topic,payload) {
    ////console.log('Huggy: publish',topic,payload);
    if (typeof callbacks['publish'] != "undefined") {
      ////console.log('**GOT HERE');
      callbacks['publish'].forEach(function(cb){
        cb(topic + ' (' + nickname + ' ' + self.hash + ')');
      });
    }

    if (typeof callbacks[topic] == "undefined") {
      //console.log('no subscribers to ' + topic);
      return false;
    }
    callbacks[topic].forEach(function(cb) {
      cb(payload);
    }); 
    
      
  };
  return self;
};