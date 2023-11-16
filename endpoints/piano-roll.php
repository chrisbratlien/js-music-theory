<?php

add_filter('wp_title', function ($o) {
  return "Piano Roll";
});

add_action('wp_head', function () {
  $classes = apply_filters('body_class', []);

  foreach ($classes as $c) {
    $file_path = APP_PATH . '/css/' . $c . '.css';
    $uri_path = get_stylesheet_directory_uri() . '/css/' . $c . '.css';
    //pp([$file_path,$uri_path],'did it work?'); 
    if (file_exists($file_path)) {
      echo sprintf(PHP_EOL .  '<link rel="stylesheet" href="%s">', $uri_path);
    }
  }
  //pp($classes,'classes');
});

add_action('dynamic-header-content',function(){
?>
  <button class="btn-auto-arrange">Auto Arrange</button>
<?php
});

add_action('wp_head', function () {
?>
  <style>
    @import 'css/piano-roll.css';
    @import 'css/tablature.css';
    @import 'css/lcd.css';
    @import 'css/vindow.css';
    @import 'css/arranger.css';

    @import 'css/svg-fretboard.css';
    @import "css/align.css";
    @import "css/flex.css";



    label {
      margin: 0;
    }
  </style>
<?php
});

get_header();
?>
<section>
  <br />
  <br />
  <br />
  <div class="piano-roll-wrap flex-column full-width">
  </div>
</section>
<?php

add_action('wp_footer', function () {
?>
  <script src="<?php home_url();  ?>/js/bsd.widgets.simpleplayer.js"></script>

  <script type="module">
    import MIDIRouter from "./js/MIDIRouter.js";
    import MIDIInfo from "./js/MIDIInfo.js";
    import FreakySeq from "./js/FreakySeq.js";
    import PianoRoll from "./js/PianoRoll.js";
    import Tablature from "./js/Tablature.js";
    import VindowInfo from "./js/VindowInfo.js";
    import Vindow, {autoArrange, allVindows} from "./js/Vindow.js";
    import Point from "./js/Point.js";
    import Arranger from "./js/Arranger.js";
    import BSDMixer from "./js/BSDMixer.js";
    //careful, the scope of this constant is still just within this module
    import MIDI_MSG from "./js/MIDIConstants.js";
    import DOM from "./js/DOM.js";
    import JSMT, { Note } from "./js/js-music-theory.js";
    import Procrastinator from "./js/Procrastinator.js";
    import PubSub from "./js/PubSub.js";
    import RootNoteWithIntervals from "./js/RootNoteWithIntervals.js";
    import SVGFretboard from "./js/SVGFretboard.js";
    //import Sortable from "./lib/sortable.complete.esm.js";

    import {
      setBackgroundHue
    } from "./js/Utils.js";


    let router;
    let freak;

    let body = DOM.from(document.body);

    let mixer = BSDMixer(context);
    const debounce = Procrastinator();
    
    const campfire = PubSub();


    function handleExternallyReceivedNoteOn(msg, noteNumber, velocity) {
      if (router && router.outPort && BSD.options.improv.midi) {
        let noteOnChannel = MIDI_MSG.NOTE_ON + (BSD.options.improv.channel - 1);
        return router.outPort.send([noteOnChannel, noteNumber, velocity]);
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

    let events = [];

    freak = FreakySeq({
      noteOffDisabled: true,
      events
    });
    window.freak = freak;



    //why is campfire visible inside the module?
    ///console.log('campfire?',campfire);

    let keyboardist;

    //TODO: consolidate these globals... They are being duplicated
    //in prog-fretboards as well.

    BSD.durations = {
      bass: 1500,
      chord: 1000,
      note: 1000
    };


    BSD.itemTitles = ['fundamental', 'octave', 'dominant', 'dominant+fourth(octave2)'];
    if (BSD.iOS) {
      BSD.itemTitles = ['fundamental'];
    }

    BSD.volume = 0.06;

    var volumeInput = DOM.from('.volume-input');
    var volumeAmount = DOM.from('.volume-amount');
    volumeInput.on('change',function(e){
      var newVolume = parseFloat(e.target.value);
      BSD.volume = newVolume;
      debounce('set-master-volume',
        () => {
          campfire.emit('set-master-volume', newVolume);
          storage.setItem('volume', newVolume);        
      },250);
      volumeAmount.text(newVolume);
    });

    storage.getItem('volume', function(o) {
      BSD.volume = parseFloat(o);
      volumeAmount.text(BSD.volume);
    });


    let defaultOptions = {
      progCycles: 3,
      progression: "Ab7 Db Gb- DbMaj7",
      showCurrentChordFretboardOnly: true,
      scrollToBoard: false,
      tempo: 120,
      bass: {
        enabled: true,
        midi: false,
        channel: 1,
        volume: 0.7,
        pan: 64
      },
      chord: {
        enabled: true,
        midi: false,
        channel: 2,
        volume: 0.7,
        pan: 64
      },
      highHat: {
        enabled: true,
        midi: false,
        channel: 10,
        noteNumber: 64,
        volume: 0.2,
        pan: 64
      },
      improv: {
        enabled: true,
        midi: false,
        channel: 3,
        bank: 1,
        patch: 1,
        volume: 0.7,
        pan: 64,
        insideChord: true
      }
    };
    BSD.options = {
      ...defaultOptions
    };
    storage.getItem('options', function(o) {

      let stored = JSON.parse(o);
      BSD.options = {
        ...BSD.options,
        ...stored
      }

      campfire.publish('options-loaded', BSD.options); //needed?
    });

    //alert('got here');
    console.log('FREAK?', freak);

    BSD.audioPlayer = BSD.Widgets.SimplePlayer({
      context: context,
      destination: mixer.common,
      polyphonyCount: 48, //polyphonyCount,
      itemTitles: BSD.itemTitles,
      range: [40, 128]
    });

    keyboardist = BSD.Widgets.SimplePlayer({
      context: context,
      destination: mixer.common,
      polyphonyCount: 48, //polyphonyCount,
      itemTitles: BSD.itemTitles, //['fundamental','octave','dominant','dominant+fourth(octave2)'],
      range: [28, 100]
    });
    keyboardist.publish('set-master-volume', BSD.volume);


    //this freak var came from the module section of JS above...
    freak.on('note-on', function(event) {
      //REMEMBER: this was sequencer-generated...not user MIDI controller created
      if (router && router.outPort && BSD.options.improv.midi) {
        let noteOnChannel = 0x90 + (BSD.options.improv.channel - 1);
        let noteOffChannel = 0x80 + (BSD.options.improv.channel - 1);
        let noteNum = event.noteNumber;
        let vel = BSD.options.improv.volume * BSD.volume; 
        vel = Math.floor(127 * vel);////[0..1] -> [0..127]
        router.outPort.send([noteOnChannel, noteNum, vel]);

        if (freak.opts.noteOffDisabled) {
          //console.log('freak.opts.noteOffDisabled, so I have to schedule noteOff myself!!');
          setTimeout(function() {
            router.outPort.send([noteOffChannel, noteNum, vel]);
          }, BSD.durations.note);
        }
        return "all done";
      }
      //okay, we'll synthesize using WekAudio LFO.
      campfire.publish('play-note', {
        note: Note(event.noteNumber),
        duration: BSD.durations.note
      });
    });
    freak.on('note-off', function(event) {
      //first check if we need to bother sending out MIDI note off

      let needToBother = router && router.outPort && BSD.options.improv.midi;
      if (!needToBother) {
        return false;
      }
      ////console.log('yes, needed to bother');
      let noteOffChannel = 0x80 + (BSD.options.improv.channel - 1);
      let noteNum = event.noteNumber;
      let vel = BSD.options.improv.volume * BSD.volume; 
      vel = Math.floor(127 * vel);////[0..1] -> [0..127]

      return router.outPort.send([noteOffChannel, noteNum, vel]);
    });


    campfire.subscribe('tempo-change', freak.tempoChange)
    freak.tempoChange(BSD.options.tempo);



    let pianoRoll = PianoRoll({
      ...freak.opts,
      events
    })
    let tablature = Tablature({});



    pianoRoll.on('note-hover', function(noteNumber) {
      BSD.currentNote = Note(noteNumber);
    });
    pianoRoll.on('note-preview', function(noteNumber) {
        campfire.publish('play-note', {
          note: Note(noteNumber),
          duration: BSD.durations.note
        })
      })
      .on('tempo-change', function(tempo) {
        freak.tempoChange(tempo);
      })
      .on('events-change',function(events,props){
        //freak already senses these
        tablature.update(props);
      });

    pianoRoll.on('is-playing', function(isPlaying) {
      //isPlaying shows the new going-forward wish
      isPlaying ? freak.play() : freak.stop();
    });
    pianoRoll.on('save',function(props) {
      //for future refactoring... pulling save logic from piano roll to here...
      console.log('piano roll save props',props);
    });
    pianoRoll.on('new-loop-object',function(obj){
      console.log('new loop object',obj);
      let opts = freak.update(obj);
      pianoRoll.update(opts);
      tablature.update(opts);
    });


    //jQuery('.piano-roll-wrap').append(pianoRoll.ui())


    let w = Vindow({
      title: "Piano Roll"
    });
    let [toolbar, pane] = pianoRoll.ui();
    w.appendToToolbar(toolbar);
    w.append(pane);
    w.renderOn(body);


    let svgFB = SVGFretboard();
    svgFB.plotFingerboardFrets();
    svgFB.plotInlays();
    svgFB.plotStrings();
    let fbWin = Vindow({
      title: 'Fretboard'
    });
    fbWin.renderOn(body);
    fbWin.append(svgFB.ui())



    let tabWindow = Vindow({
      title: "Tablature"
    });
    let [tabToolbar, tabPane] = tablature.ui();
    tabWindow.appendToToolbar(tabToolbar);
    tabWindow.append(tabPane);
    tabWindow.renderOn(body);

    const vinfo = VindowInfo();
    vinfo.renderOn(body);

    let saveTick = -1;

    freak.on('note-on', function(event) {
      if (event.tickIdx != saveTick) {
        svgFB.clearFretted();
        saveTick = event.tickIdx;
      }
      //console.log('note-on',event);
      campfire.emit('plot-svg-note', Note(event.noteNumber));
    });

    campfire.on('play-note',function(payload){
      //grab the UI interaction on the piano roll
      campfire.emit('plot-svg-note',payload.note)
    });

    campfire.on('plot-svg-note',function(note){

      const rwi = RootNoteWithIntervals({
        rootNote: note,
        intervals: [0]
      });
      svgFB.plotHelper({
        chordOrScale: rwi, 
          svgAlpha: BSD.svgAlpha,
          stringSet: BSD.options.stringSet,
          fretRange: BSD.options.fretRange, 
          opts: {
            maxCircleRadiusPercent: 0.8,
            minCircleRadiusPercent: 0.5
          }
      })
    })


    //LEAD / IMPROV
    campfire.on('play-note', function(payload) {
      ///console.log('play-note!!',payload);
      if (!BSD.options.improv.enabled) {
        return false;
      }

      if (router && router.outPort && BSD.options.improv.midi) {
        //another way to do noteOnChannel is
        //let byte1 = 0x90 + (oneBasedChannel - 1),

        let noteOnChannel = 0x90 + (BSD.options.improv.channel - 1);
        let noteOffChannel = 0x80 + (BSD.options.improv.channel - 1);
        let noteNum = payload.note.value();
        let vel = BSD.options.improv.volume * BSD.volume; 
        vel = Math.floor(127 * vel);////[0..1] -> [0..127]
        router.outPort.send([noteOnChannel, noteNum, vel]);

        setTimeout(function() {
          console.log('stopping!?!?!?!? !!!')
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


    let midiInfo = MIDIInfo({
      router,
      channel: BSD.options.improv.channel,
      patch: BSD.options.improv.patch
    });
    var vMIDIInfo = Vindow({
      title: 'MIDI Info'
    });
    let [miToolbar, miPane] = midiInfo.ui();
    vMIDIInfo.appendToToolbar(miToolbar),
      vMIDIInfo.append(miPane);
    vMIDIInfo.renderOn(body);



    let arranger = Arranger();
    arranger.renderOn(body);

    let vindows = [w, tabWindow, vMIDIInfo, vinfo,arranger];


    function myAutoArrange() {
      var br = document.body.getBoundingClientRect();
      var origin = Point(0,50); //x ignored for now.
      var corner = Point(br.right,0);//y ignored for now.
      autoArrange(allVindows, origin, corner);
    }

    //setInterval(myAutoArrange, 15000);
    myAutoArrange();
    var btnAutoArrange = DOM.from('.btn-auto-arrange');

    btnAutoArrange.on('click',myAutoArrange);

    window.allVindows = allVindows;

    let TAU = Math.PI * 2;
    let biggerIsSlower = 500000 // 1_000_000
    let magicHueRadians = (Date.now() / biggerIsSlower) % TAU;
    document.querySelectorAll('.vindow .header').forEach(elem => {
      setBackgroundHue(elem, magicHueRadians)
    });

    var midiInfoLCD = DOM.from(document.querySelector('.midi-info.lcd'));
    midiInfoLCD.css({ 
      filter: `hue-rotate(${magicHueRadians}rad)`
    });
    window.midiInfoLCD = midiInfoLCD;

  </script>
<?php
});


get_footer();

?>