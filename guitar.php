<?php

add_action('wp_head',function() {
?>
<title>Guitar</title>
  <style type="text/css" media="print,screen">
    body { font-size: 12px; }


    table td { padding: 0.3em; text-align: center; min-width: 1em;}
    table td { border-top: 1px solid black; }
    table td { border-left: 1px solid black; }
    .hidden { visibility: hidden; }  
    
    #pickers { width: 45em; overflow: auto; }
    .color-picker { width: 2em; height: 2em; float: left; cursor: pointer;  border: 1px solid white; }

    .cell { cursor: pointer; }


    
    .slider-wrap.horizontal { 
      width: 220px;
    
    }
    
    .slider-wrap .ui-slider-vertical {
      height: 100%;
    }
    .slider-wrap.horizontal .slider {
      width: 100%;
    }
    
    #output { width: 100%; position: relative; }

    ul.song-list { list-style-type: none; width: 140px; }
    ul.song-list li { padding: 3px; font-size: 1.2em; cursor: pointer; }
    ul.song-list li.selected{ background: #409; color: white; }
  </style>

<?php  
});

get_header(); 
?>


  <div id="pickers">   </div><!-- pickers -->
  <div class="slider-wrap">
  Volume: <br /><span id="volume-amount"></span>
  <div class="slider" id="volume-input"></div>
  </div>


  <div class="slider-wrap">
      Detune:<br /> <span id="detune-amount"></span>
    <div class="slider" id="detune-input"></div>
  </div>


  <div class="slider-wrap horizontal">
      From Fret:<br /> <span id="from-fret-amount"></span>
    <div class="slider" id="from-fret-input"></div>
  </div>
  
  <div class="slider-wrap horizontal">
      To Fret:<br /> <span id="to-fret-amount"></span>
    <div class="slider" id="to-fret-input"></div>
  </div>
  
  
  
  
  <div style="clear: both;">&nbsp;</div>        
  
  
  
  <div style="clear: both;">&nbsp;</div>
  <div id="song-list-wrap"></div>
  <button id="print">print</button>
  <a id="print-target" target="_blank" href="print.html">print target</a>


  <label>Scale<br />
    <input id="scale" />
    <br />
  </label>
  <div style="clear: both;">&nbsp;</div>

  <label>Progression<br />
    <input id="progression" />
  </label>
  <div id="output"></div>


<?php



add_action('wp_footer',function(){
?>  
  <script src="javascript/bsd.storage.js"></script>
  <script src="javascript/base64.js"></script>
  <script src="javascript/bootup.js"></script>
  <script src="javascript/js-music-theory.js"></script>

  <script src="javascript/bsd.widgets.baseplayer.js"></script>
  <script src="javascript/bsd.widgets.guitarplayer.js"></script>
  <script src="javascript/bsd.widgets.stringoscillator.js"></script>
  <script src="javascript/bsd.widgets.tonalityguru.js"></script>
  <script src="javascript/bsd.guitar.js"></script>


  <script type="text/javascript" src="javascript/bsd.widgets.procrastinator.js"></script>
  <script type="text/javascript" src="javascript/bsd.widgets.lightbox.js"></script>


  <script src="javascript/bsd.widgets.songlist.js"></script>
  
  
  <link href='http://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>  


  <link href="css/guitar-screen.css" rel="stylesheet" type="text/css" media="screen">  
<script type="text/javascript">
  context = new webkitAudioContext();
  BSD.audioContext = context;
  
  BSD.volume = 0.01;
  BSD.fromFret = 0;
  BSD.toFret = 13;
  BSD.detuneSemis = 0.0;
  
  
  var storage = BSD.Storage('JSMT::');
  

  var myScales = ['A minor','E minor','D minor','A harmonic minor', 'D harmonic minor', 'E harmonic minor'];
  myScales = myScales.map(function(o){  return makeScale(o); });
  
  BSD.parseProgression = function(progString) {
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


  //ios trick
  var unlocked = false;
  window.addEventListener('touchstart', function() {
    if (unlocked) return false;
    unlocked = true;
    alert('unlocked');
  	// create empty buffer
  	var buffer = myContext.createBuffer(1, 1, 22050);
  	var source = myContext.createBufferSource();
  	source.buffer = buffer;
  
  	// connect to output (your speakers)
  	source.connect(context.destination);
  
  	// play the file
  	source.noteOn(0);
  
  }, false);
  


  var campfire = BSD.PubSub({});


  BSD.chosenColor = BSD.colorFromHex('#000000');
  BSD.ColorPicker = function(spec) {
    var self = {};
    self.renderOn = function(html) {
  ///console.log('hello');
      var square = DOM.div('').addClass('color-picker');
      square.css('background-color','#' + spec.color.toHex());
      square.click(function() {
        BSD.chosenColor = spec.color;
        ///console.log('lcick',BSD.chosenColor.toHex());
      });
  ////console.log('html',html);
      html.append(square);
    };
    return self;
  };
      
  var pickers = jQuery('#pickers');
  var palettes = [];
  palettes.push(BSD.randomPalette(20,50));
  palettes.each(function(pal) {
    pal.each(function(randcolor) { 
    var picker = BSD.ColorPicker({ color: randcolor});
    picker.renderOn(pickers);
    });
  });


var cscale = makeScale('Cmajor');
var noteNames = cscale.noteNames();
    
BSD.leader = BSD.Widgets.GuitarPlayer({
  gossip: campfire,
  context: context,
  name: 'Piano',//chosen, //'Piano',
  polyphonyCount: 16,//polyphonyCount,
  range: [-300,128]
}); 
  
var waiter = BSD.Widgets.Procrastinator({ timeout: 250 });

$( "#volume-input" ).slider({
  orientation: "horizontal",
  range: "min",
  min: 0,
  max: 0.1,
  step: 0.01,
  value: BSD.volume,
  slide: function( event, ui ) {
    BSD.volume = ui.value;
    waiter.beg(BSD.leader,'set-master-volume',BSD.volume);
    jQuery( "#volume-amount" ).text( BSD.volume );
  }
});
jQuery('#volume-amount').text(BSD.volume);

$( "#detune-input" ).slider({
  orientation: "vertical",
  range: "min",
  min: -7.0,
  max: 7.0,
  step: 0.25,
  value: BSD.detuneSemis,
  slide: function( event, ui ) {
    BSD.detuneSemis = ui.value;
    waiter.beg(BSD.leader,'set-detune-semis',BSD.detuneSemis);        
    jQuery( "#detune-amount" ).text( BSD.detuneSemis );
  }
});
jQuery('#detune-amount').text(BSD.detuneSemis);

$( "#from-fret-input" ).slider({
  //orientation: "vertical",
  orientation: "horizontal",
  range: "min",
  min: 0,
  max: 24,
  step: 1,
  value: BSD.fromFret,
  slide: function( event, ui ) {
    BSD.fromFret = ui.value;
    jQuery( "#from-fret-amount" ).text( BSD.fromFret );
    waiter.beg(waiter,'fret-update');
  }
});
jQuery('#from-fret-amount').text(BSD.fromFret);

$( "#to-fret-input" ).slider({
  orientation: "horizontal",
  range: "min",
  min: 0,
  max: 24,
  step: 1,
  value: BSD.toFret,
  slide: function( event, ui ) {
    BSD.toFret = ui.value;
    jQuery( "#to-fret-amount" ).text( BSD.toFret );
    waiter.beg(waiter,'fret-update');    
  }
});
jQuery('#to-fret-amount').text(BSD.toFret);


  var gtars = [];

  jQuery(document).on('keydown',function(e) {
    var c = e.keyCode || e.which;
    if (BSD.currentNote &&  c == BSD.keycodes.f) {    
      BSD.leader.playNote(BSD.currentNote,1000);
      return false;
    };
    
    
    ///console.log('BSD.currentFretDiv',BSD.currentFretDiv);
    if (BSD.currentFretDiv && c == BSD.keycodes.f) {
      BSD.currentFretDiv.trigger('click');    
    }      
  });
  
  var scaleInput = jQuery('#scale');
  scaleInput.change(function() {
    var scale = makeScale(this.value);
    ////console.log('scale',scale);
    scale.notes().each(function(note){
      gtars.each(function(g){
        g.plotNote(note);
      });
    });
  });
  
  var output = jQuery('#output');
  var songlistWrap = jQuery('#song-list-wrap');
  
  BSD.songlist.renderOn(songlistWrap);
  
  waiter.subscribe('fret-update',function(){
     gtars.each(function(g){
      g.updateRange(BSD.fromFret,BSD.toFret);
    });  
    BSD.songlist.publish('song-selected',BSD.currentSong);
  });

  var progInput = jQuery('#progression');
  progInput.change(function(){
    var song = { title: 'untitled', progression: progInput.val() };
    BSD.currentSong = song;
    BSD.songlist.publish('song-selected',song);
  });
  
  BSD.songlist.subscribe('song-selected',function(song) {
  
    BSD.currentSong = song;
  
    var bars = BSD.parseProgression(song.progression);

    var queue = [];
    
    var barCount = 0;
    bars.each(function(bar){
      var len = bar.length;
      bar.each(function(chord){
        queue.push({ chord: chord, bar: bar, barLength: bar.length, barCount: barCount });
      });
      barCount +=1;
    });
    


    var saveBarCount = -1;
    var barWrap = false;


    output.empty();
    output.append(DOM.h4(song.title));


    eachify(queue).eachPCN(function(o) {
    //eachify(bars).eachPCN(function(o){
      o.current.next = o.next;
      o.current.prev = o.prev;
    });


    eachify(queue).eachPCN(function(o) {
    
    
      var bar = o.current.bar;
      var chord = o.current.chord;
      var currentChord = chord;
      var nextChord = o.next.chord;
      var nextChord2 = o.next.next.chord;
      var prevChord = o.prev.chord;
      
      var barCount = o.current.barCount;
      
      
      
      
      
      
      var len = bar.length;
      if (barCount != saveBarCount) {
        ///barWrap = DOM.div().addClass('bar-wrap');
        ///output.append(barWrap);      
        saveBarCount = barCount;
      }
      ////console.log('barCount',barCount,'barWrap',barWrap,'bc',barCount,'sbc',saveBarCount);
      
      /////bar.each(function(chord){
      
        var chordWrap = DOM.div().addClass('chord-wrap length-' + len);
        //var wrap = DOM.div().addClass('chord-wrap length-' + len);
        var gtar = BSD.Guitar({
          fretRange: [BSD.fromFret,BSD.toFret],
          scales: myScales
        });
        
        gtars.push(gtar);
        
        
        var barNumber = barCount + 1;
        
        chordWrap.append(DOM.h4(barNumber).addClass('bar-number'));
        chordWrap.append(DOM.h4(currentChord.fullAbbrev()));
        
        

        var guru = BSD.Widgets.TonalityGuru({});
        var advice = guru.analyze(o);

        
        var tonalitySpan = DOM.span().addClass('tonality');
        
        var tonalityString = advice.tonalityScale ? advice.tonalityScale.fullName() : 'dunno';
        tonalityString = tonalityString.replace(/harmonic\ minor/,'HM');
        
        tonalityString += ' (j' + advice.justification + ')';
        tonalitySpan.html(tonalityString);
        chordWrap.append(tonalitySpan);
        
        
        gtar.renderOn(chordWrap);
        gtar.subscribe('note-hover',function(note){
          BSD.currentNote = note;  
        });



        if (advice.tonalityScale) {
          advice.tonalityScale.notes().each(function(note){
            gtar.plotNote(note,{});
          });
        }





        /*******
        if (tonalityScale) { 
          tonalityScale.notes().each(function(note){
            gtar.plotNote(note,{});
          });
        }
        ********/
        
        var third = currentChord.myThird();
        if (third) {
          gtar.plotNote(third,{ class: 'third balls' });
        }


        gtar.plotNote(currentChord.rootNote,{ class: 'root balls' });

        var seventh = currentChord.mySeventh();
        if (seventh) {
          gtar.plotNote(seventh,{ class: 'seventh balls' });
        }


        gtar.plotNote(nextChord.myThird(),{ class: 'next-third balls' });


        
        
        //gtar.updateRange(fromInput.val(),toInput.val());
        
        ///barWrap.append(chordWrap);
        output.append(chordWrap);
      ////});

    });
 
  });
  
  jQuery('#print').click(function(){

    var wrap = DOM.div();

    ////var link = jQuery('link');

    ////////var newHead = jQuery('head');    
    
    /////var newStyle = DOM.style();
    
    /////newStyle.append(jQuery('style').html());
    
    
    ///wrap.append(newHead.html());
    ////wrap.append(newStyle);
    wrap.append(output.html());
    
    var rendered = BSD.toDataURI(wrap.html());
    
    storage.reportDataURI = rendered;
    
  });
  
</script>
<?php
});

get_footer();
