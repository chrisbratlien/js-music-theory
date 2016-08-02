<?php 


add_filter('wp_title',function($o){ return 'Vex4'; });
add_action('wp_head',function(){
?>

<style type="text/css">
  body { 
    font-size: 10px;
  }

  .inner { font-size: 10px; width: 45%; margin-left: 2%; float: left; }
  .inner table { float: left; }
  .inner .controls { float: left; }


  table { 
    border-bottom: 1px solid rgba(0,0,0,0.1); 
    border-right: 1px solid  rgba(0,0,0,0.1); 
  }
  table td { 
    padding: 0.2em; text-align: center; 
    width: 1.7em;
    height: 1.5em;    
    text.align: center;
    border-radius: 1rem;
    border-top: 1px solid  rgba(0,0,0,0.1); 
    border-left: 1px solid  rgba(0,0,0,0.1); 
  
  
    -webkit-user-select: none;   /* Chrome/Safari/Opera */
    -khtml-user-select: none;    /* Konqueror */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;      
  
  }
  .fretboard-table { margin-bottom: 1.75em; }    
  .stage { width: 100%; margin: 0; }
  
  .cell { cursor: pointer; }
  table td { cursor: pointer; }
  
  .hide-text td { color: transparent; }


  .vex-prog { margin-top: 2em; }


  @media print  { 

    body { font-size: 7pt; }
    .inner { font-size: 7pt; }
    
    .stage { color: rgba(0,0,0,0.5); }
  
  }
  
 
  .controls { margin-left: 0.4rem; }
  .controls .fa-close { cursor: pointer; }

  .color-grey { color: #888; }
  .color-white  { color: white; }



  ul.song-list { list-style-type: none; width: 140px; }
  ul.song-list li { padding: 3px; font-size: 1.2em; cursor: pointer; }
  ul.song-list li.selected{ background: #409; color: white; }

  /**
  .control.play-all { background: green; height: 50px; max-height: 50px; line-height: 50px; } 
  .control.play-all:active { background: #0f0; }
  **/ 
     
  
  

</style>

<?php
});

get_header(); ?>


<div class="navbar-spacer screen-only noprint">
  <br />
  <br />
  <br />
  <br />
  <br />
</div>
<div class="color-pickers-wrap noprint">

      <button id="more-palettes">Redraw Palettes</button>
      <div id="pickers">   </div><!-- pickers -->
      <div id="selected-colors">   </div>
      <div style="clear: both;">&nbsp;</div>        

</div><!-- color-pickers-wrap -->

    <div class="progression-form">
        <button id="redo">Redo</button>
        <label>Progression</label>
        <input type="text" id="progression" class="form-control" />
    </div>
    <div id="stage" class="stage"></div>


    <div class="vex-tabdiv vex-prog"
        width="" scale=1.0 editor="true"
        editor_width="680" editor_height=330>
tabstave notation=true tablature=false
notes Cn-D-E/4 F#/5        
    </div>
  <div id="song-list-wrap"></div>

<?php

add_action('wp_footer',function(){
?>
    <!--
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/array.js"></script>
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/dom.js"></script>
    <script src="http://cdn.dev.bratliensoftware.com/javascript/color.js"></script>
    
    <script src="http://lucid.bratliensoftware.com/js-music-theory/javascript/js-music-theory.js"></script>
    -->
    
    <script src="http://cdn.dev.bratliensoftware.com/javascript/draggy.js"></script>
    <script src="http://cdn.dev.bratliensoftware.com/javascript/sticky-note.js"></script>
    <script src="js/bsd.widgets.songlist.js"></script>
    <script src="lib/vextab/releases/vextab-div.js"></script>
    <script type="text/javascript">


      BSD.foo = [];

      BSD.chosenColor = BSD.colorFromHex('#888888');
      BSD.ColorPicker = function(spec) {
        var self = BSD.PubSub({});
        self.renderOn = function(wrap) {
      ///console.log('hello');
          var square = DOM.div('').addClass('color-picker');
          square.css('background-color','#' + spec.color.toHex());
          
          var handler = function() {
            BSD.chosenColor = spec.color;
          };
          
          square.click(function() {
            self.publish('click',spec.color);
            ////handler();
            ///var newGuy = square.clone();
            //newGuy.click(handler);
            //wrap.append(newGuy);    
          });
      ////console.log('html',html);
          wrap.append(square);
        };
        return self;
      };







      var pickers = jQuery('#pickers');
      var selectedColors = jQuery('#selected-colors');
      
      var morePalettes = jQuery('#more-palettes');
      
      var palettes = [];
      
      var savedColors = {};
      
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
            picker.subscribe('click',function(color){
              BSD.chosenColor = color;    
              var hex = color.toHex();
              if (!savedColors[hex]) {
                savedColors[hex] = true;
                picker.renderOn(selectedColors);
              }
            });
          });
        });
      });
      
      morePalettes.click(function(){
        campfire.publish('redraw-palettes');
      });
      campfire.publish('redraw-palettes');

      var cscale = makeScale('Cmajor');
      var noteNames = cscale.noteNames();
      

    var context = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
  BSD.audioContext = context;



  BSD.parseProgressionIntoBars = function(progString) {
    var barStrings = progString.split('|');
    
    
    barStrings = barStrings.select(function(o){ return o.trim().length > 0; });
    ///console.log('barStrings',barStrings);
    
    var bars = barStrings.map(function(barString){
      var chordNames = barString.split(/,|\ +/);
      chordNames = chordNames.select(function(o){ return o.trim().length > 0; });
      
      ///console.log('chordNames',chordNames);
      
      var chords = chordNames.map(function(o){
        var origChord = makeChord(o);
        return origChord;/////.plus(-12);
      });
      return chords;
    });
    
    ////console.log('bars???',bars);
    
    return bars;
  };


  BSD.parseProgression = function(progString) {
    var barStrings = progString.split(/\ +|\|/);
    
    barStrings = barStrings.select(function(o){ return o.length > 0; });
    
    
    
    var barIndex = 0;
    var chordIndex = 0;
    var them = [];
    
    barStrings.each(function(barString){
      var chordNames = barString.split(/,|\ +/);
      var halfBar = false;
      if (chordNames.length == 2) {
        halfBar = true;
      }
      
      
      
      chordNames.each(function(o){
        var origChord = makeChord(o);        
        //var lowerChord = origChord.plus(-12);  
        
        them.push({
          barIndex: barIndex,
          chordIndex: chordIndex,
          chord: origChord, //lowerChord,
          halfBar: halfBar
        });
        chordIndex += 1;        
      });
      barIndex += 1;
    });

    return them;

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
        waiter.beg(BSD.audioPlayer,'set-master-volume',newVolume);
        storage.setItem('volume',newVolume);  
        ////waiter.beg(BSD.chunker,'set-master-volume',ui.value);
        jQuery( "#volume-amount" ).text( newVolume );
      }
    });


  campfire.subscribe('play-note',function(payload) {
    BSD.audioPlayer.playNote(payload.note,payload.duration);    
  });    
  campfire.subscribe('play-notes',function(notes) {

    console.log('notes??',notes);
    var chord = makeChordFromNotes(notes);
    
    ///console.log('chord??',chord);
    
    campfire.publish('play-chord',{ chord: chord, duration: 1000 });
  });    
  campfire.subscribe('play-chord',function(o) {
    BSD.audioPlayer.playChord(o.chord,o.duration);    
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
    
    //console.log(c);///'BSD.currentFretDiv',BSD.currentFretDiv);


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
      
    
  BSD.importJSON('data/guitar.json',function(o) { 
    BSD.guitarData = o;

  },
  function(e){
    console.log('e',e);
  
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
  progInput.change(function() { 
    if (progInput.val().length == 0) { return false; }
    var bars = BSD.parseProgressionIntoBars(this.value);
    console.log('bars',bars);
    
    campfire.publish('do-bars',bars);
    //var myChords = prog.map(function(o){  return o.chord; });
    ///campfire.publish('do-it',myChords);
    
    
  });




  /////var div = document.getElementById("boo");
  
  
  // Create a stave of width 400 at position 10, 40 on the canvas.

BSD.chunkify = function(ary,chunkSize) {
  var chunks = [];
  var aryCopy = ary.select(function(o){ return true; }); 
  while (aryCopy.length > chunkSize) {
    chunks.push(aryCopy.splice(0,chunkSize));
  }
  chunks.push(aryCopy);
  return chunks;
};

  


var nextThird = ['C','E','G','B','D','F','A','C'];


BSD.midiOctave = function(o) {
  if (typeof o == "object") {
    o = o.value();
  }

  var result = Math.floor(o/12)-1;
  return result;
};


 VEXTAB_USE_SVG = true;

  var stage = jQuery('#stage');

  var myVex = jQuery('.vex-prog');
  
  myVex.attr('width',jQuery(window).width() * 0.9);
  
  

  var saveChord = false;
  var firstChord = false;
  
  campfire.subscribe('do-bars',function(bars){
    console.log('bars',bars);

    saveChord = false;
    firstChord = false;

    bars.each(function(chords){
      chords.each(function(chord){
        if (!firstChord) { 
          firstChord = chord; 
        }
        if (saveChord) {
          saveChord.next = chord;
          chord.prev = saveChord;
        }
        saveChord = chord;
      });
    });
    saveChord.next = firstChord;
    
    
    var msg = '';

        var chordDurationMap = {
          1: ':w',
          2: ':h',
          4: ':q'
        };
        var notesDurationMap = {
          1: ':q',
          2: ':8',
          4: ':16'
        };
    
    var lines = BSD.chunkify(bars,4);
    lines.forEach(function(barsOfLine){
      console.log('barsOfLine',barsOfLine);
      msg += "tabstave notation=true tablature=false\n";

      var textMsg = '';
      var noteMsg = "";
 
      barsOfLine.forEach(function(bar){
        var chords = bar;
        noteMsg += 'notes ';


        chords.forEach(function(chord){
        
          ////noteMsg += 'notes ';
        
          var distance = 0;    
          var saveNote = chord.rootNote;
          var saveLetter = saveNote.name().substr(0,1);
          var thirdIndex = nextThird.indexOf(saveLetter);
          var preferredLetter = saveLetter;
          var displayNotes = [];
          
          chord.notes().forEach(function(note,i){
            ////console.log('note',note.name(),'saveLetter',saveLetter);
            distance = note.value() - saveNote.value();
            if (distance == 3 || distance == 4) {
              var choices = [note.flatNameFromValue(note.value()),note.sharpNameFromValue(note.value())];
              preferredLetter = nextThird[nextThird.indexOf(saveLetter) + 1];
              
              var winner = choices.detect(function(o){
                return o.match(preferredLetter);
              });
              
              if (!winner) { winner = choices[0]; }
              
              displayNotes.push({ name: winner, note: note });
              ///console.log('choices',choices,'saveLetter',saveLetter,'preferred',preferredLetter,'winner',winner);
            }
            else {
              displayNotes.push({ name: note.name(), note: note });
            }
            saveNote = note;
            saveLetter = preferredLetter;
          });
                
          ///console.log('displayNotes',displayNotes);
          var nextChord = chord.next;
          
          

          var m3 = chord.myThird();
          var m7 = chord.mySeventh();
          var onTheOne = m3 || m7;
          var next3 = chord.next.myThird();
          var next7 = chord.next.mySeventh();
          
          var target = next3 || next7;
          
          var placeFirstAndLast = function(nextNote) {
            var aFunc = function(o) {
              if (o.note.equalTo(onTheOne)) {
                return -145;
              }
              if (chord.next) {
                var distance = -1 * Math.abs(o.note.abstractValue() - target.abstractValue());
                if (distance == 0) { 
                  return -144; 
                } 
                return distance;
              }
              return o.note.abstractValue();
            };
            return aFunc;
          };
          //console.log('before',displayNotes);
          var sortedNotes = displayNotes.sort(BSD.sorter(placeFirstAndLast(target)));
          //console.log('sorted',sortedNotes);

        
          var notesToBePlayed = [];
          
          var noteCount = 0; //4 eighth notes for this single chord
          if (chords.length == 1) {
            noteCount = 8; //8 eighth notes for this single chord
          }
          else if (chords.length == 2) {
            noteCount = 4;
          }
          else if (chords.length == 4) {
            noteCount = 2;
          }



          /////
          var first = sortedNotes[0];
          var last = sortedNotes[sortedNotes.length-1];

          notesToBePlayed.push(first);
          var prevPad = first;
          while (notesToBePlayed.length < noteCount - 1) {
            var pad = false;
            pad = sortedNotes.atRandom();
            while (prevPad && pad.note.abstractlyEqualTo(prevPad.note)) {
              pad = sortedNotes.atRandom();
            }
            while (notesToBePlayed.length == noteCount - 2 
              && (pad.note.abstractlyEqualTo(last.note) || pad.note.abstractlyEqualTo(prevPad.note))) {
              pad = sortedNotes.atRandom();
            }
            
            notesToBePlayed.push(pad);
            prevPad = pad;
          }
          
          notesToBePlayed.push(last);

          //// more stuff in here!!
          //from scales..
          
          ///from chord...
          
          ///up to 8 if less and there's 1 chord in bar. (chords.length == 1).
          
          
          //shore up octaves between chords
          
          
        
        
        
          var keys = notesToBePlayed.map(function(o){
            var nn = o.name.replace(/b$/,'@');///Case();
            var key = nn +  '/' + BSD.midiOctave(o.note);
            return key;
          });
          
          //msg += ' ' + keys.join('-');

          noteMsg += ' ' + ':8' + ' ' + keys.join('-');
          ///noteMsg += ' ' + notesDurationMap[chords.length] + ' ' + keys.join('-');
        });
        noteMsg += "| \n";
        //console.log('noteMsg',noteMsg);
        
        var chordNames = chords.map(function(chord){
          return chord.fullAbbrev();
        }).join(',');
        var duration = chordDurationMap[chords.length];
        textMsg += "\ntext " + duration + ',' + chordNames + "\n"; 
      });
      ///textMsg += chordNames.join(',');
      msg += "\n" + noteMsg + "\n";
      msg += "\n" + textMsg + "\n";
    });
    jQuery('.editor').val(msg);
    jQuery('.editor').trigger('change');
  });
  
  
   var songlistWrap = jQuery('#song-list-wrap');
  
  BSD.songlist.renderOn(songlistWrap);
  BSD.songlist.refresh();
  
  BSD.songlist.subscribe('song-selected',function(song){
    progInput.val(song.progression);
    progInput.trigger('change');
  
  });
    
      
    </script>
<?php
});

get_footer();