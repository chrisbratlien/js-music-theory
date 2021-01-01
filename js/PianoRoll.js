import PubSub from "./PubSub.js";
import { lerp, invlerp, remap } from "./scalar.js";

function millisPerLoop(bpm, beatsPerBar, barsPerLoop) {
  let millisPerMinute = 60000;
  return (beatsPerBar * barsPerLoop * millisPerMinute) / bpm;
}

function PianoRoll(props) {
  let self = PubSub({});
  let wrap = DOM.div().addClass("piano-roll");

  let noteRange = [...Array(72).keys()].map((o) => 36 + o).reverse();

  let eventRange = [...Array(props.TPLOOP).keys()].map((o) => o);
  console.log("eventRange", eventRange);

  //  let eventRange = [...Array(props.TPLOOP).keys()];

  let channel = 1;

  let loopMS = millisPerLoop(props.BPM, props.QPBAR, props.BARS);
  loopMS = Math.floor(loopMS);

  wrap.append(
    DOM.table().append(
      noteRange.map((noteNumber) =>
        DOM.tr().append(
          eventRange.map((tickIdx) => {
            let state = false;

            let onMillis = remap(0, props.TPLOOP, 0, loopMS, tickIdx);
            let offMillis = remap(0, props.TPLOOP, 0, loopMS, tickIdx + 1);

            let cell = DOM.td()
              .addClass("piano-roll-cell")
              .on("mouseover", (e) => {
                self.emit("note-hover", noteNumber);
              })
              .on("click", (e) => {
                state = !state;
                cell.toggleClass("active");
                let byte1 = 0x90 + (channel - 1),
                  byte2 = noteNumber,
                  byte3 = 127;

                console.log("byte1", byte1, "byte2", byte2, "byte3", byte3);

                let eventHash =
                  0x100000 * tickIdx + byte1 * 0x10000 + byte2 * 0x100 + byte3;

                let event = {
                  hash: eventHash,
                  noteOnLoopNum: 0,
                  noteOffLoopNum: 0,
                  noteOnMessage: [byte1, byte2, byte3],
                  noteOffMessage: [0x80 + (channel - 1), byte2, byte3],
                  noteOnMillis: onMillis,
                  noteOffMillis: offMillis,
                };

                if (state) {
                  props.events.push(event);
                } else {
                  for (let i = 0; i < props.events.length; i += 1) {
                    if (props.events[i].hash == eventHash) {
                      props.events.splice(i, 1);
                    }
                  }
                }

                if (state) {
                  self.emit("note-preview", noteNumber);
                }
                //events[tickIdx].push()
                console.log(
                  "tickIdx",
                  tickIdx,
                  "noteNumber",
                  noteNumber,
                  "channel",
                  channel
                );
              });
            return cell;
          })
        )
      )
    )
  );

  self.ui = function () {
    return wrap;
  };
  return self;
}

export default PianoRoll;
