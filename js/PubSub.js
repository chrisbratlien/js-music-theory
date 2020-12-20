let PubSub = function(spec) {
  var self = {},
      nickname = spec && spec.nickname || '',
      callbacks = {};

  self.hash = Math.random().toString(36).substr(2);

  self.subscribe = function(topic, callback) {
    if (typeof callbacks[topic] === "undefined") {
      callbacks[topic] = [];
    }

    callbacks[topic].push(callback);
    return self; //curry/chain
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
  };
  self.on = self.subscribe;
  self.trigger = self.publish;
  self.emit = self.publish;
  self.relay = (topic,subscriber) => { 
    return self.subscribe(topic,(...args) => {
      subscriber.publish(topic,...args);
    }); //curries/chains because of return in subscribe
  };

  return self;
};
export default PubSub;