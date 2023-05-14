

function buildEventWithData(topic,data) {
  var e = new Event(topic);
  e.data = data;
  return e;
}

function EventTargetPubSub() {
  var et = new EventTarget();


 	et.emit = function(topic,data) {
		et.dispatchEvent(buildEventWithData(topic,data));
  }
  et.on = function(topic,fn) {
    et.addEventListener(topic, o => fn(o.data))
  }

}

export default EventTargetPubSub;
