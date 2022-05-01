import PubSub from "./PubSub.js";
import DOM from "./DOM.js";
import DragAndDropFile from "./DragAndDropFile.js";
import { lerp, invlerp, remap } from "./scalar.js";

function millisPerLoop(bpm, beatsPerBar, barsPerLoop) {
  let millisPerMinute = 60000;
  return (beatsPerBar * barsPerLoop * millisPerMinute) / bpm;
}

var textFile;
function makeTextFile(text, type) {
  var data = new Blob([text], {
      type: type
  });
  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
  }
  textFile = window.URL.createObjectURL(data);
  // returns a URL you can use as a href
  return textFile;
}


function PianoRoll(props) {
  let self = PubSub({});
  let pane = DOM.div().addClass("piano-roll");
  const minTempo = 10;
  let lowNote = 36;//C
  let howManyNotes = 60;//48;

  let noteRange = [...Array(howManyNotes).keys()].map((o) => lowNote + o);
  //so that the table rows can render in order from high to low
  let reversedNoteRange = [...noteRange].reverse();

  //console.log("eventRange", eventRange);

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

  let eventRange, loopMS;
  function init() {
    console.log('PR INIT');
    eventRange = [...Array(props.TPLOOP).keys()].map((o) => o);
    loopMS = millisPerLoop(props.BPM, props.QPBAR, props.BARS);
    loopMS = Math.floor(loopMS);    
  }
  init();


  let noteNames = JSMT.twelveTones();

  let playing = false;
  let btnSave;
  let btnPlayStop, iconPlayStop, inTempo;


  function handleNewLoopUpload(jsonString) {
    var obj = JSON.parse(jsonString);
    self.emit('new-loop-object',obj);
  }

  let dragFile = DragAndDropFile({
    accept: '*',
    handleFiles: function(files, b, c) {
        [...files].forEach(file => {
                window.file = file;
                //console.log('file?', file);
                file.text()
                    .then(jsonString => {
                        handleNewLoopUpload(jsonString) 
                    });  
            })
  }});

  let download;

  let toolbar = DOM.div()
    .addClass('btn-group flex-row align-items-center space-between')
    .append([
      btnSave = DOM.button()
      .addClass('btn btn-sm btn-default')
      .append(
        iconPlayStop = DOM.i()
          .addClass('fa fa-save')
      )
      .on('click',function() {
        self.emit('save',props);
      }),
      download = DOM.a()
        .addClass('btn btn-sm btn-default')
        .attr('href',null)
        .attr('download','loop.json')
        .append(
          DOM.i()
            .addClass('fa fa-download')
        )
        .on('click',function(e) {
          let now = Date.now();
          let filename = `piano-roll-${now}.json`;
          download.attr('download',filename);
          let dataString = JSON.stringify(props,null,4);
          const dataURI = makeTextFile(dataString, 'application/json');
          download.attr('href',dataURI);
        }),

      dragFile.ui(),
      

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
        .attr('min', minTempo)
        .val(props.tempo || 120)
        .on('change', (e) => self.emit('tempo-change', +e.target.value))
    ]);
 
 
  var tablePlaceholder = DOM.table();

  function decorateCell(cell, state,i) {
    state ? cell.addClass('active') : cell.removeClass('active');
    let bgStr = state ? `hsl(${hueRadianRange[i]}rad,50%,${lightnessPercentRange[i]}%)` :
      'inherit';
    cell.css({
      background: bgStr
    })
  }

self.refresh = function() {
  tablePlaceholder
  .empty()
  .append(
    reversedNoteRange.map((noteNumber,i) =>
      DOM.tr().append(
        DOM.th(noteNames[noteNumber%12]),
        ...eventRange.map((tickIdx) => {
          let state = false;

          //let onMillis = remap(0, props.TPLOOP, 0, loopMS, tickIdx);
          //let offMillis = remap(0, props.TPLOOP, 0, loopMS, tickIdx + 1);

          let found = props.events.find(ev => {
            return ev.noteNumber == noteNumber && ev.tickIdx == tickIdx;
          })
          if (found) {
            state = true;
          }

          let initialClass = `piano-roll-cell ${state ? "active" : "" }`;

          let cell = DOM.td()            
            .addClass(initialClass)
            .on("mouseover", (e) => {
              self.emit("note-hover", noteNumber);
            })
            .on("click", (e) => {
              state = !state;
              decorateCell(cell,state,i);

              let eventHash = 0x100 * tickIdx + noteNumber;

              let event = {
                hash: eventHash,
                noteNumber,
                noteOnLoopNum: 0,
                noteOffLoopNum: 0,
                tickIdx,
                //noteOnMillis: onMillis,
                //noteOffMillis: offMillis,
                ///...found // if found
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
            decorateCell(cell,state,i);

          return cell;
        })
      )
    )
  )
}

  self.refresh();

  pane.append(
    tablePlaceholder
  );

  self.update = function(opts) {
    props = opts;
    init();
    self.refresh();  
  }


  self.ui = function () {
    return [toolbar, pane];
  };

  return self;
}

export default PianoRoll;
