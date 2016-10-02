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
    width: 100%; 
  }
  
  .inner { 
    font-size: 10px; 
    margin-left: 2%; 
    width: 50%; 
  }

  .inner table { float: left; }
  .inner .controls { float: left; }
  .inner .spacer { clear: both; }

  .bsd-control { margin-top: 1rem; }
  .hidden { display: none; }

  table { 
    border-bottom: 1px solid rgba(0,0,0,0.1); 
    border-right: 1px solid  rgba(0,0,0,0.1); 
    
  }
  table td { 
    padding: 0.2em; text-align: center; 
    min-width: 23px;
    width: 23px;
    height: 1.5em;    
    text-align: center;
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
    
    .stage { 
      color : #777;
      color: rgba(0,0,0,0.5); 
    }
  
  }
  
 
  .controls { margin-left: 0.4rem; }
  .controls .fa-close { cursor: pointer; }

  .color-grey { color: #888; }
  .color-white  { color: white; }




  .extra .was-once-featured {
    background: #ccc;
    color: white;
  }

  .extra .featured { 
    background: yellow;
    color: black;
  }



  .featured { 
    background: yellow !important; 
    color: black !important; 
  }

  /**
  .control.play-all { background: green; height: 50px; max-height: 50px; line-height: 50px; } 
  .control.play-all:active { background: #0f0; }
  **/ 
     
  .venue-footer { 
    height: 400px; 
  }
  

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

      <label>Note Resolution</label>
      <select class="note-resolution">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="8">8</option>
        <option value="16">16</option>
      </select>
      <div class="progression-form">
        <button id="redo">Redo</button>
        <label>Progression</label>
        <input type="text" id="progression" class="form-control" />

        <label>String sets</label>

        <input type="checkbox" class="stringset-654321" checked="true" />
        <label>654321</label>

        <input type="checkbox" class="stringset-6432" />
        <label>6432</label>

        <input type="checkbox" class="stringset-4321" />
        <label>4321</label>

        <input type="checkbox" class="stringset-5432" />
        <label>5432</label>

        <input type="checkbox" class="stringset-5321" />
        <label>5321</label>

        <input type="checkbox" class="stringset-6543" />
        <label>6543</label>
      </div>

<div class="navbar-spacer screen-only noprint">
</div>

<div class="controls">
  <button class="btn btn-info btn-pause"><i class="fa fa-pause"></i> Pause</button>
  <button class="btn btn-info btn-toggle-text noprint">Toggle Text</button>
  <br />


  <div class="slider-wrap bsd-control">
      <label>Tempo</label>
      <span id="tempo-amount">0</span> bpm
      <div class="slider" id="tempo-input"></div>
      <div style="clear: both;">&nbsp;</div>
  </div>

  <div class="slider-wrap bsd-control">
      <label>How many cycles through the progression to hear before repeating</label>
      <span class="prog-cycles-amount">0</span> x
      <div class="slider prog-cycles-input"></div>
      <div style="clear: both;">&nbsp;</div>
  </div>


  <div class="bsd-control">
    <input class="scroll-to-board" type="checkbox">
    <label>Scroll to Current Chord's Fretboard</label>
  </div>
  <div class="bsd-control">
    <input class="play-chords-only" type="checkbox">
    <label>Hear Chords Only</label>
  </div>
  <div class="bsd-control">
    <input class="show-current-chord-fretboard-only" type="checkbox">
    <label>See Current Chord's Fretboard Only</label>
  </div>



  <br />
</div>
<div class="venue">
</div>
<div class="venue-footer">
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
    
    <script src="js/draggy.js"></script>
    <script src="js/sticky-note.js"></script>
    
    <script type="text/javascript">


BSD.timeout = false;

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
                  ///cell.css('background-color','inherit');
                  cell.css('background-color',null);
                  cell.attr('style',null);
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
              self.subscribe('feature-fret',function(o){
                var hit = (o.string == stringIdx + 1) && o.fret == fret;
                if (hit) { 
                  ///console.log('yay'); 
                }
                (hit) ?  cell.addClass('featured was-once-featured') : cell.removeClass('featured');
              });
              
              cell.hover(function(){
                self.publish('note-hover',note);
              });
          
              row.append(cell);
              //console.log(note.name());
            });
            table.append(row);
          });


          
          inner.append(DOM.h3(spec.chord && spec.chord.fullAbbrev() || 'no chord').addClass('chord-name'));
          

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
            self.close();
          });
          controls.append(close);
          
          wrap.append(inner);


          self.close = function() {
            inner.remove();
          }

          self.subscribe('unfeature-frets',function(){
            wrap.find('.featured').removeClass('featured');
          });
          self.subscribe('get-wrap',function(callback){
            callback(wrap);
          });

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
        


        abstractNoteValues = chord && chord.abstractNoteValues() || [];
        var newData = defaultData.map(function(o){
          var hit = abstractNoteValues.detect(function(av) { 
              if (o.chromaticValue !== av) { return false };
              if (!chord) { return false; } //chord not mandatory
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
          return o;
        });


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
        
        return board;      
      }



  var context = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
  BSD.audioContext = context;


      function impulseResponse( duration, decay, reverse ) {
          var sampleRate = context.sampleRate;
          var length = sampleRate * duration;
          var impulse = context.createBuffer(2, length, sampleRate);
          var impulseL = impulse.getChannelData(0);
          var impulseR = impulse.getChannelData(1);

          if (!decay)
              decay = 2.0;
          for (var i = 0; i < length; i++){
            var n = reverse ? length - i : i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
          }
          return impulse;
      }




    BSD.Widgets.SimplePlayer = function(spec) {



      var self = BSD.PubSub({});

      self.playNote = function(note,duration) {

        var v = note.value();
        while (v > spec.range[1]) {
          v -= 12;
        }
        while (v < spec.range[0]) {
          v += 12;
        }

        ///console.log('v?',v);

        var freq = midi2Hertz(v);
        var osc = context.createOscillator();/////BufferSource();
        osc.frequency.value = freq;
        osc.type = 'sine';
        osc.start(0);      
        osc.connect(spec.destination);
        setTimeout(function() {
          osc.disconnect();
        },duration);
      };
      self.playChord = function(chord,duration) {
        chord.notes().forEach(function(note){
          self.playNote(note,duration);
        });
      };

      self.spec = spec;
      return self;
    };


    var common = context.createGain();
    common.gain = 1.0;

    var wet = context.createGain();
    var dry = context.createGain();


    var convolver = context.createConvolver();
    convolver.buffer = impulseResponse(1.5,1.5,false);

    wet.gain.value = 0.5;
    wet.connect(convolver);
    convolver.connect(context.destination);

    dry.gain.value = 0.5;
    dry.connect(context.destination);

    common.connect(wet);
    common.connect(dry);


    BSD.audioPlayer = 
    BSD.Widgets.GuitarPlayer({
    //BSD.Widgets.SimplePlayer({
      context: context,
      destination: common,
      polyphonyCount: 48,//polyphonyCount,
      range: [40,128]
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
      step: 0.001,
      value: BSD.volume,
      slide: function( event, ui ) {
        var newVolume = ui.value;
        waiter.beg(BSD.audioPlayer,'set-master-volume',newVolume);
        storage.setItem('volume',newVolume);  
        ////waiter.beg(BSD.chunker,'set-master-volume',ui.value);
        jQuery( "#volume-amount" ).text( newVolume );
      }
    });


    campfire.subscribe('render-tempo-control',function(){
      jQuery( "#tempo-amount" ).text( BSD.tempo );
      jQuery( "#tempo-input" ).slider({
        orientation: "horizontal",
        range: "min",
        min: 30,
        max: 250,
        step: 1,
        value: BSD.tempo,
        slide: function( event, ui ) {
          var n = ui.value;
          BSD.tempo = n;
          storage.setItem('tempo',BSD.tempo);
          jQuery( "#tempo-amount" ).text( n );
        }
      });
    });

    campfire.subscribe('render-prog-cycles-control',function(){
      jQuery('.prog-cycles-amount').text( BSD.progCycles );
      jQuery('.prog-cycles-input').slider({
        orientation: 'horizontal',
        range: 'min',
        min: 1,
        max: 8,
        step: 1,
        value: BSD.progCycles,
        slide: function( event, ui ) {
          var n = ui.value;
          BSD.progCycles = parseInt(n,10);
          storage.setItem('prog-cycles',BSD.progCycles);
          jQuery( '.prog-cycles-amount' ).text( n );
        }
      });
    });

    BSD.noteResolution = 4;
    var ddNoteResolution = jQuery('.note-resolution');
    ddNoteResolution.change(function(){
      BSD.noteResolution = parseInt(this.value,10);
    });
    ddNoteResolution.find('option[value="' + BSD.noteResolution + '"]').attr('selected',true);


    BSD.tempo = 100;
    storage.getItem('tempo',function(o){
      BSD.tempo = parseInt(o,0);
      campfire.publish('render-tempo-control');
    },
    function(o){
      campfire.publish('render-tempo-control');      
    });

    BSD.scrollToBoard = false;
    storage.getItem('scrollToBoard',function(o){
      BSD.scrollToBoard = JSON.parse(o);
    });
    var cbScrollToBoard = jQuery('.scroll-to-board');
    cbScrollToBoard.attr('checked',BSD.scrollToBoard);
    cbScrollToBoard.change(function(){
      BSD.scrollToBoard = this.checked;
      storage.setItem('scrollToBoard',BSD.scrollToBoard);
    });

    BSD.progCycles = 1;
    storage.getItem('prog-cycles',function(o){
      BSD.progCycles = parseInt(o,10);
      campfire.publish('render-prog-cycles-control');
    },function(){
      campfire.publish('render-prog-cycles-control');      
    });


    BSD.playChordsOnly = false;
    storage.getItem('playChordsOnly',function(o){
      BSD.playChordsOnly = JSON.parse(o);
    });
    var cbPlayChordsOnly = jQuery('.play-chords-only');
    cbPlayChordsOnly.attr('checked',BSD.playChordsOnly);
    cbPlayChordsOnly.change(function(){
      BSD.playChordsOnly = this.checked;
      storage.setItem('playChordsOnly',BSD.playChordsOnly);
    });


    BSD.options = {};
    storage.getItem('options',function(o){
      BSD.options = JSON.parse(o);
    });

    var cbShowCurrentChordFretboadOnly = jQuery('.show-current-chord-fretboard-only');
    cbShowCurrentChordFretboadOnly.attr('checked',BSD.options.showCurrentChordFretboadOnly);
    cbShowCurrentChordFretboadOnly.change(function(){
      BSD.options.showCurrentChordFretboadOnly = this.checked;
      storage.setItem('options',JSON.stringify(BSD.options));
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



  
  var btnPause = jQuery('.btn-pause');
  btnPause.click(function(){


    campfire.publish('first-click');
    BSD.pause = ! BSD.pause;
    if (BSD.pause) { 
      campfire.publish('stop-it');
    }
    else {
      if (BSD.sequence && BSD.sequence.length > 0) {
        tick(BSD.sequence[0]);
      }
    }
  });
    

var progInput = jQuery('#progression');
progInput.blur(function() { 
  campfire.publish('gather-inputs-and-do-it');
});
progInput.on('touchend',function(){ //for iOS bug
	///alert('hey');
	BSD.handleFirstClick();
});




var activeStringsInput = jQuery('.active-strings');
activeStringsInput.blur(function(){
  campfire.publish('gather-inputs-and-do-it');
});

campfire.subscribe('stop-it',function(){
  clearTimeout(BSD.timeout);
});

campfire.subscribe('gather-inputs-and-do-it',function(){
    if (progInput.val().length == 0) { 
        campfire.publish('stop-it'); 
        return false; 
    }
    var prog = BSD.parseProgression(progInput.val());
    console.log('prog',prog);
    var myChords = prog.map(function(o){  return o.chord; });
    campfire.publish('do-it',myChords);
});


var extraBoard;
var headerHeight = jQuery('header').height();

function tick(cursor) {
    console.log('tick',
      cursor.idx,
      cursor.chord.fullAbbrev(),
      Note(cursor.noteValue).name(),
      'ideal/actual/avg',
      cursor.idealFret,
      cursor.fret,
      cursor.avgFret
      //cursor      
    );
      BSD.boards.forEach(function(board){
        board.publish('unfeature-frets');
      });
      cursor.board.publish('feature-fret',cursor);

      if (cursor.chordNoteIdx == 0) {


        BSD.boards.forEach(function(board){
          board.publish('get-wrap',function(wrap){
            BSD.options.showCurrentChordFretboadOnly ? wrap.addClass('hidden') : wrap.removeClass('hidden');
          });
        });



        cursor.board.publish('get-wrap',function(wrap){ //just in case they were hidden...
            wrap.removeClass('hidden');  
        });
      }




      if (BSD.scrollToBoard && cursor.chordNoteIdx == 0) {
        cursor.board.publish('get-wrap',function(wrap){
          jQuery('html, body').animate({ 
            scrollTop: wrap.find('.chord-name').offset().top - headerHeight 
          },200);
        });
      }


      extraBoard.publish('feature-fret',cursor);


      if (!BSD.playChordsOnly) {
        campfire.publish('play-note', { note: Note(cursor.noteValue), duration: 1000 });
      }



      var even4DelayMS = BSD.tempoToMillis(BSD.tempo);
      var even1DelayMS = even4DelayMS * 4; //whole notes
      var even2DelayMS = even4DelayMS * 2; //half notes
      var even8DelayMS = even4DelayMS /2; //eighth notes
      var even16DelayMS = even4DelayMS /4; //eighth notes

      var swung81 = even4DelayMS * 2/3;
      var swung82 = even4DelayMS * 1/3;


      ///var midSwung81 = (swung81;////////+even8DelayMS) / 2;/////].sum() /2;
      var midSwung81 = swung81;
      //var midSwung81 = (swung81+even8DelayMS) / 2;/////].sum() /2;
      var midSwung82 = swung82;
      //var midSwung82 = (swung82+even8DelayMS) / 2;/////].sum() /2;

      var thisIdx = cursor.chordIdx;
      var node = cursor;
      while (node.chordIdx == thisIdx) {
        node = node.next;
      }
      var nextChord = node.chord;

      if (BSD.noteResolution == 1 && cursor.chordNoteIdx == 0) { 
        setTimeout(function(){
          campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
        },even1DelayMS - swung82);
      }


      if (BSD.noteResolution == 2 && cursor.chordNoteIdx == 1) { 
        setTimeout(function(){
          campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
        },even4DelayMS + swung81);
      }



      if (BSD.noteResolution == 4 && cursor.chordNoteIdx == 3) { 
        //queue up next chord just before its note will sound. 2/3 to give a swung "and of 4" feel.
        setTimeout(function(){
          campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
        },swung81);
      }

      if (BSD.noteResolution == 8 && cursor.chordNoteIdx == 6) { 
        //queue up next chord just before its note will sound. 2/3 to give a swung "and of 4" feel.
        setTimeout(function(){
          campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
        },swung81);
      }

      if (BSD.noteResolution == 16 && cursor.chordNoteIdx == 12) { 
        //queue up next chord just before its note will sound. 2/3 to give a swung "and of 4" feel.
        setTimeout(function(){
          campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
        },swung81);
      }

      clearTimeout(BSD.timeout);
      
      var nextDelayMS = false; 
      if (BSD.noteResolution == 1) {
        nextDelayMS = even1DelayMS; 
      }
      else if (BSD.noteResolution == 2) {
        nextDelayMS = even2DelayMS; 
      }
      else if (BSD.noteResolution == 4) {
        nextDelayMS = even4DelayMS; 
      }
      else if (BSD.noteResolution == 8) {
        if (cursor.idx % 2 == 0) {
          nextDelayMS = midSwung81;
        }
        else {
          nextDelayMS = midSwung82;
        }
      }
      else { //16
          nextDelayMS = even16DelayMS;
      }
      cursor = cursor.next;

      /**
      else if (BSD.noteResolution == 8) {
        if (cursor.idx % 2 == 0) { 
          nextDelayMS == swungEighth1; 
        }
        else {
          nextDelayMS == swungEighth2; 
        }
      }
      **/


      BSD.timeout = setTimeout(function() {
        tick(cursor); 
      },nextDelayMS);
  }



BSD.noteResolution = 4;

campfire.subscribe('do-it',function(chords){

  if (extraBoard) {
    extraBoard.close();
    extraBoard = null;
  }
  BSD.boards.forEach(function(board){
    board.close();
  });
  BSD.boards = [];

  clearTimeout(BSD.timeout);  
  var pa = '#FF0000-#E6DF52-#FFDD17-#4699D4-#4699D4-#000000-#000000-#000000-#bbbbbb-#67AFAD-#8C64AB-#8C64AB'.split(/-/);


  var palette = pa.map(function(o) {
    return BSD.colorFromHex(o);
  });
  ///palette = BSD.randomPalette2(12,200);
  palette.forEach(function(color,i) {
    ///var color = palette.shift();
    colorHash[i] = color;
  });


  var venue = jQuery('.venue');

    var stage = DOM.div().addClass('stage extra');
    venue.append(stage);
    extraBoard = makeFretboardOn(stage,{
        //chord: chord,
        activeStrings: '654321'.split('')
    });
    ////BSD.boards.push(extraBoard);

  ['654321','6432','4321','5432','5321','6543'].forEach(function(stringSet){
    var cb = jQuery('.stringset-' + stringSet);
    if (!cb.attr('checked')) { return false; }
    var activeStrings = stringSet.split('');


    chords.forEach(function(chord){

      var stage = DOM.div().addClass('stage hidden');
      venue.append(stage);


      var board = makeFretboardOn(stage,{
        chord: chord,
        activeStrings: activeStrings
      });
      BSD.boards.push(board);
    });


  });

  BSD.tickResolution =  BSD.noteResolution;

  var direction = (Math.random() > 0.5) ? 'up' : 'down';
  var nextDirection = { 'up': 'down', 'down': 'up'};
  var lastAbstractValue = false;
  var lastValue = false; //60
  var lastString = false;/////2; //5
  var lastStrings = [];///[5];
  var lastFret = false;////BSD.idealFret || 7;//3;
  var lastFrets = [];////////[3];
  var lastFretDiff = 0;
  var lastFretDiffs = [];

  var bunches = chords.map(function(o){ return o.abstractNoteValues(); });
  var sequence = [];


  var chordIdx = 0;

  var lastNote = Note(60);
  var myNote = false;


  var sequenceLength = chords.length * BSD.noteResolution * BSD.progCycles;///[1,2,4,8].atRandom();
  ///var sequenceLength = chords.length * BSD.noteResolution * [8].atRandom(); //debug

  var range = [];

  for (var i = 0; i < sequenceLength; i += 1) {
    range.push(i);
  }

  var errors = 0;

  range.forEach(function(o,i) {
    if (errors) { return false; }

    var barIdx = Math.floor(i / BSD.noteResolution);
    var chordIdx = barIdx % chords.length;
    var myChord = chords[chordIdx];

   var cycleIdx = Math.floor(barIdx / chords.length);
   ///cycleIdx = Math.floor(cycleIdx / chords.length);
   ////console.log('barIdx',barIdx,'chordIdx',chordIdx,'cycleIdx',cycleIdx);


    if (!myChord) {
      errors += 1;
      return false;
    }

    var chordNoteIdx = i % BSD.noteResolution; //FIXME: assuming everything is 4 note chords.



    //myNote = myChord.notes().atRandom();
    //while (lastNote && myNote.abstractValue() == lastNote.abstractValue()) {
    //  myNote = myChord.notes().atRandom();
    ///}
    var abstractNoteValues = myChord.abstractNoteValues();


    if (Math.random() > 0.85) {
      ///console.log('random flip!');
      direction = nextDirection[direction];
    }
    if (lastValue <= 44) {//low E
      direction = 'up';
    }

    var candidates = BSD.guitarData;


    var scale = 10;//12; //rightmost fret to idealize.
    var tot = 256; //range.length;
    var progress = i; //step
    var loopsPerTotal = 1;


    var idealFret = 9; //starter...will get overriden
    if (BSD.idealFret) {
      idealFret = BSD.idealFret;
    }
    else {
      //TODO: really undestand scaling trig unit radius circle and scaling better.
      /**
      idealFret = Math.round(scale * (Math.cos ((2 * Math.PI) / tot * progress * loopsPerTotal ) + 1) / 2);
      **/
      idealFret = 7 + cycleIdx;
      var idealFretMax = 9;
      var maxDiff = idealFret - idealFretMax;
      if (maxDiff > 0) {
        idealFret = idealFretMax - maxDiff;
      }
    }


    ///console.log('i/idealFret',i,idealFret);

    var avgFret;
    if (lastFrets.length >0) {
      avgFret = Math.round(lastFrets.sum() / lastFrets.length);
    }

    var avgString;
    if (lastStrings.length >0) {
      avgString = Math.round(lastStrings.sum() / lastStrings.length);
    }

    var drift3;
    if (lastFretDiffs.length >0) {
      drift3 = lastFretDiffs.slice(-3).sum(); //sum the latest 3
    }

    var judge = function(o) {  


      if (abstractNoteValues.indexOf(o.chromaticValue) < 0) { return 'outside'; }
      if (o.fret > 13) { return 'too high'; }

      var diff = lastValue ? o.noteValue - lastValue : 0;
      ///console.log('diff',diff);

      if (diff > 0 && direction == 'down') { return 'wrong dir'; }
      if (diff < 0 && direction == 'up') { return 'wrong dir'; }
      if (lastValue && diff == 0) { return 'no diff'; }
      if (Math.abs(diff) > 6) { return '>6'; }


      var idealFretDiff = Math.abs(o.fret - idealFret);
      /////console.log('o.fret',o.fret,'idealFret',idealFret,'idealFretDiff',idealFretDiff);
      //if (idealFretDiff > 6) { return 'idealFretDiff>6'; }
      if (idealFretDiff > 4) { return 'idealFretDiff>4'; }      




      var fretDiff = lastFret ? o.fret - lastFret : 0; 

       if (drift3 && Math.abs(drift3 + fretDiff) > 3) { return 'drifting too much in one direction'; }
       if (lastFretDiff && Math.abs(lastFretDiff + fretDiff) > 3) { return 'drifting too much in one direction'; }



      var fretDistance = Math.abs(fretDiff);
      if (fretDistance > 3) { return 'fretDistance > 3'; }
      if (lastFretDiff && Math.abs(lastFretDiff + fretDiff) > 4) { return 'lastFretDiff+fretDiff >4'; } ///if they don't cancel each other out and their total is too big

      var stringDiff = lastString? Math.abs(o.string - lastString) : 0;
      if (stringDiff > 2) { return 'stringDiff>2'; }

      //now for the avg
      var avgFretDistance = avgFret ? Math.abs(o.fret - avgFret) : 0;
      var avgStringDiff = avgString ? Math.abs(o.string - avgString): 0;
      if (avgFretDistance > 4) { return 'avgFretDistance>4'; }
      ///if (avgStringDiff > 2) { return 'avgStringDiff>2'; }


      /**
      console.log(
        'o.string',o.string,'o.fret',o.fret,
        'avgString',avgString,'avgFret',avgFret,
        'stringDiff',stringDiff,'fretDiff',fretDiff,
        'avgStringDiff',avgStringDiff,'avgFretDiff',avgFretDiff
      );
      ***/
      return 'OK';
    };


    var criteria = function(o){
      var decision = judge(o);
      //console.log('decision',decision);
      return  decision == 'OK';
    };

    candidates = candidates.select(criteria);

    if (candidates.length == 0) {
      console.log('uh oh');
      direction = nextDirection[direction];
      ///console.log('flip! (necessity)');
      candidates = BSD.guitarData.select(criteria);
    }

    if (candidates.length == 0) {
      console.log('uh oh #2');
      candidates = BSD.guitarData.select(criteria);
    }
    if (candidates.length == 0) {
        console.log('look again');
      candidates = BSD.guitarData.select(criteria);
    }

    if (candidates.length == 0) {
      errors += 1;
      return false;      
    }



    var result;
    if (chordNoteIdx == 0) { //first note in new chord change... try to get nearest pitch to last note played.

      var distScore = function(o){  
          var min = lastAbstractValue ? Math.min(o.chromaticValue,lastAbstractValue): o.chromaticValue;
          var max = lastAbstractValue ? Math.max(o.chromaticValue,lastAbstractValue): o.chromaticValue;
          var diff = max - min;
          var dist = Math.min(diff,12-diff);
          return dist;
      };
      var sorted = candidates.sort(BSD.sorter(distScore));
      ///console.log('sorted Scores',sorted.map(function(o){ return [o,distScore(o)]; }));
      result = sorted[0];
      //console.log('*FN* i',i,'chose',Note(result.noteValue).name(),'result.chromaticValue',result.chromaticValue,'lastAbstractValue',lastAbstractValue);
    }
    else {
      result = candidates.atRandom();
      console.log('i',i,'chose',Note(result.noteValue).name(),'result.chromaticValue',result.chromaticValue,'lastAbstractValue',lastAbstractValue);
    }


    result = JSON.parse(JSON.stringify(result));
    result.direction = direction;
    result.chordIdx = chordIdx;
    result.board = BSD.boards[chordIdx];
    result.chord = myChord;
    result.chordNoteIdx = chordNoteIdx;
    result.idealFret = idealFret;
    result.avgFret = avgFret;
    ///result.idx = i;
    
    console.log('result',result);


    if (!result) {
      errors += 1;
    }

    sequence.push(result);
    ///sequence[i] = result;
    lastValue = result.noteValue;
    lastNote = Note(lastValue);
    lastAbstractValue = lastNote.abstractValue();
    lastString = result.string;
    lastFretDiff = lastFret ? result.fret - lastFret : 0;
    lastFretDiffs.push(lastFretDiff);


    lastFret = result.fret;


    if (lastFrets.length > 4) { lastFrets.shift(); } //having a average of 5 was too limiting in candidates.
    lastFrets.push(lastFret);

    if (lastStrings.length > 3) { lastStrings.shift(); } //having a average of 5 was too limiting in candidates.
    lastStrings.push(lastString);

  });
  ///console.log('sequence',sequence);


  if (errors) {
    alert('Oops, I had an error. Try a few more times (5x max) before you give up on me.');
    return false;
  }

  sequence.forEach(function(o,idx) {
    o.idx = idx;
    var ndx = idx+1;
    ndx = ndx % sequence.length;
    o.next = sequence[ndx];
  });
  //console.log('sequence',sequence);
  BSD.sequence = sequence;
  //////sequence.forEach(function(o){})
  BSD.timeout = false;
  
  tick(sequence[0]);
  ///console.log('bunches',bunches);
});


campfire.subscribe('play-chord',function(o){
  jQuery('.extra .chord-name').html(o.chord.fullAbbrev());
});


BSD.firstClick = true;
BSD.handleFirstClick = function () {
  if (!BSD.firstClick) { return false;}
  BSD.firstClick = false;
	var buffer = context.createBuffer(1, 1, 22050);
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	if(source.play){    source.play(0);} else if(source.noteOn){    source.noteOn(0);}
};



function periodicA(current,total,shift,scale,func) {
  return (func(Math.PI*2 * current/total) + shift) * scale;
}
function periodicB(current,total,shift,scale,func) {
  return (func(Math.PI*2 * current/total) * scale) + shift;
}


campfire.subscribe('test-periodic',function(o){
  for (var i = 0; i < o.total; i += 1) {
    var resA = periodicA(i,o.total,o.shift,o.scale,Math.cos);
    console.log('A (cos) i',i,'result',resA);
  }
  for (var i = 0; i < o.total; i += 1) {
    var resA = periodicA(i,o.total,o.shift,o.scale,Math.sin);
    console.log('A (sin) i',i,'result',resA);
  }

  for (var i = 0; i < o.total; i += 1) {
    var resB = periodicB(i,o.total,o.shift,o.scale,Math.cos);
    console.log('B (cos) i',i,'result',resB);
  }

  for (var i = 0; i < o.total; i += 1) {
    var resB = periodicB(i,o.total,o.shift,o.scale,Math.sin);
    console.log('B (sin) i',i,'result',resB);
  }

});
      
    </script>
<?php
});

get_footer();
