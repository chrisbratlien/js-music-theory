<?php
add_filter('wp_title', function ($o) {
  return "Connecting Game";
});

add_action('wp_head', function () {
?>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
  <style>

    @import "css/align.css";
    @import "css/flex.css";
    @import "css/vindow.css";
    @import "css/connecting-game.css";
    @import "css/tablature.css";



    @font-face {
    font-family: "Electronic Highway Sign";
    src: url(font/EHSMB.eot?) format("eot"),url(font/EHSMB.ttf) format("truetype"),url(font/EHSMB.woff) format("woff"),url(font/EHSMB.svg#ElectronicHighwaySign) format("svg");
    font-weight: 400;
    font-style: normal
    }

    .lcd {
      background-color: rgb(18,66,0);
      color: rgb(233,255,0);
      font-family: Electronic Highway Sign;
      font-size: 20px;
    }

    .midi-info {
      padding: 10px;
    }
    * {
      /* So 100% means 100% */
      box-sizing: border-box;
    }

    html,
    body {
      /* Make the body to be as tall as browser window */
      height: 100%;
    }

    #pickers {
      height: 40px;
    }
    .progression {
      font-family: monospace;
      width: 90%;
    }
  </style>
<?php
});


get_header(); 
?>
<div class="flex-column content seventy">
  <div class="flex-row">
    <button id="sticky-note-button">Sticky Note</button>
  </div>
  <div class="vindows"></div>
  <button class="btn-auto-arrange">Auto Arrange </button>
</div><!-- content -->


<?php

add_action('wp_footer', function () {
?>
  <script type="text/javascript" src="js/color.js"></script>
  <script src="js/bsd.widgets.simpleplayer.js"></script>
  <script type="text/javascript" src="js/bsd.widgets.procrastinator.js"></script>
  <script async type="module">

import PubSub from "./js/PubSub.js";
import MIDIRouter from "./js/MIDIRouter.js";
import MIDIInfo from "./js/MIDIInfo.js";
import DOM from "./js/DOM.js";
import Vindow, {autoArrange} from "./js/Vindow.js";
import Point from "./js/Point.js";
import BSDMixer from "./js/BSDMixer.js";
import Inspector from "./js/Inspector.js";
import SimplePropertyRetriever from "./js/SimplePropertyRetriever.js";
import {parseProgression} from "./js/Progression.js";
import JSMT, { Note } from "./js/js-music-theory.js";
import ConnectingGame, {ConnectingGameVindow} from "./js/ConnectingGame.js";

//careful, the scope of this constant is still just within this module
import MIDI_MSG from "./js/MIDIConstants.js";

import Tablature, {TablatureHelper} from "./js/Tablature.js";
import PrefixedLocalStorage from "./js/PrefixedLocalStorage.js";

//FIXME: standardize options across pages.
BSD.options = {
  improv: {
    enabled: true,
    volume: 0.5,
    channel: 3,
    patch: 1,
    midi: true
  }
}

storage = null;//deciding to not use the BSD.localStorage;
storage = PrefixedLocalStorage('JSMT::');

//TODO: use Procrastinator module
var waiter = BSD.Widgets.Procrastinator({
  timeout: 250
});

let router;
let mixer = BSDMixer(context);

function handleExternallyReceivedNoteOn(msg, noteNumber, velocity) {
  if (router && router.outPort && BSD.options.improv.midi) {
    let noteOnChannel = MIDI_MSG.NOTE_ON + (BSD.options.improv.channel - 1);

    let vel = Math.floor(BSD.volume * velocity); //[0..1] * [0..127] = [0..127]
    return router.outPort.send([noteOnChannel, noteNumber, vel]);
  }
  //okay, we'll synthesize using WekAudio LFO.
  campfire.publish('play-note', {
    note: Note(noteNumber),
    duration: BSD.durations.note
  });
}

    function handleExternallyReceivedNoteOff(msg, noteNumber, velocity) {
      let needToBother = router && router.outPort && BSD.options.improv.midi;
      if (!needToBother) {
        return false;
      }
      let noteOffChannel = MIDI_MSG.NOTE_OFF + (BSD.options.improv.channel - 1);
      return router.outPort.send([noteOffChannel, noteNumber, velocity]);
    }

    router = MIDIRouter({
      onMIDIMessage: function(e) {
        //NOTE: this comes from the external app/controller/gear input

        ///console.log("eeeeee",e);
        //console.log("BSD?",BSD)

        let [msg, noteNumber, velocity] = e.data;
        ///console.log('msg', msg);

        if (msg == MIDI_MSG.NOTE_ON) {
          return handleExternallyReceivedNoteOn(msg, noteNumber, velocity);
        }
        if (msg == MIDI_MSG.NOTE_OFF) {
          return handleExternallyReceivedNoteOff(msg, noteNumber, velocity);
        }

        if (msg == MIDI_MSG.PITCH_BEND) {
          //i guess i don't understand this yet. why can't I just pass it thru?
          console.log('bend?', e.data);
          return router.outPort.send(e.data);
        }
      }
    });
    window.router = router;




mixer = BSDMixer(context);
BSD.audioPlayer = BSD.Widgets.SimplePlayer({
  context: context,
  destination: mixer.common,
  polyphonyCount: 48, //polyphonyCount,
  itemTitles: BSD.itemTitles,
  range: [40, 128]
});

BSD.audioPlayer.publish('set-master-volume', BSD.volume || 0.06);


function makeEnumerable(something) {
  if (typeof something !== "object") { return something; }
  let props = SimplePropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(something);
  let conjured = props.reduce((accum,prop) => {
    accum[prop] = something[prop];
    return accum;
  },{});
  return conjured;
}

var body = DOM.from(document.body);


var campfire = PubSub({});
window.campfire = campfire;

var stickyNoteButton = jQuery('#sticky-note-button');
stickyNoteButton.click(function(e) {
  var sticky = BSD.Widgets.StickyNote(e);
  sticky.renderOn(jQuery(document.body));
});


campfire.subscribe('BSD.Widgets.WaveTablePlayer loaded', function(o) {
  jQuery('#msg').html(o.name + ' loaded. You may begin rocking out');
});

var polyphonyCount = 48;

BSD.volume = 0;
storage.getItem('volume', function(err,volStr) {
  if (err) { throw err; }
  var volume = Number(volStr)
  BSD.volume = volume;
  BSD.options.volume = volume; 
  jQuery("#volume-amount").text(BSD.volume);
});

  

      $("#volume-input").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 1,
        step: 0.01,
        value: BSD.volume,
        slide: function(event, ui) {
          var newVolume = ui.value;
          BSD.volume = Number(newVolume);
          waiter.beg(BSD.audioPlayer, 'set-master-volume', newVolume);
          storage.setItem('volume', newVolume);
          jQuery("#volume-amount").text(newVolume);
        }
      });


    BSD.durations = {
      bass: 1500,
      chord: 1000,
      note: 1000
    };


    //LEAD / IMPROV
    campfire.subscribe('play-note', function(payload) {

      ///console.log('play-note!!',payload);
      if (!BSD.options.improv.enabled) {
        return false;
      }

      if (router && router.outPort && BSD.options.improv.midi) {
        //another way to do noteOnChannel is
        //let byte1 = 0x90 + (oneBasedChannel - 1),

        let noteOnChannel = 0x90 + (BSD.options.improv.channel - 1);
        let noteOffChannel = 0x80 + (BSD.options.improv.channel - 1);

        let noteNum = (typeof payload.note == "number") ? payload.note : payload.note.value();
        let vel = BSD.options.improv.volume * BSD.volume; //[0..1] * [0..1] = [0..1]
        vel = Math.floor(127 * vel); //[0..1] -> [0..127]

        router.outPort.send([noteOnChannel, noteNum, vel]);

        setTimeout(function() {
          //console.log('stopping!?!?!?!? !!!')
          router.outPort.send([noteOffChannel, noteNum, vel]);
        }, BSD.durations.note);
        return false;
      }
      // I suspect that user interaction on the page has to initiate the first
      /// WebAudio API event... Once that happens, then the MIDI input is "felt" by the WebAudio API

      ///console.log('this should play, why am i not playing?',payload);
      // okay, currently no MIDI output, we'll use our WebAudio API synth
      BSD.audioPlayer.playNote(payload.note, payload.duration, payload.velocity);
    });

      campfire.subscribe('play-chord', function(o) {
        ///BSD.audioPlayer.playChord(o.chord, o.duration);
        o.chord.notes().map(n => {
          campfire.publish('play-note',{ note: n, duration: o.duration });
        });
      });


      var noteBounds = [41,69];
      const g = ConnectingGame({
        noteBounds,
      });

      ///var guitarData = await loadGuitarData();


    let tablature = Tablature({});
    let tablatureHelper = TablatureHelper(tablature);
    let tabWindow = Vindow({
      title: "Tablature",
      className: 'tablature'
    });
    let [tabToolbarIgnore, tabPane] = tablature.ui();
    let [tabHelperToolbar, thPaneIgnore] = tablatureHelper.ui();

    tabWindow.appendToToolbar(tabHelperToolbar);
    tabWindow.append(tabPane);
    tabWindow.renderOn(body);

    let cgVindow = ConnectingGameVindow({
      game: g,
      noteBounds,
      tablatureHelper,
      storage
    });
    cgVindow.on('note-value',function(noteValue){
      var note = Note(noteValue);
      campfire.emit('play-note',{
        note,
        duration: 1000
      });
    });
    cgVindow.renderOn(body);



      let chords = [];
      var tick = -1;
      var chordIdx = -1;
      var ruler;
      var noteValue;

    function onProgressionLoadSuccess(data) {
      var them = JSON.parse(data);
      console.log('them',them);  
      var first = them[0];
      if (first) {
        //wtf, I guess i didn't finish this...
        //cgVindow.update
      }
    }
    function onProgressionLoadError(data) {
     throw new Error(data); 
    }

    
    storage.getItem('connecting-game-progressions',function(err,data) {
      if (err) { return onProgressionLoadError(err) }
      return onProgressionLoadSuccess(data);
    });

    router.on('statechange',function(e,outPort){
      //console.log('YAY',e,outPort);
      if (!outPort) { return false; }
      let props = SimplePropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(outPort);
      ///console.log('props',props);
      let conjured = makeEnumerable(outPort);
      //console.log('conjured',conjured);
      //console.log('JSON.stringify',JSON.stringify(conjured));
      let theTarget = makeEnumerable(e.target);
    })


    let midiInfo = MIDIInfo({ 
      router, 
      channel: BSD.options.improv.channel, 
      patch: BSD.options.improv.patch 
    });
    var vMIDIInfo = Vindow({ title: 'MIDI Info'});
    let [miToolbar, miPane] = midiInfo.ui();
    vMIDIInfo.appendToToolbar(miToolbar),
    vMIDIInfo.append(miPane);
    vMIDIInfo.renderOn(body);


    var allVindows = [vMIDIInfo,tabWindow,cgVindow];
    function myAutoArrange() {
      var br = body.raw.getBoundingClientRect();
      var origin = Point(0,150); //x ignored for now.
      var corner = Point(br.right,150);//y ignored for now.
      autoArrange(allVindows, origin, corner);
    }
    myAutoArrange();
    var btnAutoArrange = DOM.from('.btn-auto-arrange');
    btnAutoArrange.on('click',myAutoArrange);
  </script>

<?php
});

get_footer();