import { lerp, invlerp, remap } from "./scalar.js";
export default function FreakySeq(props) {
  let opts = {
    BARS: 2, //total bars in this sequence
    QPBAR: 4, //quarter notes per bar
    //PPQ: 6, // ticks per quarter note or PPQN (pulse per quarter note)
    PPQ: 3,
    BPM: 120,
  };
  let GAMELOOP = opts;

  /*
  what's a freakyseq event?

  A)
  {
    noteOnMillis: 123,
    noteOffMilis: 345

  }

  it will eventually need to yield/trigger separate MIDI events for 
  the note on and note off

  B)
  or, will note on and note off events be separate at birth? 

  how will piano roll manage removal of events that are deleted?
  a hash?
  an owner?

  let's implement A for now

  */

  let loopMS; //  = millisPerLoop(GAMELOOP.BPM, GAMELOOP.QPBAR,GAMELOOP.BARS);
  let playing = false;
  function init() {
    console.log("init!!");
    GAMELOOP.TPBAR = GAMELOOP.PPQ * GAMELOOP.QPBAR; ///ticks per bar
    GAMELOOP.TPLOOP = GAMELOOP.TPBAR * GAMELOOP.BARS; //ticks per loop/seq
    GAMELOOP.MSPT = Math.floor(60000 / (GAMELOOP.BPM * GAMELOOP.PPQ)); //ms per tick

    loopMS = millisPerLoop(GAMELOOP.BPM, GAMELOOP.QPBAR, GAMELOOP.BARS);
    loopMS = Math.floor(loopMS);
  }

  function tempoChange(bpm) {
    GAMELOOP.BPM = bpm;
    init();
  }

  function playEventData(eventData) {
    let noteOnChanByte = 0x90 + (BSD.options.improv.channel - 1);
    let velocityByte = Math.floor(BSD.options.improv.volume * 127);
    //console.log('new helper');
    let firstByte = eventData >> 16,
      secondByte = (eventData & 0x00ff00) >> 8,
      thirdByte = eventData & 0x00007f;
    //console.log(firstByte,secondByte,thirdByte);
    /* */
    //console.log('vvv',velocityByte,eventData & 0x00007F);
    openedMIDIOutput.send([
      //eventData >> 16, //first byte (status)
      noteOnChanByte,
      (eventData & 0x00ff00) >> 8, //second byte //data
      //(eventData & 0x00007F) // third byte       //data
      velocityByte,
    ]);
  }

  function gameloop() {
    let i = 0; //tick index
    let MAX = GAMELOOP.TPLOOP;

    let handle = false;

    function helper() {
      let noteOnChanByte = 0x90 + (BSD.options.improv.channel - 1);
      let velocityByte = Math.floor(BSD.options.improv.volume * 127);
      //console.log('new helper');
      for (var j = 0; j < tickEvents[i].length; j++) {
        let eventData = tickEvents[i][j];
        playEventData(eventData);
        //console.log('eventData',eventData);
      }

      i += 1;
      i %= MAX;
      clearTimeout(handle);
      handle = setTimeout(helper, GAMELOOP.MSPT);
    }

    helper();
  }

  function millisPerLoop(bpm, beatsPerBar, barsPerLoop) {
    let millisPerMinute = 60000;
    return (beatsPerBar * barsPerLoop * millisPerMinute) / bpm;
  }

  function play() {
    if (playing) {
      return console.log("already playing");
    }
    playing = true;
    let whenStartedMS = false;
    let progressMS = 0;
    let saveProgressMS = 0;
    let currentLoop = 0;

    //console.log("loopMS", loopMS);

    function frameTick(nowMS) {
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

      /*
      console.log(
        "frameTick, nowMS",
        nowMS,
        "whenStartedMS",
        whenStartedMS,
        "progressMS",
        progressMS,
        "loopMS",
        loopMS,
        "currentLoop",
        currentLoop
      );
      */
      props.events
        .filter((event) => event.noteOnMillis < progressMS)
        .filter((event) => event.noteOnLoopNum < currentLoop)
        .forEach((event) => {
          event.noteOnLoopNum = currentLoop;
          let noteOnChanByte = 0x90 + (BSD.options.improv.channel - 1);
          let velocityByte = Math.floor(BSD.options.improv.volume * 127);
          openedMIDIOutput.send([
            noteOnChanByte,
            event.noteOnMessage[1],
            velocityByte,
          ]);
        });
      props.events
        .filter((event) => event.noteOffMillis < progressMS)
        .filter((event) => event.noteOffLoopNum < currentLoop)
        .forEach((event) => {
          event.noteOffLoopNum = currentLoop;
          let noteOffChanByte = 0x80 + (BSD.options.improv.channel - 1);
          let velocityByte = Math.floor(BSD.options.improv.volume * 127);
          openedMIDIOutput.send([
            noteOffChanByte,
            event.noteOffMessage[1],
            velocityByte,
          ]);
        });

      requestAnimationFrame(frameTick);
    }

    requestAnimationFrame(frameTick);
  }

  init();
  return {
    gameloop,
    millisPerLoop,
    opts,
    play,
    tempoChange,
    ///tickEvents,
  };
}
