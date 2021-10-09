<?php
add_filter('wp_title', function ($o) {
  return "Rulers";
});

add_action('wp_head', function () {
?>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
  <style type="text/css">
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
  </style>

  <title>Rulers</title>

<?php
});


get_header(); ?>

<div class="flex-column content seventy">
  <div class="flex-row">
    <button id="sticky-note-button">Sticky Note</button>
  </div>

  <strong>Progression</strong>

  <div class="flex-row align-items-center full-width">
    <div class="prog-wrap full-width pad2">
      <input id="progression" class="progression three-quarters-width" type="text" />
      <div class="btn-group">
        <button class="btn btn-sm btn-default" id="progression-clear">Clear</button>
        <button class="btn btn-sm btn-default" id="progression-help">Help</button>
      </div>

    </div>
    <div id="progression-help-content" style="display: none;">
      <h5>Help</h5>
      <p><strong>1</strong><br /> Type in a Chord progression into the box. Separate the chords with spaces or the "|" pipe character. <br /><br /><strong>2</strong><br /> Tab out of the text box to cause those rulers to appear.
        <br /><br /><strong>3</strong><br /> Hit the green button to sound that chord
        <br /><br /><strong>4</strong><br /> Hit other buttons too
        <br /><br /><strong>5</strong><br /> Click a note to toggle it on/off
      </p>
      <h3>Example progressions</h3>
      <p>A- B-7b5 C D- E- F G A-</p>
      <p>CM7 D-7 E-7 FM7 G7 A-7 B-7b5 CM7</p>
      <h3>Tips</h3>
      <p>Root notes by themselves are assumed major, ex: A</p>
      <p>Use - or m for minor, ex: A- Em</p>
      <p>Use M7 for major 7, ex: CM7</p>
      <p>Use 7 for dominant 7, ex: G7</p>
    </div>
  </div><!-- pull-right -->
  <strong>Presets</strong>

  <div class="flex-row full-width ">
    <br />
    <div id="ruler-control-panel" class="flex-row"></div><!-- ruler-control-panel -->
    <button class="btn btn-sm btn-default" id="bookmark">Bookmark these rulers</button>

  </div><!-- pull-right -->




  <div id="rulers"></div>
  <!--rulers -->
</div><!-- content -->


<?php

add_action('wp_footer', function () {
?>
  <script type="text/javascript" src="js/color.js"></script>
  <script type="text/javascript" src="js/bsd.widgets.lightbox.js"></script>
  <!--<script type="text/javascript" src="js/rulers.js"></script>-->
  <!-- wavetable dependencies -->
  <script src="js/bpm-delay.js"></script>
  <script src="js/waveshaper.js"></script>
  <script src="js/wavetable.js"></script>
  <script src="js/fft.js"></script>
  <script src="js/wavetableloader.js"></script>
  <script src="js/staticaudiorouting.js"></script>
  <script src="js/bsd.widgets.oscplayer.js"></script>





  <script src="js/bsd.widgets.simpleplayer.js"></script>
  <script src="js/bsd.widgets.tonalityguru.js"></script>


  <script type="text/javascript" src="js/bsd.widgets.procrastinator.js"></script>

  <script type="module">

import MIDIRouter from "./js/MIDIRouter.js";
import DOM from "./js/DOM.js";
import Vindow from "./js/Vindow.js";
import BSDMixer from "./js/BSDMixer.js";

    //careful, the scope of this constant is still just within this module
    import MIDI_MSG from "./js/MIDIConstants.js";
  import { Ruler, NullRuler, Minor7ChordRuler, MinorChordRuler, MajorChordRuler,
    Dominant7ChordRuler, Major7ChordRuler, Minor7Flat5ChordRuler,
    Dominant7Flat9ChordRuler, Dominant7Sharp9ChordRuler, Dominant7Flat5ChordRuler, MinorSixChordRuler,
    MajorSixChordRuler, MajorSixNineChordRuler, Diminished7ChordRuler,
    Dominant9ChordRuler, Minor9ChordRuler, Major9ChordRuler, Dominant13ChordRuler, Minor13ChordRuler, Major13ChordRuler
  } from "./js/Rulers.js";

    BSD.ChordRulerPanel = function(spec) {
      var self = BSD.PubSub({});
      var rulersWrap = jQuery('#rulers');
      self.renderOn = function(wrap) {
        wrap.append(
          DOM.div()
          .addClass('btn-group')
          .append(
            spec.builders.map(function(b) {
              /////console.log('b',b);
              return DOM.button()
                .addClass('btn btn-default btn-sm')
                .html(b.name)
                .on('click', function() {
                  var ruler = b.constructor({
                    ////////palette: BSD.randomPalette2(128,70),
                  });
                  ruler.subscribe('click', function(o) {
                    self.publish('click', o);
                  });
                  ruler.subscribe('play-chord', function(o) {
                    self.publish('play-chord', o);
                  });

                  ruler.renderOn(rulersWrap);
                })
            })))
      };
      return self;
    };

    var waiter = BSD.Widgets.Procrastinator({
      timeout: 250
    });


    let router;


    let mixer = BSDMixer(context);

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
        console.log('msg', msg);

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







      mixer = BSDMixer(context);
      BSD.audioPlayer = BSD.Widgets.SimplePlayer({
        context: context,
        destination: mixer.common,
        polyphonyCount: 48, //polyphonyCount,
        itemTitles: BSD.itemTitles,
        range: [40, 128]
      });
      ///waiter.beg(BSD.audioPlayer, 'set-master-volume', BSD.volume);
      BSD.audioPlayer.publish('set-master-volume', BSD.volume || 0.06);



    BSD.chosenColor = BSD.colorFromHex('#000000');
    BSD.ColorPicker = function(spec) {
      var self = {};
      self.renderOn = function(html) {
        var square = DOM.div('').addClass('color-picker');
        square.css('background-color', '#' + spec.color.toHex());
        square.click(function() {
          BSD.chosenColor = spec.color;
        });
        html.append(square);
      };
      return self;
    };
    BSD.grey = BSD.Color({
      r: 300,
      g: 300,
      b: 300
    });
    BSD.lightGrey = BSD.Color({
      r: 200,
      g: 200,
      b: 200
    });
    BSD.penDown = false;
    jQuery(document).keypress(function(e) {
      if (e.charCode == 96) { //backtick
        BSD.penDown = !BSD.penDown;
      }
    });
    jQuery(document).ready(function() {
      var campfire = BSD.PubSub({});




      var stickyNoteButton = jQuery('#sticky-note-button');
      stickyNoteButton.click(function(e) {
        var sticky = BSD.Widgets.StickyNote(e);
        sticky.renderOn(jQuery(document.body));
      });

      var panelDiv = jQuery('#ruler-control-panel');

      var panel = BSD.ChordRulerPanel({
        builders: [{
            name: 'empty',
            constructor: NullRuler
          },
          /*
          {
            name: 'notes',
            constructor: BSD.NoteRuler
          },
          {
            name: 'major scale',
            constructor: BSD.MajorScaleRuler
          },
          {
            name: 'minor scale',
            constructor: BSD.MinorScaleRuler
          },
          {
            name: 'HM scale',
            constructor: BSD.HarmonicMinorScaleRuler
          },

          {
            name: 'MP scale',
            constructor: BSD.MajorPentatonicScaleRuler
          },
          {
            name: 'mP scale',
            constructor: BSD.MinorPentatonicScaleRuler
          },
          {
            name: 'blues scale',
            constructor: BSD.BluesScaleRuler
          },
          {
            name: 'MP Pattern',
            constructor: BSD.MajorPentatonicPatternRuler
          },
          */

          {
            name: '-',
            constructor: MinorChordRuler
          },
          {
            name: 'M',
            constructor: MajorChordRuler
          },


          {
            name: '7',
            constructor: Dominant7ChordRuler
          },
          {
            name: '-7',
            constructor: Minor7ChordRuler
          },
          {
            name: 'M7',
            constructor: Major7ChordRuler
          },

          {
            name: '-7b5',
            constructor: Minor7Flat5ChordRuler
          },

          {
            name: '7b9',
            constructor: Dominant7Flat9ChordRuler
          },
          {
            name: '7#9',
            constructor: Dominant7Sharp9ChordRuler
          },
          {
            name: '7b5',
            constructor: Dominant7Flat5ChordRuler
          },
          {
            name: '-6',
            constructor: MinorSixChordRuler
          },
          {
            name: '6',
            constructor: MajorSixChordRuler
          },
          {
            name: '6/9',
            constructor: MajorSixNineChordRuler
          },
          {
            name: 'o7',
            constructor: Diminished7ChordRuler
          },

          {
            name: '9',
            constructor: Dominant9ChordRuler
          },
          {
            name: '-9',
            constructor: Minor9ChordRuler
          },
          {
            name: 'M9',
            constructor: Major9ChordRuler
          },

          {
            name: '13',
            constructor: Dominant13ChordRuler
          },
          {
            name: '-13',
            constructor: Minor13ChordRuler
          },
          {
            name: 'M13',
            constructor: Major13ChordRuler
          }

        ]
      });

      panel.renderOn(panelDiv);
      panel.subscribe('click', function(o) {
        //console.log('oh',o);
        campfire.publish('play-note', {
          note: o,
          duration: 1000
        });
      });

      panel.subscribe('play-chord', function(o) {
        campfire.publish('play-chord', {
          chord: o,
          duration: 1000
        });
      });


      campfire.subscribe('BSD.Widgets.WaveTablePlayer loaded', function(o) {
        jQuery('#msg').html(o.name + ' loaded. You may begin rocking out');
      });


      var polyphonyCount = 48;






      BSD.volume = 0;
      storage.getItem('volume', function(o) {
        BSD.volume = parseFloat(o);
        jQuery("#volume-amount").text(BSD.volume);
      });



      $("#volume-input").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 0.1,
        step: 0.01,
        value: BSD.volume,
        slide: function(event, ui) {
          var newVolume = ui.value;
          waiter.beg(BSD.audioPlayer, 'set-master-volume', newVolume);
          storage.setItem('volume', newVolume);
          ////waiter.beg(BSD.chunker,'set-master-volume',ui.value);
          jQuery("#volume-amount").text(newVolume);
        }
      });

      //FIXME: standardize options across pages.
      BSD.options = {
        improv: {
          enabled: true,
          volume: 0.5,
          channel: 3,
          midi: true
        }
      }

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
        let noteNum = payload.note.value();
        let vel = Math.floor(127 * BSD.options.improv.volume); //[0..1] -> [0..127]

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




      var rulersWrap = jQuery('#rulers');
      var vars = getUrlVars();
      ////console.log('vars',vars);
      if (typeof vars.rulers != "undefined") {
        var them = eval(vars.rulers);
        ////console.log('them',them);

        them.each(function(set) {
          var state = BSD.allMIDIValues.map(function(tf) {
            return false;
          });

          set.each(function(mv) {
            state[mv] = true;
          });
          //////console.log('state',state);
          var ruler = Ruler({
            items: [],
            state: state
          });
          ruler.subscribe('click', function(o) {
            campfire.publish('play-note', {
              note: o,
              duration: 1000
            });
          });
          ruler.subscribe('play-chord', function(o) {
            campfire.publish('play-chord', {
              chord: o,
              duration: 1000
            });
          });
          ruler.renderOn(rulersWrap);
          BSD.rulers.push(ruler);
        });
      }
      var btnBookmark = jQuery('#bookmark');
      btnBookmark.click(function() {
        var sets = BSD.rulers.select(function(ruler) {
          return !ruler.deleted;
        }).map(function(ruler) {
          return ruler.allMIDIValuesCurrentlyOn();
        });
        ////console.log('sets',JSON.stringify(sets));
        var url = 'rulers?rulers=' + JSON.stringify(sets);
        ////console.log(url);
        window.location.href = url;
      });


      var progInput = jQuery('#progression');
      progInput.blur(function() {
        if (progInput.val().length == 0) {
          return false;
        }
        //campfire.publish('new-progression', progInput.val());

        var prog = BSD.parseProgression(progInput.val());
        ///////campfire.publish('do-it-prog',prog);
        campfire.publish('new-progression', prog);

      });
      var progClear = jQuery('#progression-clear');
      progClear.click(function() {
        progInput.val(null);
        jQuery('#rulers').empty();
        BSD.rulers = [];
      });
      var progHelp = jQuery('#progression-help');
      progHelp.click(function() {
        var lightbox = BSD.Widgets.Lightbox({
          content: jQuery('#progression-help-content')
        });
        lightbox.show();
      });

      //todo, replace with BSD.parseProgression??
      campfire.subscribe('new-progression', function(progression) {

        let chords = progression.map(o => o.chord);
        chords.forEach(function(chord) {

          var set = chord.noteValues().map(function(val) {
            return val;
            // I guess I'm happy with this now, so nevermind ///return val - 12;
          }); //WAS: octave down from what the js-music-theory library would use (with C=60 as middle C)"

          var state = BSD.allMIDIValues.map(function(tf) {
            return false;
          });
          set.each(function(mv) {
            state[mv] = true;
          });
          //////console.log('state',state);
          var ruler = Ruler({
            items: [],
            state: state
          });
          ruler.subscribe('click', function(o) {
            campfire.publish('play-note', {
              note: o,
              duration: 1000
            });
          });
          ruler.subscribe('play-chord', function(o) {
            campfire.publish('play-chord', {
              chord: o,
              duration: 1000
            });
          });
          ruler.renderOn(rulersWrap);
          BSD.rulers.push(ruler);
        });
      });
    });



    storage.getItem('progHelpShown', function(o) {
      if (!o) {
        progHelp.trigger('click');
        storage.setItem('progHelpShown', true);
      }
    });
  </script>
  <script>
    function onAppLoad() {
      ///
    }
    </script>
<?php
});

get_footer();
