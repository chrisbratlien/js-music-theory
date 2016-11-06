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
    float: left;
    margin: 0; 
    width: 70%; 
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
  .hidden { display: none; } /* consider refactoring this name */
  .invisible { visibility: hidden; }

  table { 
    border-bottom: 1px solid rgba(0,0,0,0.1); 
    border-right: 1px solid  rgba(0,0,0,0.1); 
    
  }
  table td { 
    border-radius: 1rem;
    border-top: 1px solid  rgba(0,0,0,0.1); 
    border-left: 1px solid  rgba(0,0,0,0.1); 

    height: 1.5em;    
    min-width: 23px;
    padding: 0.2em; text-align: center; 
  
  
    -webkit-user-select: none;   /* Chrome/Safari/Opera */
    -khtml-user-select: none;    /* Konqueror */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    text-align: center;
    user-select: none;      
    width: 23px;
  
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
    color: black !important; 
    background: yellow !important; 
  }

  /**
  .control.play-all { background: green; height: 50px; max-height: 50px; line-height: 50px; } 
  .control.play-all:active { background: #0f0; }
  **/ 
     
  .venue-footer { 
    height: 400px; 
  }
  

  .song-list { 
    list-style-type: none; 
    width: 50%; 
  }
  .song-list li { 
    cursor: pointer; 
    font-size: 1.2rem; 
    padding: 3px; 
  }
  .song-list .selected{ 
    background: #409; 
    color: white; 
  }


  .song-form-position-wrap { 
    float: right;
    width: 30%; 
  }
  .song-form-position {
    width: 100%;
  }
  .song-form-position .bar { 
    background: #d5cbe2;
    color: white;
    cursor: pointer;
    float: left;
    font-size: 1.2rem;
    height: 45px;
    line-height: 45px;
    text-align: center;
    width: 25%; 
  }

  .bar-16, .bar-17, .bar-18, .bar-19 {
    margin-top: 10px;
  }

  .bar-32, .bar-33, .bar-34, .bar-35 {
    margin-top: 10px;
  }

  .bar-48, .bar-49, .bar-50, .bar-51 {
    margin-top: 10px;
  }

  .song-form-position .active {
    background: yellow;
    color: black;
  }

  .form-progression .form-group {
    width: 100%;
  }
  .form-progression .progression {
    width: 90%;
  }
  .form-progression .btn-start {
    width: 8%;
  }




.tiny td {
  min-width: 15px;
  /* font-size: 1rem; */
  height: 15px;
  width: 15px;
  height: 10px;
  min-height: 10px;
  font-size: 10px;
  line-height: 10px;
}

.tiny .spacer {
  display: none;
}

.tiny .chord-name {
  font-size: 10px;
  margin: 0;
}

.tiny .inner .controls {
  display: none;
}

.tiny .fretboard-table {
  margin-bottom: 2px;
}


/* drop 2 string sets */
.stringset-4321 .string-4 { border-bottom: 1px solid rgba(0,0,0,0.1); }
.stringset-4321 .string-5 { display: none; }
.stringset-4321 .string-6 { display: none; }


.stringset-5432 .string-5 { border-bottom: 1px solid rgba(0,0,0,0.1); }
.stringset-5432 .string-1 { display: none; }
.stringset-5432 .string-6 { display: none; }


.stringset-6543 .string-2 { display: none; }
.stringset-6543 .string-1 { display: none; }


/* Drop 3 string sets */
.stringset-6432 .string-1 { display: none; }
.stringset-5321 .string-6 { display: none; }



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

      <label>Beats per Measure</label>
      <select class="beats-per-measure">
        <option value="3">3</option>
        <option value="4">4</option>
      </select>

      <label>Note Resolution</label>
      <select class="note-resolution">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="8">8</option>
        <option value="16">16</option>
      </select>


        <div class="form-inline form-progression">
          <label>Progression</label>
          <div class="form-group">
            <input type="text" id="progression" class="form-control progression" />
            <button class="btn btn-info btn-start">Start</button>          
          </div>
        </div>
        
        <label>String sets</label>

        <div class="all">
          <label>All</label>
          <input type="checkbox" class="cb-stringset-654321" checked="true" />
          <label>654321</label>
        </div>
        <div class="drop2">
          <label>Drop 2</label>
          <input type="checkbox" class="cb-stringset-4321" />
          <label>4321</label>

          <input type="checkbox" class="cb-stringset-5432" />
          <label>5432</label>
          <input type="checkbox" class="cb-stringset-6543" />
          <label>6543</label>
        </div>
        <div class="drop3">
          <label>Drop 3</label>
          <input type="checkbox" class="cb-stringset-6432" />
          <label>6432</label>
          <input type="checkbox" class="cb-stringset-5321" />
          <label>5321</label>
        </div>
        <div class="other">
          <label>Other</label>
          <input type="checkbox" class="cb-stringset-321" />
          <label>321</label>
          <input type="checkbox" class="cb-stringset-432" />
          <label>432</label>
          <input type="checkbox" class="cb-stringset-543" />
          <label>543</label>
          <input type="checkbox" class="cb-stringset-654" />
          <label>654</label>
        </div>

<div class="navbar-spacer screen-only noprint">
</div>

<div class="controls">
  <button class="btn btn-info btn-pause"><i class="fa fa-pause"></i> Pause</button>
  <button class="btn btn-info btn-toggle-text noprint">Toggle Text</button>
  <button class="btn btn-info btn-save-prog"><i class="fa fa-save"></i> Save Prog</button>
  <button class="btn btn-info btn-toggle-tiny">Tiny</button>
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
    <label>
      <input class="scroll-to-board" type="checkbox">      
      Scroll to Current Chord's Fretboard
    </label>
  </div>
  <div class="bsd-control">
    <label>
      <input class="play-chords-only" type="checkbox">
      Hear Chords Only
    </label>
  </div>
  <div class="bsd-control">
    <label>
      <input class="show-current-chord-fretboard-only" type="checkbox">
      See Current Chord's Fretboard Only
    </label>
  </div>

  <div class="slider-wrap bsd-control">
      <label>Min-Max Frets</label>
      <span class="fret-range-amount">0-15</span>
      <div class="slider fret-range-input"></div>
      <div style="clear: both;">&nbsp;</div>
  </div>


  <br />
</div>
<div class="venue">
  <div class="song-form-position-wrap">
    <div class="song-cycle-indicator">1</div>
    <div class="btn btn-loop-start">A</div>
    <div class="btn btn-loop-end">B</div>
    <ul class="song-form-position">
    </ul>
  </div>
</div><!-- venue -->
<div class="venue-footer">
</div>
<h3>Songs</h3>
<ul class="song-list-wrap">
</ul>

<?php

add_action('wp_footer',function(){
?>
    
    <script src="js/draggy.js"></script>
    <script src="js/sticky-note.js"></script>
    <script src="js/bsd.widgets.songlist.js"></script>
    
    <script type="text/javascript">


BSD.timeout = false;

BSD.options = {};
storage.getItem('options',function(o){
  BSD.options = JSON.parse(o);
  campfire.publish('options-loaded',BSD.options);  //needed?
});

///BSD.remoteStorage.getItem('foo',function(){ alert('foo'); });



BSD.progressions = [];

/**
storage.getItem('progressions',function(o){
  ////BSD.progressions = JSON.parse(o);
  var them = JSON.parse(o);
  them.forEach(function(o){
    BSD.progressions.push(o);
  });
  campfire.publish('progressions-loaded',BSD.progressions); //needed?
});
***/


campfire.subscribe('progressions-loaded',function(){
  BSD.songlist.clear();
  BSD.progressions.forEach(function(progression){
    ///console.log('whoah',progression);
    BSD.songlist.addSong({
      title: progression.title,
      progression: progression.prog || progression.progression
    });
  });
});


BSD.remoteStorage.getItem('progressions',function(o){
  var them = JSON.parse(o);
  them.forEach(function(o){
    BSD.progressions.push(o);
  });
  campfire.publish('progressions-loaded',BSD.progressions); //needed?
});




campfire.subscribe('save-progressions',function(){
  BSD.progressions = BSD.progressions.sort(BSD.sorter(function(o){ return o.title; }));
  BSD.progressions = BSD.progressions.map(function(o){
    if (!o.progression && o.prog) {
      o.progression = o.prog;
      delete o.prog;
    }
    return o;
  });


  var unique = {};

  function slugger(o) {
    return btoa(JSON.stringify(o.progression + o.title));
  }
  var uniqueSpecs = [];
  BSD.progressions.forEach(function(o){
    var hit = unique[slugger(o)];
    if (!hit) {
      unique[slugger(o)] = o;
      uniqueSpecs.push(o);
    }
  });



  if (BSD.progressions.length == 0) {
    alert('something messed up');
    return false;
  }
  if (uniqueSpecs.length == 0) {
    alert('something messed up');
    return false;
  }

  var data = JSON.stringify(uniqueSpecs);

  ////////console.log('data!!!!!',data);
  /////return false;

  var backupDate = (new Date).toISOString().replace(/T.*$/,'');
  

  storage.setItem('progressions',data);
  storage.setItem('progressions-' + backupDate,data);

  BSD.remoteStorage.setItem('progressions',data);
  BSD.remoteStorage.setItem('progressions-' + backupDate,data);

});

var btnSaveProg = jQuery('.btn-save-prog');
btnSaveProg.click(function(){
  var title = prompt('Title');
  if (title) {
    var spec = {
      title: title,
      progression: progInput.val()
    };
    BSD.progressions.push(spec);
    campfire.publish('save-progressions');
  }
});



  function checkTiny() {
    BSD.options.tiny ? venue.addClass('tiny') : venue.removeClass('tiny');
    BSD.options.tiny ? btnToggleTiny.html('Big') : btnToggleTiny.html('Tiny');    
  }

var venue = jQuery('.venue');
var btnToggleTiny = jQuery('.btn-toggle-tiny');
btnToggleTiny.click(function(){
  BSD.options.tiny = !BSD.options.tiny;
  storage.setItem('options',JSON.stringify(BSD.options));
  checkTiny();
});
checkTiny();

/**

"[{"title":"Blue Bossa","prog":"C-7 C-7 F-7 F-7 D-7b5 G7 C-7 C-7 Eb-7 Ab7 DbM7 DbM7 D-7b5 G7 C-7 G7"},{"prog":"C-7|C-7|F-7|F-7|D-7b5| G7 |C-7 |C-7 |Eb-7 |Ab7 |DbM7 |DbM7 |D-7b5 |G7 |C-7| D-7b5 G7","title":"Blue Bossa (again)"},{"prog":"F7|Bb7|F7|F7|Bb7|Bb7|F7|F7|G-7|C7|F7|C7","title":"F blues #1"}]"

**/




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

        var cells = [];

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

              self.subscribe('visible-fret-range',function(fretRange) {
                var visible = (fretData.fret >= fretRange[0] && fretData.fret <= fretRange[1]);
                visible ? cell.removeClass('invisible') : cell.addClass('invisible');
              });
              
              cell.hover(function(){
                self.publish('note-hover',note);
              });
          
              row.append(cell);
              cells.push(cell);
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


    BSD.audioPlayer = BSD.Widgets.GuitarPlayer({
    //BSD.Widgets.SimplePlayer({
      context: context,
      destination: common,
      polyphonyCount: 48,//polyphonyCount,
      range: [40,128]
    });


    var bassist = BSD.Widgets.GuitarPlayer({
    //BSD.Widgets.SimplePlayer({
      context: context,
      destination: common,
      polyphonyCount: 48,//polyphonyCount,
      range: [28,100]
    });



   
    var waiter = BSD.Widgets.Procrastinator({ timeout: 250 });


  var songlistWrap = jQuery('.song-list-wrap');
  BSD.songlist.renderOn(songlistWrap);
  BSD.songlist.subscribe('song-selected',function(song) {
    BSD.currentSong = song;
    console.log('Z>>EEEEE>>>song',song);
    /////campfire.publish('lets-do-this',song.progression);
    progInput.val(song.progression);
    BSD.options.progression = song.progression;
    storage.setItem('options',JSON.stringify(BSD.options));
    var prog = BSD.parseProgression(song.progression);
    campfire.publish('do-it',prog);
  });




    BSD.volume = 0;
    storage.getItem('volume',function(o){
        BSD.volume = parseFloat(o);
        ///waiter.beg(BSD.audioPlayer,'set-master-volume',BSD.volume);
        ////waiter.beg(bassist,'set-master-volume',BSD.volume);
        waiter.beg(campfire,'set-master-volume',BSD.volume);

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
        BSD.volume = newVolume;
        waiter.beg(campfire,'set-master-volume',BSD.volume);
        storage.setItem('volume',newVolume);  
        ////waiter.beg(BSD.chunker,'set-master-volume',ui.value);
        jQuery( "#volume-amount" ).text( newVolume );
      }
    });


    campfire.subscribe('render-tempo-control',function(){
      jQuery( "#tempo-amount" ).text( BSD.options.tempo );
      jQuery( "#tempo-input" ).slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 250,
        step: 1,
        value: BSD.options.tempo,
        slide: function( event, ui ) {
          var n = ui.value;
          BSD.options.tempo = n;
          storage.setItem('options',JSON.stringify(BSD.options));
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
        max: 64,
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


    campfire.subscribe('render-fret-range-control',function(){
      jQuery('.fret-range-amount').text( 
        BSD.options.fretRange.toString().replace(/,/,'-')
      );
      jQuery('.fret-range-input').slider({
        orientation: 'horizontal',
        range: 'min',
        min: 0,
        max: 15,
        step: 1,
        values: BSD.options.fretRange,
        slide: function( event, ui ) {
          var n = ui.values;
          BSD.options.fretRange = n;
          storage.setItem('options',JSON.stringify(BSD.options));
          console.log('n',n);
          jQuery( '.fret-range-amount' ).text( 
            n.toString().replace(/,/,'-')
          );
          campfire.publish('fret-range-updated',BSD.options.fretRange);
        }
      });
    });


    BSD.beatsPerMeasure = 4;
    var ddBeatsPerMeasure = jQuery('.beats-per-measure');
    ddBeatsPerMeasure.change(function(){
      BSD.beatsPerMeasure = parseInt(this.value,10);
    });
    ddBeatsPerMeasure.find('option[value="' + BSD.beatsPerMeasure + '"]').attr('selected',true);

    BSD.noteResolution = 4;
    var ddNoteResolution = jQuery('.note-resolution');
    ddNoteResolution.change(function(){
      BSD.noteResolution = parseInt(this.value,10);
    });
    ddNoteResolution.find('option[value="' + BSD.noteResolution + '"]').attr('selected',true);



    BSD.progCycles = 1;
    storage.getItem('prog-cycles',function(o){
      BSD.progCycles = parseInt(o,10);
      campfire.publish('render-prog-cycles-control');
    },function(){
      campfire.publish('render-prog-cycles-control');      
    });


    if (!BSD.options.tempo) { BSD.options.tempo = 100; }
    campfire.publish('render-tempo-control');


    var cbPlayChordsOnly = jQuery('.play-chords-only');
    cbPlayChordsOnly.attr('checked',BSD.options.playChordsOnly);
    cbPlayChordsOnly.change(function(){
      BSD.options.playChordsOnly = this.checked;
      storage.setItem('options',JSON.stringify(BSD.options));
    });



    if (!BSD.options.fretRange) {
      BSD.options.fretRange = [0,15];
    }
    campfire.publish('render-fret-range-control');




    var cbShowCurrentChordFretboadOnly = jQuery('.show-current-chord-fretboard-only');
    cbShowCurrentChordFretboadOnly.attr('checked',BSD.options.showCurrentChordFretboadOnly);
    cbShowCurrentChordFretboadOnly.change(function(){
      BSD.options.showCurrentChordFretboadOnly = this.checked;
      storage.setItem('options',JSON.stringify(BSD.options));
    });


    var cbScrollToBoard = jQuery('.scroll-to-board');
    cbScrollToBoard.attr('checked',BSD.options.scrollToBoard);
    cbScrollToBoard.change(function(){
      BSD.options.scrollToBoard = this.checked;
      storage.setItem('options',JSON.stringify(BSD.options));
    });



    campfire.subscribe('fret-range-updated',function(o) {
      BSD.boards.forEach(function(board){
        board.publish('visible-fret-range',o);
      });
    });


    campfire.subscribe('set-master-volume',function(o){
      BSD.audioPlayer.publish('set-master-volume',BSD.volume);
      bassist.publish('set-master-volume',BSD.volume);
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
    var rootlessIntervals = o.chord.spec.intervals.select(function(n){ return n >0; });
    var rootless = Chord({ rootNote: o.chord.rootNote, intervals: rootlessIntervals });
    BSD.audioPlayer.playChord(rootless,o.duration);    
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
progInput.on('touchend',function(){ //for iOS bug
	///alert('hey');
	BSD.handleFirstClick();
});

//campfire.subscribe('options-loaded',function(){
  if (BSD.options.progression) {
    progInput.val(BSD.options.progression);
  }
//});


var btnStart = jQuery('.btn-start');
btnStart.click(function(){
  campfire.publish('gather-inputs-and-do-it');
});
btnStart.on('touchend',function(){
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
  if (progInput.val().length === 0) { 
      campfire.publish('stop-it'); 
      return false; 
  }

  BSD.options.progression = progInput.val(); //just the text
  storage.setItem('options',JSON.stringify(BSD.options));


  var prog = BSD.parseProgression(progInput.val());
  ///////campfire.publish('do-it-prog',prog);
  campfire.publish('do-it',prog);    
});


var extraBoard;
var headerHeight = jQuery('header').height();
var delayMS = {

};



function distScore(a,b) {
  var min, max, diff, dist;

  if (typeof a != "number" || typeof b != "number") { return 15; }
  /***
  if (a !== 0 && !a) { min = b; max = b; diff = 0; }
  if (b !== 0 && !b) { min = a; max = a; diff = 0; }
  if (a !== 0 && b !== 0 && !a && !b) { return 0; }
  ***/
  min = Math.min(a,b);
  max = Math.max(a,b);
  diff = max - min;
  dist = Math.min(diff,12-diff);
  dist = Math.abs(dist);
  return dist;
}


function outsideJudge(o,env) {
  var hit6 = env.majorSixthAV == o.chromaticValue; 
  var hit9 = env.ninthAV == o.chromaticValue; 
  var hit6or9 = hit6 || hit9;

  if (BSD.options.fretRange && o.fret > BSD.options.fretRange[1]) {
    return 'fret > maxFret';
  }
  if (BSD.options.fretRange && o.fret < BSD.options.fretRange[0]) {
    return 'fret < minFret';
  }


  /** THIS IS OK, NEVERMIND
  if (hit6 && meta.hasMinor7Quality) {
    ///console.log('NOPE!!!!',env);
    return 'minor7 with 6th clashes (7b with 6)';
  }
  ***/
  if (hit6 && meta.isStrongBeat) {
    return '6th on strong beat';    
  }



  if (hit6or9 && meta.hasPerfectFifth) {
    //if (hit6) { alert('hit6'); }
    //if (hit6) { console.log('hit6',meta); }
    //console.log('hit6or9 meta',env);
    return 'OK';
  }

  if (abstractNoteValues.indexOf(o.chromaticValue) < 0) { return 'outside'; }
  if (o.fret > 13) { return 'too high'; }
  if (BSD.activeStrings && !BSD.activeStrings.detect(function(as) { 
    ///console.log('as',as,'o.string',o.string);
    return as == o.string; 
  })) {
    return "not active string: " + o.string;
  }


  return 'OK';
}




function tick(cursor) { 
  if (!cursor) { return false; }
  delayMS.even4 = BSD.tempoToMillis(BSD.options.tempo);
  delayMS.even1 = delayMS.even4 * BSD.beatsPerMeasure; //whole notes
  delayMS.even2 = delayMS.even4 * 2; //half notes
  delayMS.even8 = delayMS.even4 /2; //eighth notes
  delayMS.even16 = delayMS.even4 /4; //eighth notes
  delayMS.swung81 = delayMS.even4 * 2/3;
  delayMS.swung82 = delayMS.even4 * 1/3;
  ///var midSwung81 = (swung81;////////+even8DelayMS) / 2;/////].sum() /2;
  delayMS.midSwung81 = delayMS.swung81;
  //var midSwung81 = (swung81+even8DelayMS) / 2;/////].sum() /2;
  delayMS.midSwung82 = delayMS.swung82;
  campfire.publish('tick',cursor); //that a tick happened, 

  clearTimeout(BSD.timeout);
  delayMS.next = delayMS['even' + BSD.noteResolution];
  if (!delayMS.next) {
    console.log('invalid delayMS.next for resolution' + BSD.noteResolution);
  }
  cursor = cursor.next;
  BSD.timeout = setTimeout(function() {
    tick(cursor); 
  },delayMS.next);
}

  BSD.noteResolution = 4;

  var direction = (Math.random() > 0.5) ? 'up' : 'down';
  var nextDirection = { 'up': 'down', 'down': 'up'};
  
  var avgFret,
  avgString,
  drift3,
  drift2,
  candidates,
  abstractNoteValues,
  result,
  idealFret,
  lastResult,
  lastAbstractValue,
  lastValue,
  lastString,
  lastStrings,
  lastFret,
  lastFrets,
  lastFretDiff,
  lastFretDiffs,
  lastNote,
  meta;


  ////var bunches = chords.map(function(o){ return o.abstractNoteValues(); });
  var rejections = [];
  var outsideRejections = [];

  var chordIdx = 0;

  var myNote = false;

  var songFormPosition = jQuery('.song-form-position');
  var songCycleIndicator = jQuery('.song-cycle-indicator');



function initLast() {

  meta = {};
  avgFret = false;
  avgString = false;
  drift2 = false;
  drift3 = false;

  idealFret = 9; //starter...will get overriden
  abstractNoteValues = [];
  candidates = [];
  lastAbstractValue = false;
  lastValue = false; //60
  lastString = false;/////2; //5
  lastStrings = [];///[5];
  lastFret = false;////BSD.idealFret || 7;//3;
  lastFrets = [];////////[3];
  lastFretDiff = 0;
  lastFretDiffs = [];
  lastNote = Note(60);
  result = false;
  lastResult = false;
  BSD.sequence = [];
}






    var judge = function(o,env) {  

      var diff = lastValue ? o.noteValue - lastValue : 0;
      //if (Math.abs(diff) > 6) { return 'diff>6:' + diff; }
      //if (Math.abs(diff) > 5) { return 'diff>5:' + diff; }
      if (Math.abs(diff) > env.maxDiff) { return 'diff > ' + env.maxDiff + ': ' + diff; }

      var idealFretDiff = Math.abs(o.fret - idealFret);
      if (idealFretDiff > 9) { return 'idealFretDiff>9'; }      
      ///if (idealFretDiff > 8) { return 'idealFretDiff>8'; }      
      //if (idealFretDiff > 7) { return 'idealFretDiff>7'; }      
      //if (idealFretDiff > 6) { return 'idealFretDiff>6'; }      
      //if (idealFretDiff > 5) { return 'idealFretDiff>5'; }      
      ///if (idealFretDiff > 4) { return 'idealFretDiff>4'; }      

      if (env.chordNoteIdx > 0 && diff > 0 && direction == 'down') { return 'wrong dir, direction=' + direction + ', diff=' + diff; }
      if (env.chordNoteIdx > 0 && diff < 0 && direction == 'up') { return 'wrong dir, direction=' + direction + ', diff=' + diff; }
      if (lastValue && diff == 0) { return 'no diff'; }


      var fretDiff = lastFret ? o.fret - lastFret : 0; 
      ///console.log('fretDiff',fretDiff,'lastFretDiff',lastFretDiff);

      //FIXME: can probably simplify this once my goals are better understood
      if (drift3 && Math.abs(drift3 + fretDiff) > 4) { 
        return 'drift3: drifting too much in one direction, drift3: ' + drift3 + ' fretDiff: ' + fretDiff; 
      }

      if (drift2 && Math.abs(drift2 + fretDiff) > 4) { 
        return 'drift2: drifting too much in one direction, drift2: ' + drift2 + ' fretDiff: ' + fretDiff; 
      }

      if (lastFretDiff && Math.abs(lastFretDiff + fretDiff) > 4) { 
        return 'lastFretDiff: drifting too much in one direction, lastFretDiff: ' + lastFretDiff + ' fretDiff: ' + fretDiff; 
      }

      var fretDistance = Math.abs(fretDiff);



      if (fretDistance > env.maxFretDistance) { return 'fretDistance > ' + env.maxFretDistance; }
      ///if (fretDistance > 3) { return 'fretDistance > 3'; }
      if (lastFretDiff && Math.abs(lastFretDiff + fretDiff) > 4) { return 'lastFretDiff+fretDiff >4'; } ///if they don't cancel each other out and their total is too big

      var stringDiff = lastString? Math.abs(o.string - lastString) : 0;
      if (stringDiff > 2) { return 'stringDiff>2'; }

      //now for the avg
      var avgFretDistance = avgFret ? Math.abs(o.fret - avgFret) : 0;
      var avgStringDiff = avgString ? Math.abs(o.string - avgString): 0;
      if (avgFretDistance > 4) { return 'avgFretDistance>4'; }
      ///if (avgStringDiff > 2) { return 'avgStringDiff>2'; }

      return 'OK';
    };

    var criteria = function(o,env){
      var outsideDecision = outsideJudge(o,env);
      if (outsideDecision !== 'OK') { 
        outsideRejections.push({
            candidate: o,
            decision:outsideDecision,
            lastResult: lastResult
        });
        return false; 
      }
      //console.log('decision',decision);
      var decision = judge(o,env);

      if (decision != 'OK') { //chordNoteIdx == 0 && 
        rejections.push({
            candidate: o,
            decision:decision,
            lastResult: lastResult
        });
      }
      return  outsideDecision == 'OK' && decision == 'OK';
    };




campfire.subscribe('do-it',function(prog){
  initLast();


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

  ['654321','6432','4321','5432','5321','6543','321','432','543','654'].forEach(function(stringSet){
    var cb = jQuery('.cb-stringset-' + stringSet);
    if (!cb.attr('checked')) { return false; }


    var activeStrings = stringSet.split('');
    BSD.activeStrings = activeStrings; //FIXME, this won't work in the long run
    prog.forEach(function(chordItem,chordItemIdx){
      var chord = chordItem.chord;
      var stage = DOM.div().addClass('stage hidden stringset-' + stringSet);

      venue.append(stage);
      var board = makeFretboardOn(stage,{
        chord: chord,
        activeStrings: activeStrings
      });
      BSD.boards.push(board);
    });
  });

  campfire.publish('fret-range-updated',BSD.options.fretRange); //this affects boards..



  var errors = 0;
  var cycleRange = [];
  for(var i = 0; i < BSD.progCycles; i += 1) {
    cycleRange.push(i); 
  }



  cycleRange.forEach(function(cycleIdx){
    prog.forEach(function(chordItem,chordItemIdx) {
      if (errors) { return false; }


      rejections = [];
      outsideRejections = [];
      ///var barIdx = Math.floor(i / BSD.noteResolution);
      var barIdx = chordItem.barIndex;
      //var chordIdx = barIdx % chords.length;
      var chordIdx = chordItemIdx;
      var barChordIdx = chordItem.barChordIndex;
      //var myChord = chords[chordIdx];
      var myChord = chordItem.chord;
      ///var cycleIdx = Math.floor(barIdx / prog.length);
      //var cycleIdx = Math.floor(barIdx / chords.length);
      ///cycleIdx = Math.floor(cycleIdx / chords.length);
      ////console.log('barIdx',barIdx,'chordIdx',chordIdx,'cycleIdx',cycleIdx);

      if (!myChord) {
        errors += 1;
        return false;
      }
      abstractNoteValues = myChord.abstractNoteValues();

      meta.defaults = {
        maxDiff: 3, //max chromatic distance between notes....
        maxFretDistance: 3,
      };



      meta.rootAbstractValue = myChord.rootNote.abstractValue();
      meta.majorSixthAV = (meta.rootAbstractValue + 9) % 12;
      meta.ninthAV = (meta.rootAbstractValue + 2) % 12;
      meta.hasPerfectFifth = myChord.hasPerfectFifthInterval(); ///move this to o itself?
      meta.hasMinor7Quality = myChord.hasMinorThirdInterval() && myChord.hasPerfectFifthInterval() && myChord.hasDominantSeventhInterval();
      meta.maxFretDistance = meta.defaults.maxFretDistance;
      meta.maxDiff = meta.defaults.maxDiff; 
      meta.isStrongBeat = true;



      var totQuarterNoteBeats = BSD.beatsPerMeasure; //for this chord.
      if (chordItem.halfBar) {
        if (BSD.beatsPerMeasure == 3) {
          if (barChordIdx == 0) {
            totQuarterNoteBeats = 2;
          }
          else {
            totQuarterNoteBeats = 1;
          }
        }
        else {
          totQuarterNoteBeats = 2;
        }
      }

      var totNoteEvents = Math.ceil(totQuarterNoteBeats * BSD.beatsPerMeasure / BSD.noteResolution); 
      var eventRange = [];
      for (var i = 0; i < totNoteEvents; i += 1) {
        eventRange.push(i);
      }

      eventRange.forEach(function(o,chordNoteIdx) {
        if (errors) { return false; }

        meta.chordNoteIdx = chordNoteIdx;


      meta.isStrongBeat = chordNoteIdx % 2 === 0;


      if (Math.random() > 0.85) {
        ///console.log('random flip!');
        direction = nextDirection[direction];
      }
      if (lastValue <= 44) {//low E
        direction = 'up';
      }

      candidates = BSD.guitarData;


      var scale = 10;//12; //rightmost fret to idealize.
      var tot = 256; //range.length;
      var progress = i; //step
      var loopsPerTotal = 1;


      if (BSD.idealFret) {
        idealFret = BSD.idealFret;
      }
      else {
        //TODO: really undestand scaling trig unit radius circle and scaling better.
        /**
        idealFret = Math.round(scale * (Math.cos ((2 * Math.PI) / tot * progress * loopsPerTotal ) + 1) / 2);
        **/
        var start = 7; //gets blown away..
        if (BSD.options.fretRange) {
          start = Math.floor(BSD.options.fretRange.average());
        }


        /////campfire.publish('test-periodic',{ total: BSD.progCycles, scale: start, shift: start });
        
        ////return "ROOOOOOO";;;;

        ////idealFret = scaleThenShift(cycleIdx,BSD.progCycles,start,start,Math.cos);
        //////console.log('periodic idealFret',idealFret,'cycle',cycleIdx);



        //var offset = start;
        /****

        var width = BSD.options.fretRange[1] - BSD.options.fretRange[0];
        var total = BSD.progCycles;
        var offset = start;
        var centerShift = 0;
        var i = cycleIdx
        ///for (let i = 0; i < total; i += 1) { console.log(  offset + (Math.cos(  i/total * 2 * Math.PI) * (width/2) + centerShift)  ); }

        ***/
        var width = BSD.options.fretRange[1] - BSD.options.fretRange[0];
        var total = BSD.progCycles;
        var centerShift = 0;
        var offset = start;
        idealFret = offset + (Math.cos(cycleIdx/total * 2 * Math.PI) * (width/2) + centerShift);


      }


      ///console.log('i/idealFret',i,idealFret);

      if (lastFrets.length >0) {
        avgFret = Math.round(lastFrets.sum() / lastFrets.length);
      }


      if (lastStrings.length >0) {
        avgString = Math.round(lastStrings.sum() / lastStrings.length);
      }

      if (lastFretDiffs.length >0) {
        drift3 = lastFretDiffs.slice(-3).sum(); //sum the latest 3
      }

      if (lastFretDiffs.length >0) {
        drift2 = lastFretDiffs.slice(-2).sum(); //sum the latest 3
      }

      rejections = [];
      outsideRejections = [];
      candidates = candidates.select(function(o) {
        return criteria(o,meta);
      });


      var solutions = [
        function() { meta.maxDiff += 1;  console.log("increased meta.maxDiff to " + meta.maxDiff); },
        function() { meta.maxFretDistance += 1;  console.log("increased meta.maxFretDistance to " + meta.maxFretDistance); },
        function() { direction = nextDirection[direction]; console.log("changed direction to " + direction);   },
      ];

      var retries = 0;
      while (retries < 110 && candidates.length == 0) {
        console.log('pre-proto uh oh retry#',retries);
        var last = BSD.sequence[BSD.sequence.length-1];
        console.log('last barIdx',last.barIdx,'cycleIdx',last.cycleIdx,'last',last);

        var solution = solutions.atRandom();

        solution();

        ///console.log('flip! (necessity)');
        rejections = [];
        outsideRejections = [];
        candidates = BSD.guitarData.select(function(o) {
          return criteria(o,meta);
        });
        retries += 1;
      }

      /***
      //try increasing allowed fret distance
      if (candidates.length == 0) {
        console.log('pre-proto uh oh');
        var last = BSD.sequence[BSD.sequence.length-1];
        console.log('last barIdx',last.barIdx,'cycleIdx',last.cycleIdx,'last',last);
        meta.maxFretDistance += 1;
        //direction = nextDirection[direction];
        ///console.log('flip! (necessity)');
        rejections = [];
        outsideRejections = [];
        candidates = BSD.guitarData.select(function(o) {
          return criteria(o,meta);
        });
      }

      //try flipping direction
      if (candidates.length == 0) {
        console.log('uh oh');
        var last = BSD.sequence[BSD.sequence.length-1];
        console.log('last barIdx',last.barIdx,'cycleIdx',last.cycleIdx,'last',last);

        direction = nextDirection[direction];
        ///console.log('flip! (necessity)');
        rejections = [];
        outsideRejections = [];
        candidates = BSD.guitarData.select(function(o) {
          return criteria(o,meta);
        });
      }

      if (candidates.length == 0) {
        console.log('uh oh #2');

        //console.log('barIdx',BSD.sequence[BSD.sequence.length-1].barIdx);
        console.log('last barIdx',last.barIdx,'cycleIdx',last.cycleIdx,'last',last);
        rejections = [];
        outsideRejections = [];
        candidates = BSD.guitarData.select(function(o) {
          return criteria(o,meta);
        });
      }
      ********/



      if (candidates.length == 0) {
          errors += 1;
          return false;
      }



      meta.maxFretDistance = meta.defaults.maxFretDistance;
      meta.maxDiff = meta.defaults.maxDiff      


      if (chordNoteIdx == 0) { //first note in new chord change... try to get nearest pitch to last note played.

    
        var sorted = candidates.sort(BSD.sorter(function(o) {
          return distScore(o.chromaticValue,lastAbstractValue);
        }));

        console.log('remaining choices',sorted.map(function(o){ return Note(o.chromaticValue).name(); }).join(','));


        var sortedScores = sorted.map(function(o){ 
          return [Note(o.chromaticValue).name(),distScore(o.chromaticValue,lastAbstractValue)]; 
        });
        console.log('sorted Scores',sortedScores);

        result = sorted[0];
        console.log('*FN* i',i,
          myChord.fullAbbrev(),
          'chose',Note(result.noteValue).name(),
          'lastNote',lastNote.name(),
          'distScore()',distScore(result.chromaticValue,lastAbstractValue),
          'result.chromaticValue',result.chromaticValue,
          'lastAbstractValue',lastAbstractValue
        );
      }
      else {
        result = candidates.atRandom();
        console.log('i',i,
          myChord.fullAbbrev(),
          'chose',Note(result.noteValue).name(),
          'lastNote',lastNote.name(),
          'distScore()',distScore(result.chromaticValue,lastAbstractValue),
          'result.chromaticValue',result.chromaticValue,
          'lastAbstractValue',lastAbstractValue
        );
      }

      result = JSON.parse(JSON.stringify(result));
      result.barIdx = barIdx;
      result.totQuarterNoteBeats = totQuarterNoteBeats;
      result.totNoteEvents = totNoteEvents;

      result.direction = direction;
      result.chordIdx = chordIdx;
      result.board = BSD.boards[chordIdx];
      result.chord = myChord;
      result.chordNoteIdx = chordNoteIdx;
      result.cycleIdx = cycleIdx;

      result.idealFret = idealFret;
      result.avgFret = avgFret;
      ///result.idx = i;
      
      console.log('result',result);


      if (!result) {
        errors += 1;
      }

      BSD.sequence.push(result);

      lastResult = result;
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

      }); //eventRange

    }); //prog

  }); //BSD.progCycles
  ///console.log('sequence',sequence);


  if (errors) {
    alert('Oops, I had an error. Try a few more times (5x max) before you give up on me.');
    return false;
  }

  BSD.sequence.forEach(function(o,idx) {
    o.idx = idx;
    var ndx = idx+1;
    ndx = ndx % BSD.sequence.length;
    o.next = BSD.sequence[ndx];
  });
  //console.log('sequence',sequence);
  ///BSD.sequence = sequence;
  //////sequence.forEach(function(o){})
  BSD.timeout = false;
  
  BSD.totalBars = BSD.sequence[BSD.sequence.length-1].barIdx + 1;
  
  songFormPosition.empty();


  var range = [];
  for (var i = 0; i < BSD.totalBars; i += 1) {
    range.push(i);
  }
  range.forEach(function(i) {
    var div = DOM.div(i+1).addClass('bar bar-' + i);
    songFormPosition.append(div);

    div.click(function(){
      BSD.clickedBar = i;
      var event = BSD.sequence.detect(function(o) {
        return o.barIdx == i;
      });
      console.log('event',event);
      tick(event);
    });
  });


  tick(BSD.sequence[0]);
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

var shiftThenScale = periodicA;
var scaleThenShift = periodicB;




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
    console.log('B scale then shift (cos) i',i,'result',resB);
  }

  for (var i = 0; i < o.total; i += 1) {
    var resB = periodicB(i,o.total,o.shift,o.scale,Math.sin);
    console.log('B scale then shift (sin) i',i,'result',resB);
  }

});

  campfire.subscribe('song-form-position',function(o){

    songFormPosition.find('.active').removeClass('active');
    songFormPosition.find('.bar-' + o.barIdx).addClass('active');
    songCycleIndicator.html(o.cycleIdx+1);
  });

  var saveBarIdx = false;
  campfire.subscribe('tick',function(cursor){
    if (cursor.barIdx != saveBarIdx) {
      saveBarIdx = cursor.barIdx;
      campfire.publish('song-form-position',cursor);
    }
  });

campfire.subscribe('tick',function(cursor){
  BSD.boards.forEach(function(board){
    board.publish('unfeature-frets');
  });

  if (!BSD.options.playChordsOnly) {
    cursor.board.publish('feature-fret',cursor);
    extraBoard.publish('feature-fret',cursor);
  }
});

campfire.subscribe('tick',function(cursor){
  if (cursor.chordNoteIdx == 0) {
    bassist.playNote(cursor.chord.rootNote.plus(-12),1000);
  }
  if (cursor.totQuarterNoteBeats == 4 && BSD.noteResolution == 4 && cursor.chordNoteIdx == 2) { //3rd beat in [0,1,2,3]
    bassist.playNote(cursor.chord.myFifth().plus(-12),1000);
  }
});

campfire.subscribe('tick',function(cursor){
  if (cursor.chordNoteIdx == 0) {
    BSD.boards.forEach(function(board){
      board.publish('get-wrap',function(wrap){
        BSD.options.showCurrentChordFretboadOnly ? wrap.addClass('hidden') : wrap.removeClass('hidden');
      });
    });
    cursor.board.publish('get-wrap',function(wrap){ //just in case they were hidden...
        wrap.removeClass('hidden');  
    });
    if (BSD.options.scrollToBoard) {
      cursor.board.publish('get-wrap',function(wrap){
        jQuery('html, body').animate({ 
          scrollTop: wrap.find('.chord-name').offset().top - headerHeight 
        },200);
      });
    }
  }
});

campfire.subscribe('tick',function(cursor){
  if (!BSD.options.playChordsOnly) {
    campfire.publish('play-note', { note: Note(cursor.noteValue), duration: 1000 });
  }
});

campfire.subscribe('tick',function(cursor){
      //var midSwung82 = (swung82+even8DelayMS) / 2;/////].sum() /2;
      var thisIdx = cursor.chordIdx;
      var node = cursor;


      for (var i = 0; i < 16 && node.chordIdx == thisIdx; i += 1) { //at most, make 16 attempts.
          node = node.next;    
      }
      
      var nextChord = node.chord;
  
      //LAST QUARTER NOTE OF MEASURE
      if (BSD.noteResolution == 4 && cursor.chordNoteIdx + 1 == cursor.totQuarterNoteBeats) {
        setTimeout(function(){
          campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
        },delayMS.swung81);
      }

      if (BSD.noteResolution == 2 && cursor.chordNoteIdx == 1) { 
        setTimeout(function(){
          campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
        },delayMS.even4DelayMS + swung81);
      }

      if (cursor.totQuarterNoteBeats == 4) {
        if (BSD.noteResolution == 1 && cursor.chordNoteIdx === 0) { 
          setTimeout(function(){
            campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
          },delayMS.even1 - delayMS.swung82);
        }
        if (BSD.noteResolution == 8 && cursor.chordNoteIdx == 6) { 
          //queue up next chord just before its note will sound. 2/3 to give a swung "and of 4" feel.
          setTimeout(function(){
            campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
          },delayMS.swung81);
        }

        if (BSD.noteResolution == 16 && cursor.chordNoteIdx == 12) { 
          //queue up next chord just before its note will sound. 2/3 to give a swung "and of 4" feel.
          setTimeout(function(){
            campfire.publish('play-chord', { chord: nextChord, duration: 1500 });
          },delayMS.swung81);
        }
      }

});

/**
campfire.subscribe('tick',function(cursor){



});

campfire.subscribe('tick',function(cursor){

});
**/

campfire.subscribe('reset-sequence-next',function(){

  var last = false;
  BSD.sequence.forEach(function(s){
    if (last) {
      last.next = s;
    }
    last = s;
  });
  last.next = BSD.sequence[0];
});

campfire.subscribe('tick',function(cursor){
  BSD.barIdx = cursor.barIdx;
});


  var btnLoopStart = jQuery('.btn-loop-start');
  btnLoopStart.click(function(){

    if (BSD.loopEnd !== 0 && !BSD.loopEnd) {
      BSD.loopEnd = BSD.sequence.length - 1;
    }
    BSD.loopStart = BSD.barIdx;
    btnLoopStart.html('A: ' + (BSD.loopStart+1));


    campfire.publish('reset-sequence-next');
    BSD.loop = BSD.sequence.select(function(o){
      //FIXME: insisting on cycleIdx == 0 for now... is there a better way?      
      return o.cycleIdx == 0 && o.barIdx >= BSD.loopStart && o.barIdx <= BSD.loopEnd;
    });

    BSD.loop[BSD.loop.length-1].next = BSD.loop[0];
    tick(BSD.loop[0]);
  });
  var btnLoopEnd = jQuery('.btn-loop-end');
  btnLoopEnd.click(function(){
    if (BSD.loopStart !== 0 && !BSD.loopStart) {
      BSD.loopStart = 0;
    }
    BSD.loopEnd = BSD.barIdx;
    btnLoopEnd.html('B: ' + (BSD.loopEnd+1));

    campfire.publish('reset-sequence-next');
    BSD.loop = BSD.sequence.select(function(o){
      //FIXME: insisting on cycleIdx == 0 for now... is there a better way?
      return o.cycleIdx == 0 && o.barIdx >= BSD.loopStart && o.barIdx <= BSD.loopEnd;
    });

    BSD.loop[BSD.loop.length-1].next = BSD.loop[0];
    tick(BSD.loop[0]);
  });


      
    </script>
<?php
});

get_footer();
