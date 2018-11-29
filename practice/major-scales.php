<?php




get_header();


add_action('wp_footer',function(){
?>
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.songlist.js"></script>
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.simpleplayer.js"></script>
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.tonalityguru.js"></script>    
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.fretboard.js"></script>    
<script>

var common = context.createGain();
common.gain = 1.0;

var wet = context.createGain();
var dry = context.createGain();


var convolver = context.createConvolver();
convolver.buffer = impulseResponse(1.5,1.5,false);

wet.gain.value = 0.4;
wet.connect(convolver);
convolver.connect(context.destination);

dry.gain.value = 0.6;
dry.connect(context.destination);

common.connect(wet);
common.connect(dry);



var keyboardist = BSD.Widgets.SimplePlayer({
  context: context,
  destination: common,
  polyphonyCount: 48,//polyphonyCount,
  itemTitles: BSD.itemTitles,//['fundamental','octave','dominant','dominant+fourth(octave2)'],
  range: [28,100]
});


campfire.subscribe('set-master-volume',function(o){
  BSD.audioPlayer.publish('set-master-volume',o);
  bassist.publish('set-master-volume',o);
  keyboardist.publish('set-master-volume',o);
});



var sequence = [];

var sevenths = chordify(['c','d','e','f','g','a','b'],4,1);
console.log('sevenths',sevenths);

var last = null;
var flip = false;

BSD.options = {
    alternate: true
};

var cMajorScale = makeScale('C major').octaveDown();
var extra1 = cMajorScale.octaveUp();
var extra2 = extra1.octaveUp();

var accum = [];
accum = accum.concat(cMajorScale.noteValues());
accum = accum.concat(extra1.noteValues());
accum = accum.concat(extra2.noteValues());
var sevenths = chordify(accum,4,1);

var lastNoteValue = accum[accum.length-1];
console.log('lastNoteValue',lastNoteValue);
function buildSequence() {
  var done = false;
  flip = false;
  sequence = [];

  sevenths.forEach(function(arp){
    if (done) {
        console.log("DONE WITH SEVENTHS");
        return false;
    }
      if (BSD.options.alternate) {
          flip = !flip;
      }
      var ordered = flip ? arp.reverse() : arp;
      ordered.forEach(noteValue => {

          var note = Note(noteValue);
          if (last) {
              last.next = note;
          }
          last = note;
          sequence.push(note);
      });
      if (arp[0] == lastNoteValue) {
        done = true;
      }   
  }); 
}


function tick(cursor) {
    if (!cursor) { 
        console.log("DONE");
        return "DONE";
    }
    console.log('cursor noteValue',cursor.value());
    keyboardist.playNote(cursor);
    setTimeout(function(){
        tick(cursor.next);
    },900);
}

  BSD.importJSON(BSD.baseURL + '/data/guitar.json',function(err,data) { 
    if (err) {
      throw err;
      return err;
    }
    BSD.guitarData = data;
  });

</script>
<?php
});


get_footer();

 ?>