<?php
add_filter('wp_title',function($o){ return 'Major Scales'; });


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
<input class="octaves" value="2" />
<input class="tempo" value="100" />
<div class="btn-group">
  <button class="btn btn-play"><i class="fa fa-play"></i></button>
  <button class="btn btn-pause"><i class="fa fa-pause"></i></button>
  <button class="btn btn-rewind"><i class="fa fa-backward"></i></button>
  <button class="btn btn-fast-forward"><i class="fa fa-forward"></i></button>
</div>
<div class="stage"></div>
<?php

add_action('wp_footer',function(){
?>
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.colorpicker.js"></script>
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.songlist.js"></script>
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.simpleplayer.js"></script>
<script src="<?php bloginfo('url'); ?>/js/bsd.widgets.tonalityguru.js"></script>    
<script src="<?php bloginfo('url'); ?>/js/fret.js"></script>    
<script src="<?php bloginfo('url'); ?>/js/collection.js"></script>    
<script src="<?php bloginfo('url'); ?>/js/math/statsarray.js"></script>    
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
///console.log('sevenths',sevenths);

var last = null;
var flip = false;

BSD.options = {
    alternate: true
};

//var cMajorScale = makeScale('C major').octaveDown();
//var extra1 = cMajorScale.octaveUp();
///var extra2 = extra1.octaveUp();

var accum = [];
////var sevenths = chordify(accum,4,1);

function buildSequence(scaleName,group,skip,octaves) {

  fretHistory = [];
  fretHistory.push(previousFret);
  fretHistory.push(previousFret);
  group = parseInt(group,10); 
  skip = parseInt(skip,10); 
  octaves = parseInt(octaves,10); 

  var myScale = makeScale(scaleName).octaveDown();
  accum = [];
  var hold = myScale;
  accum = accum.concat(hold.noteValues());
  for (var i = 0; i < octaves-1; i += 1) {
    hold = hold.octaveUp();
    accum = accum.concat(hold.noteValues());
  }
  ///var extra2 = extra1.octaveUp();
  ///accum = accum.concat(extra2.noteValues());
  var lastNoteValue = accum[accum.length-1];
  console.log('lastNoteValue',lastNoteValue);
  console.table([accum]);
  sevenths = chordify(accum,group,skip);


console.log('sevenths',sevenths);
console.table([sevenths]);

  var done = false;
  flip = false;
  sequence = [];

  sevenths.forEach(function(arp){
    arp = new StatsArray(...arp);
    console.log('arp');
    console.table([arp]);
    if (arp.range() > 12) {
      console.log("WEE DONE");
      done = true;
    }
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

  var previousFret;
  var fretHistory = [];

  var saveCursor;
  var handle = false;
  var paused = false;
  var tempoMS = BSD.tempoToMillis(BSD.options.tempo);


function tick(cursor) {
    saveCursor = cursor;
    if (!cursor) { 
        console.log("DONE");
        return "DONE";
    }
    //console.log('cursor noteValue',cursor.value());
    keyboardist.playNote(cursor);

    //let testFret = fretHistory[fretHistory.length-2];
    let testFret = fretHistory[fretHistory.length-2];

    var candidates = BSD.frets.select(o => o.spec.noteValue == cursor.value());
    var sorted = candidates.sort(BSD.sorter(fret => {
      let mp = testFret.midpointTo(previousFret);
      var direct = fret.distanceSquaredTo(mp);
      var dx = fret.fretDistanceTo(mp);
      var dy = fret.stringDistanceTo(mp);
      var adx = Math.abs(dx);
      var ady = Math.abs(dy);
      
      return direct + adx;// - ady;
      ////return dx;
    }));
    var f = sorted[0];
    board.publish('feature-fret',f.spec);
    previousFret = f;
    fretHistory.push(f);
    if (paused) {
      return "PAUSED";
    }
    handle = setTimeout(function(){
        tick(cursor.next);
    },tempoMS);
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
    BSD.frets = BSD.guitarData.map(o => new Fret(o));
    board = makeFretboardOn(stage,{
      //chord: chord,
      activeStrings: activeStrings
    });
    //BSD.boards.push(board);
    previousFret = BSD.frets.detect(o => o.spec.string == 5 && o.spec.fret == 3);
    //history.push(previousFret);
  });




jQuery('.btn-play').click(function(){
  BSD.options.tempo = parseInt(jQuery('.tempo').val(),10);
  tempoMS = BSD.tempoToMillis(BSD.options.tempo);
  if (paused) {
    paused = false;
    tick(saveCursor);
    return false;
  }
  var scaleName = jQuery('.scale-name').val();
  buildSequence(
    scaleName,
    jQuery('.group').val(),
    jQuery('.skip').val(),
    jQuery('.octaves').val()
  );
  saveCursor = sequence[0];
  board.publish('scale-change',makeScale(scaleName));
  tick(saveCursor);
});

jQuery('.btn-pause').click(function(){
  paused = true;
});




</script>
<?php
});



get_footer();

 ?>