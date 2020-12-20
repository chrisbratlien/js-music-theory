import PubSub from "./PubSub.js";

function PianoRoll(props) {
  let self = PubSub({});
  let wrap = DOM.div().addClass("piano-roll");

  let events = props.events;

  let noteRange = [...Array(72).keys()].map((o) => 36 + o).reverse();

  let eventRange = [...Array(props.TPLOOP).keys()];

  let channel = 1;

  wrap.append(
    DOM.table().append(
      noteRange.map((noteNumber) =>
        DOM.tr().append(
          eventRange.map((tickIdx) => {
            let state = false;
            let cell = DOM.td()
              .addClass("piano-roll-cell")
              .on("click", (e) => {
                state = !state;
                cell.toggleClass("active");
                let byte1 = 0x90 + (channel - 1),
                  byte2 = noteNumber,
                  byte3 = 127;

                let combined = byte1 * 0x10000 + byte2 * 0x100 + byte3;
                console.log(
                  "byte1",
                  byte1,
                  "byte2",
                  byte2,
                  "byte3",
                  byte3,
                  "combined",
                  combined
                );

                if (state) {
                  events[tickIdx].push(combined);
                } else {
                  events[tickIdx] = events[tickIdx].filter(
                    (e) => e !== combined
                  );
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
