<?php

add_filter('wp_title',function($o){ return 'Song'; });
  

add_action('wp_head',function(){
?>

<!-- may try out some variations on eachify -->


<style type="text/css">


  .clear { clear: both; }

  .foo img { width: 100%; }
  input { width: 100%; }


  body { font-family: Helvetica, Arial; }

  #table1-wrap table tr{ border-bottom: 1px solid #aaa; }
  #table1-wrap table tr td{ padding: 3px; border-top: 1px solid #aaa; border-left: 1px solid #aaa; }


  #table1-wrap table tr.new-bar td{ border-top: 4px solid #904; border-bottom: none; }

  #table1-wrap table tr td { text-align: center; }
  #table1-wrap table tr td.chord-name { width: 60px; }

  #table1-wrap table tr td.cell { width: 25px; text-align: center; }



  #table1-wrap table tr td.on { background-color: #647; color: white; }



  #table1-wrap ul { list-style-type: none; }
  #table1-wrap ul li { float: left; margin-right: 1.5em; }


  .roll-ui { width: 90%; margin: 0 auto; margin-top: 1em; }
  .roll-ui .bar { width: 24%;  float: left; position: relative;}
  .roll-ui .bar .chord { float: left; border: 1px solid white; width: 99%; }
  .roll-ui .bar .chord.half { width: 49%; }
  .roll-ui .bar .chord.third { width: 32%; }
  .roll-ui .bar .chord.fourth { width: 24%; }

  .roll-ui .bar ul { list-style-type: none; margin: 0; padding: 0; /* height: 85%; position: absolute; bottom: 0; */ }
  .roll-ui .bar ul li { height: 0.9em; padding-left: 0.5em; }  
  .roll-ui .cell { font-size: 0.4em; border-top: 1px solid #abc; padding: 1px; }
  .roll-ui .on { background-color: #38f; color: white;  }
  .roll-ui .scale.on { background-color: #edf; color: #98f;  }

  .roll-ui .on.young { background-color: #9f9; color: #393;  }
  .roll-ui .on.old { background-color: #f99; color: #933;  }
  .roll-ui .on.young.old { background-color: #fc9; color: #963;  }

  .roll-ui .legend div { float: left; padding: 5px; }

  #roll-wrap { width: 55%; float: right; }
  #roll-wrap ul { list-style-type: none; margin: 0; padding: 0; }
  #roll-wrap ul li { height: 2em; }
  #roll-wrap .cell { font-size: 0.8em; }

  .bsd-widgets-player { width: 100%;  }
  .panel { float: left; }
  .panel-left { width: 20%; }
  .panel-right { width: 55%; }
  .bsd-widgets-player label { margin-right: 1em; }
  .bsd-widgets-player .fret, .bsd-widgets-player .fret-label { 
    /*
    width: 21px; 
    height: 14px; line-height: 14px; 
    */
    width: 5%;
    height: 2em; line-height: 2em;

    background: #eee; border-radius: 2px; 
    float: left; margin: 1px; text-align: center; 
    cursor: pointer;
  }
  
  .bsd-widgets-player .fret-label { font-size: 0.5em; }
  .bsd-widgets-player .legend .fret { width: 92px; }



  /* lowest priority in the cascade */
  .bsd-widgets-player .fret.compat-scale { background: #dcd; }
  .bsd-widgets-player .fret.compat-scale-root { background: #ace; }
  .bsd-widgets-player .fret { font-size: 0.5em; }
  .bsd-widgets-player .fret-1 { border-radius: none; border-left: 1px solid black; }

  #ignore .bsd-widgets-player .fret.prev { background: #bba; }
 /* .bsd-widgets-player .fret.next { background: #ccc; } */
  .bsd-widgets-player .fret.on { background: #fa0; color: #940; }
  .bsd-widgets-player .fret-0 { background: #fff; border-radius: none; border-right: 1px solid black; }
  .bsd-widgets-player .fret-0.on { background: #750; color: white; }


  .bsd-widgets-player .fret.color { color: white; }
  .bsd-widgets-player .fret.root { background: #d80; color: white; }

  .bsd-widgets-player .position-indicator { list-style-type: none;  }
  .bsd-widgets-player .position-indicator li { margin: 0; float: left; width: 25%; background: #aaf; color: #ddf; text-align: center;  }
  .bsd-widgets-player .position-indicator li.selected { background: yellow; color: #778; }

  /* .bsd-widgets-player .fret.above { background: #ccd; } */
  .sticky-note {  position: absolute; top: 20px; left: 20px; cursor:  pointer; box-shadow: 3px 3px 13px #aaa; z-index: 100; }
  .sticky-note textarea { background: #ffa; cursor:  pointer; border: 1px solid #dd8; width: 20px; height: 20px; font-family: Georgia; }
  .surface { background: #39a; border: 4px solid red; width: 180px; height: 80px; }
  .loading-label { background: #005; color: white; font-weight: bold; padding: 4px; }
  
  
  #fretboard-viz-wrap { float: left; }
  
  
  #faker-wrap .chord-notes .note { display: inline; float: left; }
  #faker-wrap .scale-mode .note { display: inline; float: left; cursor: pointer; }
  #faker-wrap .faker-cell { float: left; display: inline; }
  #faker-wrap table td { border-top: 1px solid grey; border-right: 1px solid grey; }
  #faker-wrap table { border-bottom: 1px solid grey; border-left: 1px solid grey; }
  #faker-wrap .current { background: #ffc; }
  
  #faker-wrap .note.third { background: #ff2; }
  .faker-cell { margin: 4px; }
  
  #faker-wrap .near-next-third { background: #afa; }
  #faker-wrap .next-third { background: #5f5; color: white; }
  
    
    
    ul.song-list { list-style-type: none; width: 140px; }
    ul.song-list li { 
      cursor: pointer; 
      font-size: 1.2em; 
      padding: 3px; 
    }
    ul.song-list li.selected{ background: #409; color: white; }


  .noselect {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
  }
</style>
<style type="text/css" media="print">
  body { font-size: 0.5em; }
</style>
<?php 
});

get_header(); 


?>
<div id="song-list-wrap"></div>
<button id="sticky-note-button">Sticky Note</button>
<div id="stage"></div>
<br />
  <div class="slider-wrap">
      Detune:<br /> <span id="detune-amount">0</span>
    <div class="slider" id="detune-input"></div>
  </div>

  <div class="slider-wrap">
      Speed (delay):<br /> <span id="speed-amount">1000</span>
    <div class="slider" id="speed-input"></div>
  </div>


  <div class="slider-wrap">
      Tempo<br /> <span id="tempo-amount">0</span>
    <div class="slider" id="tempo-input"></div>
  </div>


  <div class="slider-wrap">
      Repeats:<br /> <span id="repeats-amount">1</span>
    <div class="slider" id="repeats-input"></div>
  </div>
  
  <div style="clear: both;">&nbsp;</div>        
<br />
<button id="pause">Pause</button>

<div id="progression-clock-wrap"></div>
<div id="fretboard-viz-wrap" class="noselect"></div>
<div id="roll-wrap" class="roll-ui"></div>



<div id="faker-wrap" class="roll-ui"></div>
<div id="riffer-wrap" class="roll-ui"></div>

<div id="table1-wrap"></div>
<div id="table2-wrap"></div>

<?php

add_action('wp_footer',function() {
?>
<script src="javascript/bsd.widgets.riffer.js"></script>
<script src="javascript/bsd.widgets.faker.js"></script>
<script src="javascript/bsd.widgets.progressionclock.js"></script>
<script src="javascript/bsd.widgets.fretboardviz.js"></script>
<script src="javascript/bsd.widgets.roll.js"></script>


<script src="javascript/bsd.widgets.baseplayer.js"></script>
<script src="javascript/bsd.widgets.stringoscillator.js"></script>
<script src="javascript/bsd.widgets.tonalityguru.js"></script>
<script src="javascript/bsd.widgets.guitarplayer.js"></script>
<script src="javascript/bsd.widgets.sequencer.js"></script>

<script src="javascript/bsd.mandolin.js"></script>
<script src="javascript/bsd.widgets.songlist.js"></script>
<script src="javascript/prob.js"></script>
<script type="text/javascript">


  function midi2Hertz(x) {
    return Math.pow(2,(x-69)/12)*440;
  }


  var isUnlocked = false;
  

  BSD.hzTable = [];
  var a = 440; // a is 440 hz...
  for (var x = 0; x <= 127; ++x)
  {
    BSD.hzTable[x] = midi2Hertz(x);
  }

  var fretboardVizWrap = jQuery('#fretboard-viz-wrap');
  
  /** wavetable experimentation **/
  var context;
  
  /* audio stuff */
  if (typeof webkitAudioContext != "undefined") {
    context = new webkitAudioContext();
    BSD.audioContext = context;
  }
  

  ////BSD.audioPlayer = false;
  BSD.riffer = false;
  BSD.faker = false;
  
  var campfire = BSD.PubSub({});

  var fretboardViz = false; /// global

  
  BSD.aaaaaparseProgression = function(progString) {
    var barStrings = progString.split('|');
    var bars = barStrings.map(function(barString){
      var chordNames = barString.split(/,|\ +/);
      var chords = chordNames.map(function(o){
        var origChord = makeChord(o);
        
        return origChord.plus(-12);
        
      });
      return chords;
    });
    return bars;
  };


  BSD.parseProgression = function(progString) {
    var barStrings = progString.split('|');
    
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
  

  var progressionClock;
  var sequencer = BSD.Widgets.Sequencer({ tempo: BSD.tempo }); 
  

  function tempoToMillis(bpm) {
    var minutesPerBeat = 1 / bpm;
    var secs = minutesPerBeat * 60;
    var millis = secs * 1000;
    return millis;
  }

  BSD.timeout = false;

  function tick(cursor) {

    if (cursor.name) { console.log('TICK',cursor.name); }

    var beatMS = tempoToMillis(BSD.tempo);
    var halfBarMS = beatMS * 2;
    var fullBarMS = beatMS * 4;
    var ms = (cursor.halfBar) ? halfBarMS : fullBarMS;


    if (!BSD.paused) {
      campfire.publish('chord-change',cursor);
    }

    cursor = cursor.next;

      clearTimeout(BSD.timeout);
      BSD.timeout = setTimeout(function() {
        tick(cursor); 
      },ms);
  }

  
  campfire.subscribe('lets-do-this',function(progString) {
    var progName = Math.round(Math.random() * 22);
    if (BSD.timeout) {
      clearTimeout(BSD.timeout);
    }

    var events = BSD.parseProgression(progString);
    var prev = false;
    events.forEach(function(o) {
      if (prev) { 
          prev.name = progName;
          prev.next = o; 
          prev.current = prev;
      }
      prev = o; 
    });
    prev.next = events[0];
    prev.current = prev;
    prev.name = progName;

    console.log('prog',progString,'events',events);

    var cursor = events[0];
    tick(cursor);


    ///return false;


    fretboardViz = BSD.Widgets.FretboardViz({ 
      gossip: campfire,
      progression: progString, 
      guid: 'CHORXDY'
      ////audioPlayer: BSD.audioPlayer 
    });
    fretboardViz.subscribe('noteClicked',function(n) {
      BSD.leader.playNote(n,1000);
    });
      
      
      
    /***        
    fretboardViz.subscribe('div-hover',function(payload) {
    
      ///console.log('fbv hover',payload);
      BSD.currentFretDiv = payload;
    });
    ***/
    
    
    
    fretboardViz.subscribe('note-hover',function(note){
      BSD.currentNote = note;  
    });
    
    
    fretboardViz.subscribe('play-note',function(note){    
      ////console.log('fbvz i heard play note',note);
      BSD.leader.playNote(note,1000);

      ///////campfire.publish('playNote',{ note: note, duration: 1000 });
    });



    campfire.subscribe('noteClicked',function(n) {
      ////console.log('ahhwooot');
      /////BSD.audioPlayer.playNote(n,1000);
      BSD.leader.playNote(n,1000);
    });

    campfire.subscribe('chord-change',function(o){
      fretboardViz.publish('chord-change',o);
      BSD.chunker.playChord(o.current.chord,1000);  
    });



    fretboardViz.renderOn(fretboardVizWrap);

    
    /***
    campfire.subscribe('pause',function(o){
      progressionClock.pause();
    });
    
    campfire.subscribe('play',function(o){
      progressionClock.play();
    });
    ///BSD.chordy = progressionClock;
    BSD.clock = progressionClock;
    ***/
    
  });


  BSD.keycodes = {
    f: 70
  };

  var stage = jQuery('#stage'); ///DOM.div().addClass('stage');


  BSD.currentFretDiv = false;
  BSD.currentNote = false;


  BSD.repeats = 1;



  BSD.songlist.subscribe('song-selected',function(song) {
    BSD.currentSong = song;
    campfire.publish('lets-do-this',song.progression);
  });



  campfire.subscribe('start-your-engines',function(){
    
    
      BSD.chunker = BSD.Widgets.GuitarPlayer({
      gossip: campfire,
      context: context,
      destination: context.destination,      
      polyphonyCount: 32,//polyphonyCount,
      range: [-300,80]
    });

    BSD.leader = BSD.Widgets.GuitarPlayer({
      gossip: campfire,
      context: context,
      destination: context.destination,      
      polyphonyCount: 32,//polyphonyCount,
      range: [-300,80]
    });
  



    /**
    BSD.faker = BSD.Widgets.Faker({
      gossip: campfire
    });
    **/
    

    BSD.paused = false;
    var pauseButton = jQuery('#pause');
    pauseButton.click(function(){
      BSD.paused = ! BSD.paused;
      campfire.publish('pause',BSD.paused);
    });
    
    
    
    campfire.subscribe('playNote',function(payload) {
      //BSD.audioPlayer.playNote(payload.note,payload.duration);    
      BSD.leader.playNote(payload.note,payload.duration);    
    });
    
    campfire.subscribe('noteClicked',function(n) {
      ////console.log('ahhwooot');
      /////BSD.audioPlayer.playNote(n,1000);
      BSD.leader.playNote(n,1000);
    });
    
    campfire.subscribe('play-chord',function(o) {
      ////console.log('campfire heard play-chord',o);
      ///////////BSD.audioPlayer.playChord(o.chord,o.duration);    
      BSD.chunker.playChord(o.chord,o.duration);
    });
    
    
    campfire.subscribe('fretDivHover',function(payload) {
      BSD.currentFretDiv = payload;
    });
    campfire.subscribe('div-hover',function(payload) {
      BSD.currentFretDiv = payload;
    });
    
    jQuery(document).on('keydown',function(e) {
      var c = e.keyCode || e.which;

      if (BSD.currentNote && c == BSD.keycodes.f) {
        BSD.leader.playNote(BSD.currentNote,1000);
      }      
      /***
      if (BSD.currentFretDiv && c == BSD.keycodes.f) {
        BSD.currentFretDiv.trigger('click');    
      }   
      ***/   

    });
  });

  campfire.publish('start-your-engines');

  var progInput = DOM.input().addClass('progression').attr('type','text');
  progInput.blur(function() { 
    ////console.log('okay');
    if (progInput.val().length == 0) { return false; }
    campfire.publish('lets-do-this',progInput.val());
  });
  
  var inputLabel = DOM.label('Progression');
  inputLabel.append(progInput);
  stage.append(inputLabel);

  var exampleProg = 'C-7|F-7|D-7b5 G7';
  var exampleLabel = DOM.label('Example: '  + exampleProg + '<br />');
  exampleLabel.click(function() {
    progInput.val(exampleProg);
    progInput.blur();
  });
  stage.append(exampleLabel);

  var stickyNoteButton = jQuery('#sticky-note-button');
  stickyNoteButton.click(function() {
    var sticky = BSD.Widgets.StickyNote();
    sticky.renderOn(jQuery(document.body));
  });



  
  ///////unlock(); //iOS, you stinker, you!
  
  
  
  
var waiter = BSD.Widgets.Procrastinator({ timeout: 250 });
var waiter2 = BSD.Widgets.Procrastinator({ timeout: 250 });

BSD.volume = 0;
storage.getItem('volume',function(o){
    BSD.volume = parseFloat(o);
    ////waiter.beg(BSD.audioPlayer,'set-master-volume',BSD.volume);
    waiter.beg(BSD.leader,'set-master-volume',BSD.volume);
    waiter2.beg(BSD.chunker,'set-master-volume',BSD.volume);
    jQuery( "#volume-amount" ).text( BSD.volume );
});

$( "#volume-input" ).slider({
  orientation: "horizontal",
  range: "min",
  min: 0,
  max: 1,
  step: 0.01,
  value: BSD.volume,
  slide: function( event, ui ) {
    var newVolume = ui.value;
    waiter.beg(BSD.leader,'set-master-volume',ui.value);
    waiter2.beg(BSD.chunker,'set-master-volume',ui.value);
    storage.setItem('volume',newVolume);     
    jQuery( "#volume-amount" ).text( newVolume );
  }
});



$( "#detune-input" ).slider({
  orientation: "vertical",
  range: "min",
  min: -7.0,
  max: 7.0,
  step: 0.25,
  value: 0.0,
  slide: function( event, ui ) {
    var n = ui.value;
    
    waiter.beg(BSD.leader,'set-detune-semis',n);        
    waiter2.beg(BSD.chunker,'set-detune-semis',n);        
    jQuery( "#detune-amount" ).text( n );
  }
});





$( "#speed-input" ).slider({
  orientation: "vertical",
  range: "min",
  min: 100,
  max: 2000,
  step: 50,
  value: 1000,
  slide: function( event, ui ) {
    var n = ui.value;
    
    waiter.beg(progressionClock,'set-speed-ms',n);        
    jQuery( "#speed-amount" ).text( n );
  }
});

BSD.tempo = 0;
storage.getItem('tempo',function(o){
    BSD.tempo = parseInt(o,0);
    ////sequencer.setTempo(BSD.tempo);//////BSD.Widgets.Sequencer({ tempo: BSD.tempo }); 
    ////waiter.beg(progressionClock,'set-tempo',n);        
    jQuery( "#tempo-amount" ).text( o );
});



$( "#tempo-input" ).slider({
  orientation: "vertical",
  range: "min",
  min: 50,
  max: 150,
  step: 1,
  value: BSD.tempo,
  slide: function( event, ui ) {
    var n = ui.value;
    BSD.tempo = n;
    storage.setItem('tempo',BSD.tempo);
    jQuery( "#tempo-amount" ).text( n );
  }
});
$('#tempo-input').trigger('slide');


$( "#repeats-input" ).slider({
  orientation: "vertical",
  range: "min",
  min: 0,
  max: 50,
  step: 1,
  value: BSD.repeats,
  slide: function( event, ui ) {
    var n = ui.value;
    
    BSD.repeats = n;
    
    jQuery( "#repeats-amount" ).text( n );
  }
});


  var songlistWrap = jQuery('#song-list-wrap');
  
  BSD.songlist.renderOn(songlistWrap);

  BSD.leader.publish('set-master-volume',0.01);
  BSD.chunker.publish('set-master-volume',0.01);
  
</script>

<?php
});

get_footer();