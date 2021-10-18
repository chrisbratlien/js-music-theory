import PubSub from "./PubSub.js";

export const Procrastinator = function() {
  let timeouts = {};
  function procrastinate(topic, fn, timeout) {
    clearTimeout(timeouts[topic]);
    timeouts[topic] = setTimeout(fn, timeout);
  }
  return procrastinate;
};

export default Procrastinator;
