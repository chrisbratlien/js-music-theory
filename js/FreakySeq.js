import { lerp, invlerp, remap } from "./scalar.js";
import PubSub  from "./PubSub.js";
export default function FreakySeq(props) {

  let opts = {
    BARS: 4, //total bars in this sequence
    QPBAR: 4, //quarter notes per bar
    PPQ: 2,//sixteenths// ticks per quarter note or PPQN (pulse per quarter note)
    BPM: 120,
    ...props
  };


  var self = PubSub();

  let tickIdx = 0, saveTickIdx = false;
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
    props.events = opts.events;
    init();

    return opts;
  }

  function millisPerLoop(bpm, beatsPerBar, barsPerLoop) {
    let millisPerMinute = 60000;
    return (beatsPerBar * barsPerLoop * millisPerMinute) / bpm;
  }

  let saveProgressMS = 0;
  let progressMS = 0;
  let whenStartedMS = false;

  let lastTickIdx = 0;


  function tick(tickIdx) {
    tickIdx = tickIdx % opts.TPLOOP; //stay within range.
    self.emit('tick',tickIdx);
    ////console.log("tickIdx", tickIdx);
    //NOW it's time...

    let toTriggerNow = props.events
      //.filter((event) => event.noteOnMillis < progressMS)
      .filter((event) => event.tickIdx === tickIdx ||  event.tickIdx > lastTickIdx && event.tickIdx <= tickIdx)
    
    ///console.log('tickIdx', tickIdx, 'toTrigger', toTrigger, 'currentLoop', currentLoop);
    toTriggerNow
      .forEach((event) => {
        self.emit('note-on', event);
      });

    lastTickIdx = tickIdx;

    (!opts.noteOffDisabled) && props.events
      //.filter((event) => event.noteOffMillis < progressMS)
      .filter((event) => event.tickIdx < lastTickIdx)
      .forEach((event) => {
        self.emit('note-off', event);
      });
  }

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

    saveProgressMS = progressMS;

    tickIdx = Math.floor(progressMS / opts.MSPT);

    //it may not be time to do anything yet.
    if (tickIdx !== saveTickIdx) {
      saveTickIdx = tickIdx;
      tick(tickIdx);
    }
    requestAnimationFrame(frameTick);
  }


  function play() {
    if (playing) {
      return console.log("already playing");
    }
    playing = true;
    whenStartedMS = false;
  
    //console.log("loopMS", loopMS);
    requestAnimationFrame(frameTick);
  }

  function stop() {
    playing = false;
  }
  init();

  return {
    ...self,
    props, //temporary for debugging..
    millisPerLoop,
    opts,
    play,
    stop,
    tempoChange,
    tick,
    update
  };
}
