<?php 


add_filter('wp_title',function($o){ return 'Prog Fretboards'; });
add_action('wp_head',function(){
?>

<title>12 Fretboards</title>

<style type="text/css">
  body { 
    font-size: 10px;
  }

  .stage { 
    margin: 0; 
    width: 65%; 
  }
  
  .inner { 
    font-size: 10px; 
    margin-left: 2%; 
    width: 50%; 
  }

  .inner table { float: left; }
  .inner .controls { float: left; }
  .inner .spacer { clear: both; }


  table { 
    border-bottom: 1px solid rgba(0,0,0,0.1); 
    border-right: 1px solid  rgba(0,0,0,0.1); 
    width: 75%;
  }
  table td { 
    padding: 0.2em; text-align: center; 
    min-width: 23px;
    width: 23px;
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

        <label>String sets</label>
        <label>654321</label>
        <input type="checkbox" class="stringset-654321" checked="true" />
        <label>6432</label>
        <input type="checkbox" class="stringset-6432" checked="true" />
        <label>4321</label>
        <input type="checkbox" class="stringset-4321" checked="true" />
        <label>5432</label>
        <input type="checkbox" class="stringset-5432" checked="true" />
        <label>5321</label>
        <input type="checkbox" class="stringset-5321" checked="true" />
        <label>6543</label>
        <input type="checkbox" class="stringset-6543" checked="true" />
      </div>

<div class="navbar-spacer screen-only noprint">
  <button class="btn btn-info btn-add-fretboard noprint"><i class="fa fa-plus"></i> Add Fretboard</button>
  <button class="btn btn-info btn-toggle-text noprint">Toggle Text</button>

  <br />
  <br />
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
    
    <script type="text/javascript">


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
            if (typeof o.noteValue !== "undefined") { return o.noteValue; }
            return o.midiValue;
          });    
          
          ////Object.keys(state).select(function(n){ return state[n]; });
          
          //console.log('numbers',numbers);
          var result = numbers.map(function(n) { return Note(n); });
          return result;
        };


        self.styleCell = function(cell,fretData) {
          cell.addClass('color-white');

                if (fretData.selected) {
                  var hex = BSD.chosenColor.toHex();
                  var sum = BSD.chosenColor.r + BSD.chosenColor.g + BSD.chosenColor.b;
                  
                  if (fretData.color) {
                    var hex = fretData.color.toHex();
                    var sum = fretData.color.r + fretData.color.g + fretData.color.b;
                  }


                  ////console.log('hex',hex,'sum',sum);

                  cell.css('background-color','#' + hex);
                  //cell.css('color','white');
                  //cell.removeClass('color-white');
                  cell.removeClass('color-grey');

                  
                  (sum > 500) ? cell.addClass('color-black') : cell.addClass('color-white');


                }
                else {
                  cell.css('background-color','inherit');
                  //cell.removeClass('color-white');
                }              



        };

        
        self.renderOn = function(wrap) {      
          var inner = DOM.div().addClass('inner');
          var table = DOM.table().addClass('fretboard-table');
          table.attr('cellspacing',0);
          table.attr('cellpadding',0);
          
          var intervalMap = '1,b9,9,b3,3,4,b5,5,#5,6,b7,7'.split(/,/);
          
          
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
                
                var showInterval = false;

                cell.text(noteName);

                self.subscribe('show-interval',function(wish){
                  if (wish) {
                    cell.text(intervalMap[fretData.interval]);
                  }
                  else {
                    cell.text(noteName);
                  }
                });


                cell.html(noteName);
                
              }
              
              cell.click(function(){
                //console.log('click!!');

                fretData.selected = ! fretData.selected; //toggle its state
        

                self.styleCell(cell,fretData);      

              
              });

              self.styleCell(cell,fretData);      
              
              cell.hover(function(){
                self.publish('note-hover',note);
              });
          
              row.append(cell);
              //console.log(note.name());
            });
            table.append(row);
          });


          inner.append(DOM.h3(spec.chord.fullAbbrev()));

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
          inner.append(DOM.div('&nbsp;').addClass('spacer'));
          
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
      
      


        var colorHash = {};




      ///var stage = jQuery('.stage');
      
      function makeFretboardOn(wrap,opts) {



        var chord = opts.chord;
        var activeStrings = opts.activeStrings || [1,2,3,4,5,6];

        var defaultData = JSON.parse(JSON.stringify(BSD.guitarData));
        ///console.log('defaultData',defaultData);

        abstractNoteValues = chord.abstractNoteValues();




        var newData = defaultData.map(function(o){
          var hit = abstractNoteValues.detect(function(av) { 
              if (o.chromaticValue !== av) { return false };

              if (!activeStrings.detect(function(s) { return o.string == s; })) {
                return false;
              }

              var interval = o.chromaticValue - chord.rootNote.abstractValue();
              while (interval < 0) { interval += 12; }
              while (interval > 11) { interval -= 12; }
              //console.log('interval',interval);
              o.interval = interval;

              return true;
          });
          if (typeof hit == "number") { o.selected = true; }




          if (colorHash[o.interval]) {
            o.color = colorHash[o.interval];
            o.colorHex = '#' + o.color.toHex();
          }
          /**
          if (o.interval == 1 && o.chord.fullAbbrev().match(/b9/)) {
            o.color = BSD.colorFromHex('#E6DF52');
            o.colorHex = '#' + o.color.toHex();
          }
          **/

          return o;
        });



        ///var cdata = defaultData.
        ////console.log('newData',newData);





        var board = BSD.Widgets.Fretboard({
          data: newData,//defaultData,
          activeStrings: activeStrings,
          chord: chord
        });
        board.renderOn(wrap);
        
        board.subscribe('play-notes',function(notes){
          campfire.publish('play-notes',notes);
        });
        board.subscribe('note-hover',function(o){
          campfire.publish('note-hover',o);
        });
        
        BSD.boards.push(board);
      
      }
      
      



    jQuery('.btn-add-fretboard').click(function(){
      ///makeFretboardOn(stage,null); 
    });
      



  var context = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
  BSD.audioContext = context;

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

    //console.log('notes??',notes);
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

  
  var btnToggleText = jQuery('.btn-toggle-text');
  var hideText = false;
  btnToggleText.click(function(){
    hideText = ! hideText;
    hideText ? jQuery('html').addClass('hide-text') : jQuery('html').removeClass('hide-text');
  });
  
    

var progInput = jQuery('#progression');
progInput.blur(function() { 
  campfire.publish('gather-inputs-and-do-it');
});


var activeStringsInput = jQuery('.active-strings');
activeStringsInput.blur(function(){
  campfire.publish('gather-inputs-and-do-it');
});

campfire.subscribe('gather-inputs-and-do-it',function(){
    if (progInput.val().length == 0) { return false; }
    var prog = BSD.parseProgression(progInput.val());
    console.log('prog',prog);
    var myChords = prog.map(function(o){  return o.chord; });
    campfire.publish('do-it',myChords);
});




campfire.subscribe('do-it',function(chords){
  var pa = '#FF0000-#E6DF52-#FFDD17-#4699D4-#4699D4-#000000-#000000-#000000-#bbbbbb-#67AFAD-#8C64AB-#8C64AB'.split(/-/);


  var palette = pa.map(function(o) {
    return BSD.colorFromHex(o);
  });
  ///palette = BSD.randomPalette2(12,200);
  palette.forEach(function(color,i) {
    ///var color = palette.shift();
    colorHash[i] = color;
  });

  ['654321','6432','4321','5432','5321','6543'].forEach(function(stringSet){
    var cb = jQuery('.stringset-' + stringSet);
    if (!cb.attr('checked')) { return false; }
    var activeStrings = stringSet.split('');
    var stage = DOM.div().addClass('stage');

    jQuery(document.body).append(stage);
    chords.each(function(chord){




      makeFretboardOn(stage,{
        chord: chord,
        activeStrings: activeStrings
      });
      //console.log('chords?',chords,'activeStrings',activeStrings);
    });
  });

  var direction = 'up';
  var nextDirection = { 'up': 'down', 'down': 'up'};
  var lastAbstractValue = 0;
  var lastValue = 60;
  var lastString = 5;
  var lastFret = 3;
  var bunches = chords.map(function(o){ return o.abstractNoteValues(); });
  var sequence = [];

  var chordIdx = 0;

  var lastNote = Note(60);
  var myNote = false;

  ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,".split(/,/).forEach(function(o,i) {
    var chordIdx = Math.floor(i / 4);
    chordIdx = chordIdx % 4;
    var myChord = chords[chordIdx];

    //myNote = myChord.notes().atRandom();
    //while (lastNote && myNote.abstractValue() == lastNote.abstractValue()) {
    //  myNote = myChord.notes().atRandom();
    ///}
    var abstractNoteValues = myChord.abstractNoteValues();

    direction = (Math.random() > 0.75) ? direction : nextDirection[direction];
    var candidates = BSD.guitarData;
    candidates = candidates.select(function(o) {  
      var diff = o.noteValue - lastValue;
      ///console.log('diff',diff);
      if (diff > 0 && direction == 'down') { return false; }
      if (diff < 0 && direction == 'up') { return false; }
      if (diff == 0) { return false; }
      if (Math.abs(diff) > 6) { return false; }


      if (o.fret > 15) { return false; }

      if (abstractNoteValues.indexOf(o.chromaticValue) < 0) { return false; }
      var stringDiff = Math.abs(o.string - lastString);
      if (stringDiff > 2) { return false; }
      var fretDiff = Math.abs(o.fret - lastFret);
      if (fretDiff > 3) { return false; }


      return true;
    });
    var result = candidates.atRandom();

    sequence.push(result);
    lastValue = result.noteValue;
    lastNote = Note(lastValue);
    lastString = result.string;
    lastFret = result.fret;
  });
  console.log('sequence',sequence);
  console.log('bunches',bunches);

});
  


      
    </script>
<?php
});

get_footer();