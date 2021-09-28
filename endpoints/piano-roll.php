<?php

add_filter('wp_title',function($o){ return "Piano Roll"; });

add_action('wp_head',function(){
    $classes = apply_filters('body_class',[]);

    foreach($classes as $c) {
        $file_path = APP_PATH . '/css/' . $c .'.css';
        $uri_path = get_stylesheet_directory_uri() . '/css/' . $c . '.css';
        //pp([$file_path,$uri_path],'did it work?'); 
        if (file_exists($file_path)) {
            echo sprintf('\n<link rel="stylesheet" href="%s">',$uri_path);
        }
    }
    //pp($classes,'classes');


});

add_action('wp_head',function(){
    ?>
<style>
    @import 'css/piano-roll.css';
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
    
add_action('wp_footer',function() {
?>
  <script src="<?php bloginfo('url'); ?>/js/bsd.widgets.simpleplayer.js"></script>

<script type="module">

import FreakySeq from "./js/FreakySeq.js";
import PianoRoll from "./js/PianoRoll.js";
import MIDIRouter from "./js/MIDIRouter.js";


const MIDI_MSG = {
    NOTE_OFF: 0x80,
    NOTE_ON: 0x90
}

let router = MIDIRouter({
    onMIDIMessage: function(e) {
        ////console.log("eeeeee",e);
        //console.log("BSD?",BSD)
        let [msg, noteNumber, velocity] = e.data;
        if (msg == MIDI_MSG.NOTE_ON) {
            campfire.publish('play-note',{ note: Note(noteNumber), duration: 1000 });
        }
    }

});

//toss this variable over the module/non-module fence for now until further refactoring is done.
window.router = router;

//why is campfire visible inside the module?
console.log('campfire?',campfire);

</script>
<script>
    let mixer, keyboardist;

    let openedMIDIOutput;

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
    storage.getItem('volume', function(o) {
      BSD.volume = parseFloat(o);
      ///waiter.beg(BSD.audioPlayer,'set-master-volume',BSD.volume);
      ////waiter.beg(bassist,'set-master-volume',BSD.volume);

      jQuery("#volume-amount").text(BSD.volume);
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




    function onAppLoad() {
      mixer = App.BSDMixer(context);
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


      let events = [];
      window.events = events;
      let freak = App.FreakySeq({
        events
      });
      window.freak = freak;
      freak.on('note-on',function(event){
        campfire.publish('play-note', {
          note: Note(event.noteNumber),
          duration: BSD.durations.note
        });
      });


      campfire.subscribe('tempo-change', freak.tempoChange)
      freak.tempoChange(BSD.options.tempo);



      let pianoRoll = App.PianoRoll({
        ...freak.opts,
        events: events
      })

      /*
      openedMIDIOutput = App.MIDIOutMonitor({
        port: outPort
      });
      jQuery('.monitor-wrap').append(openedMIDIOutput.ui())
      */

      pianoRoll.on('note-hover', function(noteNumber) {
        BSD.currentNote = Note(noteNumber);
      });
      pianoRoll.on('note-preview', function(noteNumber) {
        campfire.publish('play-note',{
          note: Note(noteNumber),
          duration: BSD.durations.note
        });


      });
      pianoRoll.on('is-playing',function(isPlaying){
        //isPlaying shows the new going-forward wish
        isPlaying ? freak.play() : freak.stop();
      });
      jQuery('.piano-roll-wrap').append(pianoRoll.ui())

    }

    //LEAD / IMPROV
    campfire.subscribe('play-note', function(payload) {
      if (!BSD.options.improv.enabled) {
        return false;
      }

      if (router && router.outPort && BSD.options.improv.midi) {
        //another way to do noteOnChannel is
        //let byte1 = 0x90 + (oneBasedChannel - 1),

        let noteOnChannel = 143 + BSD.options.improv.channel;
        let noteNum = payload.note.value();
        let vel = Math.floor(127 * BSD.options.improv.volume); //[0..1] -> [0..127]

        router.outPort.send([noteOnChannel, noteNum, vel]);
        return false;
      }
      // I suspect that user interaction on the page has to initiate the first 
      /// WebAudio API event... Once that happens, then the MIDI input is "felt" by the WebAudio API

      ///console.log('this should play, why am i not playing?',payload);
      // okay, currently no MIDI output, we'll use our WebAudio API synth
      BSD.audioPlayer.playNote(payload.note, payload.duration, payload.velocity);
    });






</script>
<?php    
});


get_footer();

?>