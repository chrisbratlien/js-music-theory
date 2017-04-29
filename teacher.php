<?php

add_action('wp_head',function(){
?>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">
<link media="screen" href="css/testsuite.css" type="text/css" rel="stylesheet">
<link media="screen,print" href="css/fretboard.css" type="text/css" rel="stylesheet">
<link media="print" href="css/fretboard-print.css" type="text/css" rel="stylesheet">
<link media="screen,print" href="css/teacher.css" type="text/css" rel="stylesheet">
<?php
});

get_header(); 


add_action('wp_footer',function(){
?>  
<script src="http://cdn.dev.bratliensoftware.com/javascript/array.js"></script>
<script src="http://cdn.dev.bratliensoftware.com/javascript/bsd.pubsub.js"></script>
<script src="http://cdn.dev.bratliensoftware.com/javascript/color.js"></script>
<script src="http://cdn.dev.bratliensoftware.com/javascript/dom.js"></script>
<script src="http://cdn.dev.bratliensoftware.com/javascript/draggy.js"></script>
<script src="http://cdn.dev.bratliensoftware.com/javascript/sticky-note.js"></script>


<script src="js/bsd.storage.js"></script>
<script src="javascript/bootup.js"></script>
<script src="javascript/js-music-theory.js"></script>
<script src="javascript/bsd.widgets.baseplayer.js"></script>
<script src="javascript/bsd.widgets.stringoscillator.js"></script>
<script src="javascript/bsd.widgets.guitarplayer.js"></script>
<script type="text/javascript" src="javascript/bsd.widgets.procrastinator.js"></script>



<script src="javascript/guitar.js"></script>

<style type="text/css">


#quiz-output .note { font-size: 3em; }

</style>
</head>
<body id="css-zen-garden">
  <div id="container">
    <div id="intro">
      <h1>Playing the Guitar in 20 Questions</h1>      
    </div>
    <div id="supportingText">
      
      
      <button id="more-palettes">Redraw Palettes</button>
      <div id="pickers">   </div><!-- pickers -->
      <div id="selected-colors">   </div>
      <div style="clear: both;">&nbsp;</div>        


        <div class="slider-wrap">
          Volume: <br /><span id="volume-amount"></span>
          <div class="slider" id="volume-input"></div>
        </div>
        <div class="slider-wrap">
            Detune:<br /> <span id="detune-amount"></span>
          <div class="slider" id="detune-input"></div>
        </div>
        <div style="clear: both;">&nbsp;</div>        



      <div id="main">

        <ol>
          <li>1. (optional) Pick a color</li>
          <li>2. Click some numbered frets to define your first chord</li>
          <li>3. Click Harmonize This! to see your chord harmonized across the major scale</li>
        </ol>
        <button id="quiz">Quiz</button>
        <div id="quiz-output">
          Find <span class="note"></span>
        </div>
      
      
      
      
      </div>
    </div>
    
    
  </div>
  
  
  
<script type="text/javascript">


var campfire = BSD.PubSub({});

if (typeof BSD == "undefined") {
  var BSD = {};    
}
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
  var selectedColors = jQuery('#selected-colors');
  
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
        picker.subscribe('click',function(color){
          BSD.chosenColor = color;    
          picker.renderOn(selectedColors);
        });
      });
    });
  });
  
  morePalettes.click(function(){
    campfire.publish('redraw-palettes');
  });
  campfire.publish('redraw-palettes');
  
  

  //var degreeStr = $('#include_degrees-' + id).val();
  //zz id = fretboardID.replace(/fretboard-/,'');
  ////var degrees = include_degrees(id);
  //console.log(scalesByDegree.length);
  
  var myScales = [
    '',
    '1,2,3,4,5,6,7',
    '',
    '1,2,3,4,5,6,7',
    '1,2,3,4,5,6,7',
    '1,2,3,4,5,6,7',
    ''
  ];
  
  
  //for (var i = 0, l = myScales.length; i < l; i += 1) {
  
  myScales.each(function(scaleString){
  
    var d = DOM.div().addClass('guitar-wrap');
    $('#main').append(d);
    var guitar = Guitar({
      degreeList: scaleString.split(','),
      maxFrets: 24, 
      //rootNote: Note("C")
    });
    JSMT.guitars.push(guitar);
    guitar.renderOn(d);

    guitar.subscribe('fret-clicked',function(o) {
      ///console.log('o?',o);
      var note = Note(o.value);
      BSD.audioPlayer.playNote(note,1000);    
    });    
    
    guitar.subscribe('fret-hover',function(o){
      BSD.currentFretDiv = o.div;
    });

    guitar.subscribe('note-hover',function(note){
      ////console.log('yayyy',note);
      BSD.currentNote = note;  

      if (BSD.strum) {
        BSD.audioPlayer.playNote(note,1000);          
      }

    });
    
    setInterval(guitar.renderHistory,4000);
    
    
  
  });
  
  
  
  ///}
      
    BSD.audioPlayer = BSD.Widgets.GuitarPlayer({
      ////gossip: campfire,
      context: context,
      ////name: 'Piano',//chosen, //'Piano',
      polyphonyCount: 48,//polyphonyCount,
      range: [-300,128]
    });
      
      
    var storage = BSD.Storage('JSMT::');
    
    var waiter = BSD.Widgets.Procrastinator({ timeout: 250 });


    BSD.volume = 0;
    storage.getItem('volume',function(o){
        BSD.volume = parseFloat(o);
        waiter.beg(BSD.audioPlayer,'set-master-volume',BSD.volume);
        jQuery( "#volume-amount" ).text( BSD.volume );
    });

/****

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
***/
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







    $( "#detune-input" ).slider({
      orientation: "vertical",
      range: "min",
      min: -7.0,
      max: 7.0,
      step: 0.25,
      value: 0.0,
      slide: function( event, ui ) {
        var n = ui.value;
        
        waiter.beg(BSD.audioPlayer,'set-detune-semis',n);        
        //////campfire.publish('set-speed-ms',n);
        jQuery( "#detune-amount" ).text( n );
      }
    });
    
    
    
    
    
    
    
    
    


    /****    
    var volumeInput = jQuery('#volume-input');
    volumeInput.change(function(){
      var level = volumeInput.val();
      BSD.audioPlayer.publish('set-master-volume',level);  
        storage.setItem('volume',level);  
    });
    ***/

  

  jQuery(document).on('keydown',function(e) {
    var c = e.keyCode || e.which;
    
    ///console.log('BSD.currentFretDiv',BSD.currentFretDiv);


    /*** possibly obsolete...not 100% sure though yet..    
    if (BSD.currentFretDiv && c == BSD.keycodes.f) {
      BSD.currentFretDiv.trigger('click');    
    }
    ****/
    


    if (BSD.currentNote && c == BSD.keycodes.f) {
      BSD.audioPlayer.playNote(BSD.currentNote,1000);    
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
  
  
  
  

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}



  var quizOutput = jQuery('#quiz-output');
  var btnQuiz = jQuery('#quiz');
  btnQuiz.click(function(){
    campfire.publish('quiz-me');
  });
  
  campfire.subscribe('quiz-me',function(){
    var val = Math.floor(getRandomArbitrary(40,78));////Math.floor(Math.random() * 78) + 40;
    console.log('val',val);
    var pick = Note(val);
    quizOutput.find('.note').html(pick.name());/////'What is ' + pick.name() + ' on string ' + string);
    BSD.audioPlayer.playNote(pick,1000);    
  });

  campfire.subscribe('quiz-me-repeat',function(){
    campfire.publish('quiz-me');
    setInterval(function(){
      campfire.publish('quiz-me');
    
    },10000);
  
  });



</script>  
</body>
</html>
<?php
});

get_footer();
