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


function buildSequence() {
  flip = false;
  sequence = [];
  sevenths.forEach(function(arp){
      if (BSD.options.alternate) {
          flip = !flip;
      }
      var ordered = flip ? arp.reverse() : arp;
      arp.forEach(noteName => {

          var note = Note(noteName.toUpperCase());
          if (last) {
              last.next = note;
          }
          last = note;
          sequence.push(note);
      });
  }); 
}


function tick(cursor) {
    if (!cursor) { 
        console.log("DONE");
        return "DONE";
    }
    keyboardist.playNote(cursor);
    setTimeout(function(){
        tick(cursor.next);
    },900);
}




</script>
<?php
});


get_footer();

 ?>