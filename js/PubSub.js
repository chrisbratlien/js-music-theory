let PubSub = function(spec) {
  var self = {},
      nickname = spec && spec.nickname || '',
      callbacks = {};

  self.hash = Math.random().toString(36).substr(2);

  function subscribeToOneTopic(topic, callback) {
    if (typeof callbacks[topic] === "undefined") {
      callbacks[topic] = [];
    }

    callbacks[topic].push(callback);
    return self; //curry/chain
  };

  self.subscribe = function (topicOrTopics, callback) {
    if (!Array.isArray(topicOrTopics)) {
      topicOrTopics = topicOrTopics.split(/ +/).filter((t) => t && t.length);
    }
    topicOrTopics.forEach((topic) => {
      subscribeToOneTopic(topic, callback);
    });
    return self;
  }

  self.publish = function(topic, ...args) {
    if (typeof callbacks.publish !== "undefined") { //SPECIAL EXTRA CASE: if there are subscribers to the topic named "publish"...
      callbacks.publish.each(function(cb){
        cb(topic + ' (' + nickname + ' ' + self.hash + ')'); //then send them a real-time transcript of which topic is presently being published to.
      });
    }
    var toCall = callbacks[topic];
    if (!toCall) { return false; }
    toCall.forEach(function(cb) {
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

  self.relay = (topicOrTopics, throughAnotherPubSub) => {
    if (!Array.isArray(topicOrTopics)) {
      topicOrTopics = topicOrTopics.split(/ +/).filter((t) => t && t.length);
    }
    topicOrTopics.forEach((topic) => {
      subscribeToOneTopic(topic, (...args) => {
        throughAnotherPubSub.publish(topic, ...args);
      });
    });
    return self;
  };


  return self;
};
export default PubSub;