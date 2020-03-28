BSD.PubSub = function(spec) {
  var self = {},
      nickname = spec.nickname || '',
      callbacks = {};

  self.hash = Math.random().toString(36).substr(2);

  self.subscribe = function(topic, callback) {
    if (typeof callbacks[topic] === "undefined") {
      callbacks[topic] = [];
    }

    callbacks[topic].push(callback);
    return self; //for method chaining.   
  };

  self.publish = function(topic, payload) {
    if (typeof callbacks.publish !== "undefined") { //SPECIAL EXTRA CASE: if there are subscribers to the topic named "publish"...
      callbacks.publish.each(function(cb){
        cb(topic + ' (' + nickname + ' ' + self.hash + ')'); //then send them a real-time transcript of which topic is presently being published to.
      });
    }
    var args = Array.prototype.slice.call(arguments);    
    var topic = args.shift();
    ///console.log('topic',topic,'args',args);
    if (typeof callbacks[topic] == "undefined") {
      return false;
    }
    callbacks[topic].forEach(function(cb) {
      cb.apply(null,args);
    });
    return self; //for method chaining.
  };

  self.on = self.subscribe;
  self.trigger = self.publish;

  return self;
};
