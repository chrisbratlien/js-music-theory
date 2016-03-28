<?php

add_action('wp_head',function(){
?>
<style type="text/css">

#quiz-output .note { font-size: 3em; }



#main { 
  float: left;
  width: 100%; 
}

.ruler {
  position: relative;
  float: left; 
  padding: 0; 
  margin: 0; 
  cursor: pointer; 
}

.ruler div { 
  width: auto;
  height: auto;
  max-width: none;
  max-height: none;
}

.ruler .title { 
  text-align: center; 
  font-size: 1rem; 
  line-height: 1.55rem;
  max-width: none;
}


.ruler .cell {  

  height: 50px; 
  line-height: 50px; 

  font-size: 50px;
  padding: 3px; 
  text-align: center; 
  color: #bbb;
}
.ruler .active { background: #33b; color: white; }



/* iphone 5 in portrait */
@media only screen 
and (min-device-width : 320px) 
and (max-device-width : 568px) 
and (orientation : portrait) { /* STYLES GO HERE */

  

}



/* ipad in portrait or landscape */
@media only screen 
/** and (min-device-width : 768px) ***/
/*** and (max-device-width : 1024px){ ***/   /* STYLES GO HERE */
and (min-width : 768px) {


  .ruler .cell {  
    height: 20px; 
    line-height: 20px; 
    font-size: 20px; 
  }


}





/* desktop and laptop */
@media only screen and (min-width : 1224px) {


  .ruler .cell {  
    height: 10px; 
    line-height: 10px; 
    font-size: 10px; 
  }

  #progression { width: 100%: }

}

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
      
      <div class="progression-form">
        <button id="redo">Redo</button>
        <label>Progression</label>
        <input type="text" id="progression" class="form-control" />
      
      </div>
      <br />
      <div id="main"></div>

<?php

add_action('wp_footer',function(){
?>
 
<script type="text/javascript">

///var campfire = BSD.PubSub({});

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
      polyphonyCount: 48,//polyphonyCount,
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

  var flavors = ['-7','7','6','-6','-7b5','7b9','M7','13','7#9','-9','9','M9','-13','+7']; //fixme, what should this do? why are we limiting these?
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


  campfire.subscribe('repaint-wrap',function(payload) {

    var state = {};


    JSMT.allMIDIValues.select(function(o) {
      return o >= 40 && o <= 70;
    }).reverse().each(function(n){
      var cell = DOM.div().addClass('cell');
      var note = Note(n);
      cell.append(note.utf8Name());
      
      var isChordTone = payload.chord.containsNote(note);
      
      state[n] = isChordTone;

      if (isChordTone) {
        cell.css('background','#' + randColor.toHex());
        cell.addClass('active');  
      }

      
      cell.on('mouseenter mouseover touchend',function(e){
        ////console.log('hover',note);
        //console.log('e',e);
        if (e.shiftKey) { return false; }
        if (isChordTone && state[n]) {
          BSD.audioPlayer.playNote(note,1000);
        }
        campfire.publish('note-hover',note);
      });
      
      cell.click(function(){
        state[n] = (state[n]) ? false : true;


        if (state[n] && isChordTone) {
          cell.css('background','#' + randColor.toHex());
          cell.addClass('active');  
        }
        else if (state[n]) {
          cell.css('background','#' + BSD.chosenColor.toHex());
          cell.addClass('active');  
        }
        else {
          cell.css('background','inherit');
          cell.removeClass('active');  
        }
      
      });
      
      
      
      payload.wrap.append(cell);
    });
    ////console.log(currentRootNote.name());  
  });


  campfire.subscribe('do-it',function(chords){

    randColor = BSD.randomDarkColor(); ////palettes.atRandom().atRandom();
    main.empty();

    chords.each(function(chord){  
      
      var alternates = flavors.map(function(txt){
        var c = chord.rootNote.chord(txt);
        return c;
      });
      
      eachify(alternates).eachPCN(function(o){
        o.current.next = o.next;
        o.current.prev = o.prev;
      });
      
      /////console.log('alternates',alternates);
      
      
      chord = alternates.detect(function(alt){
        return alt.abstractlyEqualTo(chord);
      }); //upgrade chord to itself in the alternates
      
      
      var ul = DOM.div().addClass('ruler');

      var title = DOM.div().addClass('title');
      var wrap = DOM.div().addClass('wrap');
      
      title.html(chord.utf8FullAbbrev());
      title.on('click',function(){
        chord = chord.next;
        title.html(chord.utf8FullAbbrev());
        wrap.empty();
        campfire.publish('repaint-wrap',{ wrap: wrap, chord: chord });
      });
      campfire.publish('repaint-wrap',{ wrap: wrap, chord: chord });
      
      
      ul.append(title);  
      ul.append(wrap);
      
      main.append(ul);
      
    });
  });

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


  var progInput = jQuery('#progression');
  progInput.blur(function() { 
    if (progInput.val().length == 0) { return false; }
    var prog = BSD.parseProgression(this.value);
    console.log('prog',prog);
    
    var myChords = prog.map(function(o){  return o.chord; });
    campfire.publish('do-it',myChords);
  });


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



</script>

<?php
});
  get_footer();