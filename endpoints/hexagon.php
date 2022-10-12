<?php

add_action('wp_head', function () {
?>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
  <style type="text/css">
  </style>
<?php

});

get_header();
?>

<button id="more-palettes">Redraw Palettes</button>
<div class="noprint">
  <br />
  <br />
</div>
<div id="pickers"> </div><!-- pickers -->


<canvas id="HexCanvas" width="1000" height="700"></canvas>


<?php

add_action('wp_footer', function () {
?>
<script>
 var HAS_TOUCH = ('ontouchstart' in window);
</script>
  <script src="js/hexagon.js"></script>

  <script src="<?php home_url();  ?>/js/bsd.widgets.simpleplayer.js"></script>

<script type="module">


var HAS_TOUCH = ('ontouchstart' in window);

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

    let mixer = BSDMixer(context);


    var main = jQuery('#main');

    var flavors = ['-7', '7', '6', '-6', '-7b5', '7b9', 'M7', '13', '7#9', '-9', '9', 'M9', '-13', '+7', '', '-']; //fixme, what should this do? why are we limiting these?
    var flav = flavors.atRandom();


    var flavorMap = {
      '6': ['6', 'M7'],
      '-7': ['7', '7b9'],
      '-7b5': ['7b9', '7'],
      '7b9': ['M7', '-7', '-7b5'],
      '7': ['-7', 'M7', '6', '7'],
      'M7': ['M7', '-7']
    };

    ///////////////////////
    BSD.itemTitles = ['fundamental', 'octave', 'dominant', 'dominant+fourth(octave2)'];
    if (BSD.iOS) {
      BSD.itemTitles = ['fundamental'];
    }

    BSD.audioPlayer = BSD.Widgets.SimplePlayer({
      context: context,
      destination: mixer.common,
      polyphonyCount: 48, //polyphonyCount,
      itemTitles: BSD.itemTitles,
      range: [40, 128]
    });



    var radius = 35;
    var hexRows = 8;
    var hexColumns = 20;

    var hexagonGrid = new HexagonGrid("HexCanvas", radius);
    hexagonGrid.drawHexGrid(hexRows, hexColumns, 55, 55, true);
    hexagonGrid.msgs.subscribe('tile-clicked', function(o) {
      //console.log('o?',o); 
      var n = Note(o.midiValue);
      campfire.publish('play-note', {
        note: n,
        duration: 1000
      });
    });
    hexagonGrid.msgs.subscribe('tile-hovered', function(o) {
      //console.log('o?',o); 
      var n = Note(o.midiValue);
      BSD.currentNote = n;
      ///campfire.publish('play-note', { note: n, duration: 1000 });
    });


    campfire.subscribe('play-note', function(payload) {
      BSD.audioPlayer.playNote(payload.note, payload.duration);
    });
  </script>

<?php
});
get_footer();
