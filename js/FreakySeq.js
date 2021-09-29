import { lerp, invlerp, remap } from "./scalar.js";
import PubSub  from "./PubSub.js";
export default function FreakySeq(props) {

  let opts = {
    BARS: 2, //total bars in this sequence
    QPBAR: 4, //quarter notes per bar
    //PPQ: 6, // ticks per quarter note or PPQN (pulse per quarter note)
    PPQ: 2,//3,
    BPM: 120,
    ...props
  };


  var self = PubSub();


  let loopMS; //calculated
  let playing = false;
  function init() {
    console.log("init!!");
    opts.TPBAR = opts.PPQ * opts.QPBAR; ///ticks per bar
    opts.TPLOOP = opts.TPBAR * opts.BARS; //ticks per loop/seq
    opts.MSPT = Math.floor(60000 / (opts.BPM * opts.PPQ)); //ms per tick

    loopMS = millisPerLoop(opts.BPM, opts.QPBAR, opts.BARS);
    loopMS = Math.floor(loopMS);
  }

  function tempoChange(bpm) {
    opts.BPM = bpm;
    init();
  }
  function update(newOpts) {
    opts = {
      ...opts,
      ...newOpts
    }
    init();
  }

  function millisPerLoop(bpm, beatsPerBar, barsPerLoop) {
    let millisPerMinute = 60000;
    return (beatsPerBar * barsPerLoop * millisPerMinute) / bpm;
  }

  let currentLoop = 0;
  let saveProgressMS = 0;
  let progressMS = 0;

  function play() {
    if (playing) {
      return console.log("already playing");
    }
    playing = true;
    currentLoop = 0;
    let whenStartedMS = false;
  
    props.events.map(event => {
      event.noteOnLoopNum = currentLoop;
      event.noteOffLoopNum = currentLoop;
    })

    //console.log("loopMS", loopMS);

    function frameTick(nowMS) {
      if (!playing) {
        return console.log("stopped");
      }

      nowMS = Math.floor(nowMS);
      if (!whenStartedMS) {
        whenStartedMS = nowMS;
      }
      progressMS = nowMS - whenStartedMS;
      progressMS %= loopMS;

      if (progressMS < saveProgressMS) {
        currentLoop += 1;
      }
      saveProgressMS = progressMS;

      let tickIdx = Math.floor(progressMS / opts.MSPT);
      ////console.log("tickIdx", tickIdx);


      props.events
        //.filter((event) => event.noteOnMillis < progressMS)
        .filter((event) => event.tickIdx == tickIdx)
        .filter((event) => event.noteOnLoopNum < currentLoop)
        .forEach((event) => {
          event.noteOnLoopNum = currentLoop;
          ////console.log("note onnnn",event);
          self.emit('note-on', event);
        });


      (!opts.noteOffDisabled) && props.events
        //.filter((event) => event.noteOffMillis < progressMS)
        .filter((event) => event.tickIdx < tickIdx || event.tickIdx == opts.TPLOOP - 1 && tickIdx == 0)
        .filter((event) => event.noteOffLoopNum < currentLoop)
        .forEach((event) => {
          event.noteOffLoopNum = currentLoop;
          self.emit('note-off', event);
        });

      requestAnimationFrame(frameTick);
    }

    requestAnimationFrame(frameTick);
  }
  function stop() {
    playing = false;
  }
  init();

  return {
    ...self,
    props, //temporary for debugging..
    currentLoop,
    millisPerLoop,
    opts,
    play,
    stop,
    tempoChange,
    update
  };
}
