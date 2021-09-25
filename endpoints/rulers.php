<?php

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
  <script type="text/javascript" src="js/rulers.js"></script>
  <!-- wavetable dependencies -->
  <script src="js/bpm-delay.js"></script>
  <script src="js/waveshaper.js"></script>
  <script src="js/wavetable.js"></script>
  <script src="js/fft.js"></script>
  <script src="js/wavetableloader.js"></script>
  <script src="js/staticaudiorouting.js"></script>
  <script src="js/bsd.widgets.oscplayer.js"></script>




  <!--<script src="js/bsd.widgets.baseplayer.js"></script>
<script src="js/bsd.widgets.stringoscillator.js"></script>
<script src="js/bsd.widgets.guitarplayer.js"></script>
<script src="js/bsd.widgets.simpleplayer.js"></script>
<script src="js/bsd.guitar.js"></script>
-->




  <script src="js/bsd.widgets.simpleplayer.js"></script>
  <script src="js/bsd.widgets.tonalityguru.js"></script>


  <script type="text/javascript" src="js/bsd.widgets.procrastinator.js"></script>


  <script type="text/javascript">
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

    let mixer;
    var waiter = BSD.Widgets.Procrastinator({
      timeout: 250
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
      ///waiter.beg(BSD.audioPlayer, 'set-master-volume', BSD.volume);
      BSD.audioPlayer.publish('set-master-volume', BSD.volume || 0.06);
    }



    BSD.chosenColor = BSD.colorFromHex('#000000');
    BSD.ColorPicker = function(spec) {
      var interface = {};
      interface.renderOn = function(html) {
        var square = DOM.div('').addClass('color-picker');
        square.css('background-color', '#' + spec.color.toHex());
        square.click(function() {
          BSD.chosenColor = spec.color;
        });
        html.append(square);
      };
      return interface;
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
            constructor: BSD.NullRuler
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
            constructor: BSD.MinorChordRuler
          },
          {
            name: 'M',
            constructor: BSD.MajorChordRuler
          },


          {
            name: '7',
            constructor: BSD.Dominant7ChordRuler
          },
          {
            name: '-7',
            constructor: BSD.Minor7ChordRuler
          },
          {
            name: 'M7',
            constructor: BSD.Major7ChordRuler
          },

          {
            name: '-7b5',
            constructor: BSD.Minor7Flat5ChordRuler
          },

          {
            name: '7b9',
            constructor: BSD.Dominant7Flat9ChordRuler
          },
          {
            name: '7#9',
            constructor: BSD.Dominant7Sharp9ChordRuler
          },
          {
            name: '7b5',
            constructor: BSD.Dominant7Flat5ChordRuler
          },
          {
            name: '-6',
            constructor: BSD.MinorSixChordRuler
          },
          {
            name: '6',
            constructor: BSD.MajorSixChordRuler
          },
          {
            name: '6/9',
            constructor: BSD.MajorSixNineChordRuler
          },
          {
            name: 'o7',
            constructor: BSD.Diminished7ChordRuler
          },

          {
            name: '9',
            constructor: BSD.Dominant9ChordRuler
          },
          {
            name: '-9',
            constructor: BSD.Minor9ChordRuler
          },
          {
            name: 'M9',
            constructor: BSD.Major9ChordRuler
          },

          {
            name: '13',
            constructor: BSD.Dominant13ChordRuler
          },
          {
            name: '-13',
            constructor: BSD.Minor13ChordRuler
          },
          {
            name: 'M13',
            constructor: BSD.Major13ChordRuler
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

      /*
            $("#detune-input").slider({
              orientation: "vertical",
              range: "min",
              min: -7.0,
              max: 7.0,
              step: 0.25,
              value: 0.0,
              slide: function(event, ui) {
                var n = ui.value;

                waiter.beg(BSD.audioPlayer, 'set-detune-semis', n);
                //////campfire.publish('set-speed-ms',n);
                jQuery("#detune-amount").text(n);
              }
            });
            */
      var list = ['Piano'];
      ///var chosen = list.atRandom();
      campfire.subscribe('play-note', function(payload) {
        BSD.audioPlayer.playNote(payload.note, payload.duration);
      });
      campfire.subscribe('play-chord', function(o) {
        BSD.audioPlayer.playChord(o.chord, o.duration);
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
          var ruler = BSD.Ruler({
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
          var ruler = BSD.Ruler({
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
<?php
});

get_footer();
