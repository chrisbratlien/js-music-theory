import PubSub from "./PubSub.js";

function MIDIOutMonitor(props) {
  let self = PubSub({});

  let port = props.port;

  let textarea;
  function format(data) {
    let formattedDecimal = JSON.stringify(data);
    let formattedHex = data.map((o) => "0x" + o.toString(16)).join(",");
    let formatted = `${formattedDecimal} (${formattedHex})`;
    return formatted;
  }
  let wrap = DOM.div().addClass("midi-out-monitor");
  wrap.append((textarea = DOM.textarea().on("")));

  self.send = function (data) {
    //textarea.append("\n" + format(data));
    port.send(data);
  };
  self.clear = function () {
    textarea.empty();
  };
  self.updatePort = function (p) {
    port = p;
  };
  self.ui = function () {
    return wrap;
  };
  return self;
}

export default MIDIOutMonitor;
