import PubSub  from "./PubSub.js";
export default function SimpleSeq(props) {
  const self = PubSub();
  let lastWhen = 0;
  self.tick = function(when) {
    props.events.filter(evtPair => {
      let [evt,evtWhen] = evtPair;
      return evtWhen > lastWhen && evtWhen <= when;
    })
    .map(evtPair => {
      let [evt,evtWhen] = evtPair;
      self.emit('event',{ event: evt, when: evtWhen });
    });
    lastWhen = when;
  }
  self.update = function (newProps) {
    props = newProps;
  }
  self.addEvent = function({when, event}) {
    props.events.push([event, when]);
  };
  return self;
}