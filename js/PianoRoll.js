import PubSub from "./PubSub.js";
import { lerp, invlerp, remap } from "./scalar.js";

function millisPerLoop(bpm, beatsPerBar, barsPerLoop) {
  let millisPerMinute = 60000;
  return (beatsPerBar * barsPerLoop * millisPerMinute) / bpm;
}

function PianoRoll(props) {
  let self = PubSub({});
  let pane = DOM.div().addClass("piano-roll");

  let lowNote = 54;//48;
  let howManyNotes = 20;

  let noteRange = [...Array(howManyNotes).keys()].map((o) => lowNote + o);
  //so that the table rows can render in order from high to low
  let reversedNoteRange = [...noteRange].reverse();

  let eventRange = [...Array(props.TPLOOP).keys()].map((o) => o);
  console.log("eventRange", eventRange);

  let TAU = Math.PI * 2;
  let hueRadiansBegin = TAU/3;
  let hueRadiansEnd = TAU;

  let hueRadianRange = noteRange
    .map((nn, i) => {
      return remap(0, noteRange.length, hueRadiansBegin, hueRadiansEnd, i);
    });
  let lightnessPercentRange = noteRange
    .map((nn, i) => {
      return remap(0, noteRange.length, 75, 45,i);
    })
  //console.log('hrr', hueRadianRange);
  //  let eventRange = [...Array(props.TPLOOP).keys()];

  let channel = 1;

  let loopMS = millisPerLoop(props.BPM, props.QPBAR, props.BARS);
  loopMS = Math.floor(loopMS);

  let noteNames = JSMT.twelveTones();

  let playing = false;
  let btnPlayStop, iconPlayStop, inTempo;
  let toolbar = DOM.div()
    .addClass('btn-group flex-row align-items-center space-between')
    .append([
      btnPlayStop = DOM.button()
        .addClass('btn btn-sm btn-default')
        .append(
          iconPlayStop = DOM.i()
            .addClass('fa fa-play')
        )
        .on('click', function () {
          playing = !playing;
          iconPlayStop.toggleClass('fa-play fa-pause');
          self.emit('is-playing', playing)
        }),
      inTempo = DOM.input()
        .addClass('tempo')
        .attr('type', 'number')
        .attr('min', 50)
        .val(props.tempo || 120)
        .on('change', (e) => self.emit('tempo-change', +e.target.value))
    ]);
 
 
 
  pane.append(
 
    DOM.table().append(
      reversedNoteRange.map((noteNumber,i) =>
        DOM.tr().append(
          DOM.th(noteNames[noteNumber%12]),
          ...eventRange.map((tickIdx) => {
            let state = false;

            //let onMillis = remap(0, props.TPLOOP, 0, loopMS, tickIdx);
            //let offMillis = remap(0, props.TPLOOP, 0, loopMS, tickIdx + 1);

            let cell = DOM.td()
              .addClass("piano-roll-cell")
              .on("mouseover", (e) => {
                self.emit("note-hover", noteNumber);
              })
              .on("click", (e) => {
                state = !state;
                cell.toggleClass("active");
                let bgStr = state ? `hsl(${hueRadianRange[i]}rad,50%,${lightnessPercentRange[i]}%)` :
                  'inherit';
                cell.css({
                  background: bgStr
                })


                let eventHash = 0x100 * tickIdx + noteNumber;

                let event = {
                  hash: eventHash,
                  noteNumber,
                  noteOnLoopNum: 0,
                  noteOffLoopNum: 0,
                  tickIdx,
                  //noteOnMillis: onMillis,
                  //noteOffMillis: offMillis,
                };

                if (state) {
                  props.events.push(event);
                } else {
                  for (let i = 0; i < props.events.length; i += 1) {
                    if (props.events[i].hash == eventHash) {
                      props.events.splice(i, 1); //deletes it
                    }
                  }
                }

                if (state) {
                  self.emit("note-preview", noteNumber);
                }
              });
            return cell;
          })
        )
      )
    )
  );

  self.ui = function () {
    return [toolbar, pane];
  };

  return self;
}

export default PianoRoll;
