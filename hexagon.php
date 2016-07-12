<?php

add_action('wp_head',function(){
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
  <br/>
  <br/>
</div>
<div id="pickers">   </div><!-- pickers -->


<canvas id="HexCanvas" width="1000" height="700"></canvas>


<?php

add_action('wp_footer',function(){
?>
<!--<script src="lib/Hexagon.js/hexagon.js"></script> -->
<script src="js/hexagon.js"></script>
<script type="text/javascript">



var HAS_TOUCH = ('ontouchstart' in window);

if (typeof BSD == "undefined") {
  var BSD = {};    
}
BSD.chosenColor = BSD.colorFromHex('#888888');
BSD.ColorPicker = function(spec) {
  var self = {};
  self.renderOn = function(html) {
///console.log('hello');
    var square = DOM.div('').addClass('color-picker');
    square.css('background-color','#' + spec.color.toHex());
    square.click(function() {
      BSD.chosenColor = spec.color;
    });
////console.log('html',html);
    html.append(square);
  };
  return self;
};


  context = new webkitAudioContext();
  BSD.audioContext = context;
  
  
  
//ios trick
var unlocked = false;
window.addEventListener('touchstart', function() {
  if (unlocked) return false;
  unlocked = true;
  ///alert('unlocked');
	// create empty buffer
	var buffer = myContext.createBuffer(1, 1, 22050);
	var source = myContext.createBufferSource();
	source.buffer = buffer;

	// connect to output (your speakers)
	source.connect(context.destination);

	// play the file
	source.noteOn(0);

}, false);
  
  
  
  
  BSD.currentFretDiv = false;
  
  var pickers = jQuery('#pickers');
  
  var morePalettes = jQuery('#more-palettes');
  
  var palettes = [];
  
  


  
  
  campfire.subscribe('redraw-palettes',function(){
    pickers.empty();
    palettes = [];
    palettes.push(BSD.colorFromHex('000000').upTo(BSD.colorFromHex('FFFFFF'),20));
    palettes.push(BSD.randomPalette2(10,60));
    palettes.push(BSD.randomPalette2(10,60));
    palettes.push(BSD.randomPalette2(10,60));
    palettes.push(BSD.randomPalette2(10,50));
    palettes.push(BSD.randomPalette2(10,40));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.push(BSD.randomPalette2(10,30));
    palettes.each(function(pal) {
      pal.each(function(randcolor) { 
      var picker = BSD.ColorPicker({ color: randcolor});
      picker.renderOn(pickers);
      });
    });
  });
  
  morePalettes.click(function(){
    campfire.publish('redraw-palettes');
  });
  campfire.publish('redraw-palettes');






  BSD.parseProgression = function(progString) {
    var barStrings = progString.split(/\ +|\|/);
    
    barStrings = barStrings.select(function(o){ return o.length > 0; });
    
    
    
    var barIndex = 0;
    var chordIndex = 0;
    var flat = [];
    
    barStrings.each(function(barString){
      var chordNames = barString.split(/,|\ +/);
      var halfBar = false;
      if (chordNames.length == 2) {
        halfBar = true;
      }
      
      
      
      chordNames.each(function(o){
        var origChord = makeChord(o);        
        var lowerChord = origChord.plus(-12);  
        
        flat.push({
          barIndex: barIndex,
          chordIndex: chordIndex,
          chord: lowerChord,
          halfBar: halfBar
        });
        chordIndex += 1;        
      });
      barIndex += 1;
    });

    return flat;
    ///wait
    var result = eachify(flat);
    console.log('result',result);
    return result;
  };
        
    BSD.audioPlayer = BSD.Widgets.GuitarPlayer({
      ////gossip: campfire,
      context: context,
      ////name: 'Piano',//chosen, //'Piano',
      polyphonyCount: 96,//polyphonyCount,
      range: [-300,128]
    });
      
    
    
    var waiter = BSD.Widgets.Procrastinator({ timeout: 250 });


    BSD.volume = 0;
    storage.getItem('volume',function(o){
        BSD.volume = parseFloat(o);
        waiter.beg(BSD.audioPlayer,'set-master-volume',BSD.volume);
        jQuery( "#volume-amount" ).text( BSD.volume );
    });


    $( "#volume-input" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 0.1,
      step: 0.01,
      value: BSD.volume,
      slide: function( event, ui ) {
        var newVolume = ui.value;
        waiter.beg(BSD.audioPlayer,'set-master-volume',ui.value);
        ////waiter.beg(BSD.chunker,'set-master-volume',ui.value);
        jQuery( "#volume-amount" ).text( newVolume );
      }
    });


   
  jQuery(document).on('keydown',function(e) {
    var c = e.keyCode || e.which;
    
    if (BSD.currentNote && c == BSD.keycodes.f) {
      BSD.audioPlayer.playNote(BSD.currentNote,1000);    
    }
          
  });

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


  
  
  var main = jQuery('#main');

  var flavors = ['-7','7','6','-6','-7b5','7b9','M7','13','7#9','-9','9','M9','-13','+7','','-']; //fixme, what should this do? why are we limiting these?
  var flav = flavors.atRandom();


    var flavorMap = {
      '6': ['6','M7'],
      '-7': ['7','7b9'],
      '-7b5': ['7b9','7'],
      '7b9': ['M7','-7','-7b5'],
      '7': ['-7','M7','6','7'],
      'M7': ['M7','-7']
    };

  ////var currentRootNote = JSMT.twelveNotes().atRandom();
  var randColor = BSD.randomDarkColor(); ////palettes.atRandom().atRandom();



  jQuery('#redo').click(function(){
    var myChords = [];
    var current = JSMT.twelveNotes().atRandom();
    for (var i = 0; i < 12; i += 1) {
      var chord = current.chord(flav);
      myChords.push(chord);
      current = current.fourth();
      flav = flavorMap[flav].atRandom();
    }
    console.log('myChords',myChords);////.map(function(o){ return o.utf8FullAbbrev(); }));
    ///return false;

    //////currentRootNote = 

    campfire.publish('do-it',myChords);
  });
  campfire.publish('do-it',[]);


  campfire.subscribe('note-hover',function(note){
    //console.log('note',note.name());
    BSD.currentNote = note;
      if (BSD.strum) {
        BSD.audioPlayer.playNote(note,1000);          
      }
  });


  jQuery(document).on('keydown',function(e) {
    var c = e.keyCode || e.which;
    
    console.log(c);///'BSD.currentFretDiv',BSD.currentFretDiv);


    /*** possibly obsolete...not 100% sure though yet..    
    if (BSD.currentFretDiv && c == BSD.keycodes.f) {
      BSD.currentFretDiv.trigger('click');    
    }
    ****/
    


    if (BSD.currentNote && c == BSD.keycodes.f) {
      BSD.audioPlayer.playNote(BSD.currentNote,1000);    
    }

    if (BSD.currentChord && c == BSD.keycodes.f) {
      BSD.audioPlayer.playChord(BSD.currentChord,1000);    
    }



    if (BSD.currentNote && c == BSD.keycodes.d) {
      BSD.strum = true;
      ////BSD.audioPlayer.playNote(BSD.currentNote,1000);    
    }
    
    if (e.shiftKey) {
      BSD.strum = true;
    }
    
    
    
  });
  
  jQuery(document).on('keyup',function(e) {
    BSD.strum = false;
  });


///////////////////////

    var hexagonGrid = new HexagonGrid("HexCanvas", 55);
    hexagonGrid.drawHexGrid(7, 10, 50, 50, true);
    hexagonGrid.msgs.subscribe('tile-clicked',function(o){ 
      //console.log('o?',o); 
      var n = Note(o.midiValue);
      campfire.publish('play-note', { note: n, duration: 1000 });
    });
    hexagonGrid.msgs.subscribe('tile-hovered',function(o){ 
      //console.log('o?',o); 
      var n = Note(o.midiValue);
      BSD.currentNote = n;
      ///campfire.publish('play-note', { note: n, duration: 1000 });
    });
    
    
   campfire.subscribe('play-note',function(payload) {
      BSD.audioPlayer.playNote(payload.note,payload.duration);    
   });    
       




</script>

<?php
});
  get_footer();