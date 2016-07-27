<?php 


add_filter('wp_title',function($o){ return 'Vex3'; });
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


  @media print  { 

    body { font-size: 7pt; }
    .inner { font-size: 7pt; }
    
    .stage { color: rgba(0,0,0,0.5); }
  
  }
  
 
  .controls { margin-left: 0.4rem; }
  .controls .fa-close { cursor: pointer; }

  .color-grey { color: #888; }
  .color-white  { color: white; }


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
        width=680 scale=1.0 editor="true"
        editor_width=680 editor_height=330>
tabstave notation=true tablature=false
notes Cn-D-E/4 F#/5        
    </div>

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
      

      BSD.Widgets.Fretboard = function(spec) {

        var self = BSD.PubSub({});
        self.spec = spec;
        
        self.selectedNotes = function() {
          ///console.log('selectedNotes data',spec.data);
        
          var numbers = spec.data.select(function(o) {
            return o.selected;
          }).map(function(o) { 
            return o.noteValue; 
          });    
          
          ////Object.keys(state).select(function(n){ return state[n]; });
          
          console.log('numbers',numbers);
          var result = numbers.map(function(n) { return Note(n); });
          return result;
        };
        
        self.renderOn = function(wrap) {      
          var inner = DOM.div().addClass('inner');
          var table = DOM.table().addClass('fretboard-table');
          table.attr('cellspacing',0);
          table.attr('cellpadding',0);
          
          
          
          table.empty();
          //console.log('cscale',cscale);
          [64,59,55,50,45,40].forEach(function(open,stringIdx) { 
            var row = DOM.tr();     
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].each(function(fret){ 

              /***
              BSD.foo.push({
                fret: fret,
                string: stringIdx+1,
                midiValue: open+fret
              });
              ***/

                  
              var fretData = spec.data.detect(function(o){
                return (o.string == stringIdx + 1) && o.fret == fret;
              });
              
              //console.log('fretData',fretData);
              
              var cell = DOM.td();
              
              cell.addClass('fret-' + fret);
              cell.addClass('string-' + (stringIdx+1));
              
              var midiValue = open+fret;
              var note = Note(midiValue);
             
              var noteName = note.name();
              

              

              //noteName = JSMT.toUTF8(noteName);
              
              if (true || noteNames.indexOf(noteName) > -1) {
                
                cell.html(noteName);
                
              }
              
              cell.click(function(){
                console.log('click!!');

                fretData.selected = ! fretData.selected; //toggle its state
              
                
                if (fretData.selected) {
                  var hex = BSD.chosenColor.toHex();
                  var sum = BSD.chosenColor.r + BSD.chosenColor.g + BSD.chosenColor.b;
                  
                  console.log('hex',hex,'sum',sum);
                  cell.css('background-color','#' + hex);
                  //cell.css('color','white');

                  cell.removeClass('color-white');
                  cell.removeClass('color-grey');

                  
                  (sum > 500) ? cell.addClass('color-grey') : cell.addClass('color-white');


                }
                else {
                  cell.css('background-color','inherit');
                  cell.css('color','inherit');
                }              
              
              });
              
              cell.hover(function(){
                self.publish('note-hover',note);
              });
          
              row.append(cell);
              //console.log(note.name());
            });
            table.append(row);
          });
          inner.append(table);
          var controls = DOM.div().addClass('controls noprint');
          
          var playAll = DOM.button('<i class="fa fa-play"></i>').addClass('btn btn-success control play-all');
          playAll.click(function(){
            self.publish('play-notes',self.selectedNotes());
          });
          controls.append(playAll);


          var stickyNoteButton = DOM.button('<i class="fa fa-sticky-note-o"></i>').addClass('btn btn-info');
          stickyNoteButton.click(function(e) {
            ///console.log(e,'sticky');
          
            var sticky = BSD.Widgets.StickyNote(e);
            sticky.renderOn(jQuery(document.body));
          });
          controls.append(stickyNoteButton);



          

          inner.append(controls);
          
          var close = DOM.div('<i class="fa fa-3x fa-close"></i> ').addClass('noprint');

          close.click(function(){
            inner.remove();
          });
          controls.append(close);
          
          wrap.append(inner);
        };
        
        return self;
      };

      BSD.boards = [];
      
      



  var context = new AudioContext();
  BSD.audioContext = context;



  BSD.parseProgressionIntoBars = function(progString) {
    var barStrings = progString.split('|');
    
    
    barStrings = barStrings.select(function(o){ return o.trim().length > 0; });
    console.log('barStrings',barStrings);
    
    var bars = barStrings.map(function(barString){
      var chordNames = barString.split(/,|\ +/);
      chordNames = chordNames.select(function(o){ return o.trim().length > 0; });
      
      console.log('chordNames',chordNames);
      
      var chords = chordNames.map(function(o){
        var origChord = makeChord(o);
        return origChord;/////.plus(-12);
      });
      return chords;
    });
    
    console.log('bars???',bars);
    
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
    
    console.log('chord??',chord);
    
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


  var stage = jQuery('#stage');

  var myVex = jQuery('.vex-prog');

  campfire.subscribe('do-bars',function(bars){
    console.log('bars',bars);
    var msg = '';
    var lines = BSD.chunkify(bars,4);
    lines.forEach(function(line){
      console.log('line',line);
      msg += "tabstave notation=true tablature=false\n";

      msg += 'notes :8 ';

      textMsg = 'text :h,';
      var chordNames = [];

      bars.forEach(function(bar){
        var chords = bar;
        /***
        var vfChords = chords.map(function(chord){  
          var keys = chord.notes().map(function(note){
            var key = note.name().toLowerCase() + '/' + BSD.midiOctave(note);        
            return key;
          });
          var result = new VF.StaveNote({ keys: keys, duration: "q" });
          return result;
        });
        ***/
        chords.forEach(function(chord){
        
        
          var distance = 0;    
          
          var saveNote = chord.rootNote;
          var saveLetter = saveNote.name().substr(0,1);
          var thirdIndex = nextThird.indexOf(saveLetter);
          var preferredLetter = saveLetter;

          var displayNotes = [];
          
          
          
          chord.notes().forEach(function(note,i){
            console.log('note',note.name(),'saveLetter',saveLetter);
            distance = note.value() - saveNote.value();
            if (distance == 3 || distance == 4) {
              var choices = [note.flatNameFromValue(note.value()),note.sharpNameFromValue(note.value())];
              preferredLetter = nextThird[nextThird.indexOf(saveLetter) + 1];
              
              var winner = choices.detect(function(o){
                return o.match(preferredLetter);
              });
              displayNotes.push({ name: winner, note: note });
              
              
              console.log('choices',choices,'saveLetter',saveLetter,'preferred',preferredLetter,'winner',winner);
            }
            else {
              displayNotes.push({ name: note.name(), note: note });
            }
          
            saveNote = note;
            saveLetter = preferredLetter;
          
          });
                
          console.log('displayNotes',displayNotes);
        
        
          var keys = displayNotes.map(function(o){
            var nn = o.name.replace(/b$/,'@');///Case();
            var key = nn +  '/' + BSD.midiOctave(o.note);
            return key;
          });
          
          msg += ' ' + keys.join('-');
          
          //textMsg += chord.fullAbbrev() + ',';
          chordNames.push(chord.fullAbbrev());
        });
    
        msg += ' | ';
        //textMsg += ' | ';
      
      });
      textMsg += chordNames.join(',');
      msg += "\n" + textMsg + "\n";
    });
    jQuery('.editor').val(msg);
    jQuery('.editor').trigger('change');
  });
  
  campfire.subscribe('was-do-bars',function(bars){
    console.log('bars',bars);
    ///randColor = BSD.randomDarkColor(); ////palettes.atRandom().atRandom();
    ///main.empty();





      var staveWrap = DOM.div().addClass('stave-wrap');
      var renderer = new VF.Renderer(staveWrap[0], VF.Renderer.Backends.SVG);
      
      // Configure the rendering context.
      renderer.resize(1500, 100);
      var context = renderer.getContext();
      context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

      var stave = new VF.Stave(0,0, 1500);
      // Add a clef and time signature.
      stave.addClef("treble").addTimeSignature("4/4");
      stave.setContext(context).draw();

      /////////////
      
      
      var c = new VF.StaveNote({ keys: ['c/4'], duration: "8" });
      var e = new VF.StaveNote({ keys: ['e/4'], duration: "8" });
      var g = new VF.StaveNote({ keys: ['g/4'], duration: "8" });
      var b = new VF.StaveNote({ keys: ['b/4'], duration: "8" });

      var beam = new Vex.Flow.Beam([c,e,g,b]);

      var textNote = new Vex.Flow.TextNote({
          text: 'Cmaj7',
          font: {
              family: "Arial",
              size: 12,
              weight: ""
          },
          duration: 'w'               
      })
      .setLine(2)
      .setStave(stave);


      Vex.Flow.Formatter.FormatAndDraw(context, stave, [c,e,g,b]);
      Vex.Flow.Formatter.FormatAndDraw(context, stave, [textNote]);

      beam.setContext(context).draw();

      var barNote = new VF.BarNote();     
      Vex.Flow.Formatter.FormatAndDraw(context, stave, [barNote]);

      var barNote = new VF.BarNote();     
      Vex.Flow.Formatter.FormatAndDraw(context, stave, [barNote]);

      var barNote = new VF.BarNote();     
      Vex.Flow.Formatter.FormatAndDraw(context, stave, [barNote]);



      stage.append(staveWrap);
      return false;
      return false;
      return false;
      return false;
      return false;
      return false;
      


    var lines = BSD.chunkify(bars,4);
    lines.forEach(function(line){
      console.log('line',line);
      

      var vfStaveNotes = [];
      var beams = [];
      var texts = [];



      bars.forEach(function(bar){
        var chords = bar;

        var vfChords = chords.map(function(chord){  
          var keys = chord.notes().map(function(note){
            var key = note.name().toLowerCase() + '/' + BSD.midiOctave(note);        
            return key;
          });
          var result = new VF.StaveNote({ keys: keys, duration: "q" });
          return result;
        });
    
    
        var vfThisBarNotes = [];
  
  
        chords.forEach(function(chord){
          var vfThisChordNotes = [];



          var text = new Vex.Flow.TextNote({
              text: chord.fullAbbrev(),
              font: {
                  family: "Arial",
                  size: 12,
                  weight: ""
              },
              duration: 'w'               
          })
          .setLine(2)
          .setStave(stave);
          
          //.setJustification(Vex.Flow.TextNote.Justification.LEFT);      
    
          ///vfStaveNotes.push(text);
          texts.push(text);


              
          chord.notes().forEach(function(note) {
            var nn = note.name().toLowerCase();
            var key = nn +  '/' + BSD.midiOctave(note);
            ///console.log('key',key,'nn',nn);
            var vfNote = new VF.StaveNote({ keys: [key], duration: "8" });
            var acc = nn.match(/#|b$/);  
            if (acc && nn.length > 1){
              vfNote.addAccidental(0, new Vex.Flow.Accidental(acc[0]));
            }
            
            
            vfStaveNotes.push(vfNote);
            vfThisBarNotes.push(vfNote);
            vfThisChordNotes.push(vfNote);
          });
    
          var beam = new Vex.Flow.Beam(vfThisChordNotes);
          beams.push(beam);
        }); //chords in a bar

        vfStaveNotes.push(new VF.BarNote());     
  
      }); //bars

      Vex.Flow.Formatter.FormatAndDraw(context, stave, vfStaveNotes);
      beams.forEach(function(beam){
        beam.setContext(context).draw();
      });


      var voice2 = new Vex.Flow.Voice({
          num_beats: chords.length,
          beat_value: 2,
          resolution: Vex.Flow.RESOLUTION
      });
      //voice2.setStrict(false);
      voice2.addTickables(texts);

      var formatter = new Vex.Flow.Formatter();
      formatter.format([voice2], 750);


      texts.forEach(function(text){
        text.setContext(context).draw();
      });


      
      stage.append(staveWrap);
    }); //lines
    
    
  });
    
      
    </script>
<?php
});

get_footer();