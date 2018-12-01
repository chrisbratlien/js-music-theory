<?php


add_action('wp_head',function(){
?>
<link rel="stylesheet" href="<?php bloginfo('url'); ?>/css/prog-fretboards.css">
<?php
});


get_header();
?>
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<input class="scale-name" value="C major" />
<input class="group" value="4" />
<input class="skip" value="1" />
<button class="btn btn-go">Go</button>
<div class="stage"></div>
<?php

add_action('wp_footer',function(){
?>
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.colorpicker.js"></script>
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



BSD.itemTitles = ['fundamental','octave','dominant','dominant+fourth(octave2)'];
if (BSD.iOS) {
  BSD.itemTitles = ['fundamental'];
}
////alert(BSD


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
////var sevenths = chordify(accum,4,1);

function buildSequence(scaleName,group,skip) {

  group = parseInt(group,10); 
  skip = parseInt(skip,10); 


  var myScale = makeScale(scaleName).octaveDown();
  var extra1 = myScale.octaveUp();
  var extra2 = extra1.octaveUp();

  accum = [];
  accum = accum.concat(myScale.noteValues());
  accum = accum.concat(extra1.noteValues());
  accum = accum.concat(extra2.noteValues());
  var lastNoteValue = accum[accum.length-1];
  console.log('lastNoteValue',lastNoteValue);
  sevenths = chordify(accum,group,skip);
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



  var stage = jQuery('.stage');
  BSD.boards = [];
  var activeStrings =  [1,2,3,4,5,6];
  var board;
  
  BSD.chosenColor = BSD.colorFromHex('#bbbbbb');



function tick(cursor) {
    if (!cursor) { 
        console.log("DONE");
        return "DONE";
    }
    console.log('cursor noteValue',cursor.value());
    keyboardist.playNote(cursor);

    var f = BSD.guitarData.detect(o => o.noteValue == cursor.value());
    board.publish('feature-fret',f);

    setTimeout(function(){
        tick(cursor.next);
    },900);
}


var pa = '#FF0000-#E6DF52-#FFDD17-#4699D4-#4699D4-#000000-#000000-#000000-#bbbbbb-#67AFAD-#8C64AB-#8C64AB'.split(/-/);

  var colorHash = {};
  var palette = pa.map(function(o) {
    return BSD.colorFromHex(o);
  });
  ///palette = BSD.randomPalette2(12,200);
  palette.forEach(function(color,i) {
    ///var color = palette.shift();
    colorHash[i] = color;
  });


  BSD.importJSON(BSD.baseURL + '/data/guitar.json',function(err,data) { 
    if (err) {
      throw err;
      return err;
    }
    BSD.guitarData = data;
    board = makeFretboardOn(stage,{
      //chord: chord,
      activeStrings: activeStrings
    });
    //BSD.boards.push(board);

  });




jQuery('.btn-go').click(function(){
  buildSequence(
    jQuery('.scale-name').val(),
    jQuery('.group').val(),
    jQuery('.skip').val()
  );
  tick(sequence[0]);
});


</script>
<?php
});



get_footer();

 ?>