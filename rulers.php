<?php 

add_action('wp_head',function(){
?>

    <!--
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/bsd.pubsub.js"></script>
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/dom.js"></script>
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/draggy.js"></script>
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/sticky-note.js"></script>
    <script type="text/javascript" src="javascript/js-music-theory.js"></script>
    -->




    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">

    <style type="text/css">
      #pickers { height: 40px; }
      #progression { width: 100%; }
    </style>

	<title>Rulers</title>

<?php
});


get_header();?>  
  
    <div id="content">
      <div id="msg" class="loading-label">loading...</div>
      <div class="pull-right">
        <button id="sticky-note-button">Sticky Note</button>
      </div><!-- pull-right -->




      <div class="pull-right">
        <label><strong>Progression</strong><br />
          <input id="progression" type="text" />    
        </label>      
        <button id="progression-clear">Clear</button>
        <button id="progression-help">Help</button>
        <div id="progression-help-content" style="display: none;">
          <h5>Help</h5>
          <p><strong>1</strong><br/> Type in a Chord progression into the box. Separate the chords with spaces or the "|" pipe character. <br /><br /><strong>2</strong><br/> Tab out of the text box to cause those rulers to appear. 
          <br/><br/><strong>3</strong><br/> Hit the green button to sound that chord
          <br/><br/><strong>4</strong><br/> Hit other buttons too
          <br/><br/><strong>5</strong><br/> Click a note to toggle it on/off
          </p>
          <h3>Example progressions</h3>
          <p>A- B-7b5 C D- E- F G A-</p>
          <p>CM7 D-7 E-7 FM7 G7 A-7 B-7b5 CM7</p>
          <h3>Tips</h3>
          <p>Root notes by themselves are assumed major, ex: A</p>
          <p>Use - or m for minor, ex: A- Em</p>
          <p>Use M7 for major 7, ex: CM7</p>
          <p>Use 7 for dominant 7, ex: G7</p>


          
          
          
        
        </div>
      </div><!-- pull-right -->

      <div class="pull-right">
        <label><strong>Presets</strong><br />
        <div id="ruler-control-panel"></div><!-- ruler-control-panel -->
        </label>      
      </div><!-- pull-right -->


        <div class="slider-wrap">
          Volume: <br /><span id="volume-amount"></span>
          <div class="slider" id="volume-input"></div>
        </div>
        <div class="slider-wrap">
            Detune:<br /> <span id="detune-amount"></span>
          <div class="slider" id="detune-input"></div>
        </div>
        <div style="clear: both;">&nbsp;</div>        


      <button id="bookmark">Bookmark these rulers</button>
      <div id="rulers"></div><!--rulers -->
    </div><!-- content -->


<?php

add_action('wp_footer',function() {
?>
<script type="text/javascript" src="js/color.js"></script>
<script type="text/javascript" src="js/bsd.widgets.lightbox.js"></script>
<script type="text/javascript" src="js/rulers.js"></script>
<!-- wavetable dependencies -->
<script src="js/bpm-delay.js"></script>
<script src="js/waveshaper.js"></script>
<script src="js/wavetable.js"></script>
<script src="js/fft.js"></script>
<script src="js/wavetableloader.js"></script>
<script src="js/staticaudiorouting.js"></script>
<script src="js/bsd.widgets.oscplayer.js"></script>




<!--<script src="js/bsd.widgets.baseplayer.js"></script>
<script src="js/bsd.widgets.stringoscillator.js"></script>
<script src="js/bsd.widgets.guitarplayer.js"></script>
<script src="js/bsd.widgets.simpleplayer.js"></script>
<script src="js/bsd.guitar.js"></script>
-->




    <script src="js/bsd.widgets.simpleplayer.js"></script>
    <script src="js/bsd.widgets.tonalityguru.js"></script>    


<script type="text/javascript" src="js/bsd.widgets.procrastinator.js"></script>


    <script type="text/javascript">
  
BSD.ChordRulerPanel = function(spec) {
  var self = BSD.PubSub({});
  var rulersWrap = jQuery('#rulers');
  self.renderOn = function(html) {
    spec.builders.each(function(b) {
      /////console.log('b',b);
      var button = DOM.button();
      button.html(b.name);
      button.click(function() {
        var ruler = b.constructor({
          ////////palette: BSD.randomPalette2(128,70),
        });
        ruler.subscribe('click',function(o){
          self.publish('click',o);
        });
        ruler.subscribe('play-chord',function(o){
          self.publish('play-chord',o);
        });

        ruler.renderOn(rulersWrap);
      });
      html.append(button);
    });
  };
  return self;
  
};
  
  
       
      /* audio stuff */
      if (typeof webkitAudioContext != "undefined") {
        context = new webkitAudioContext();
        BSD.audioContext = context;
      }
      BSD.audioPlayer = false;
      BSD.chosenColor = BSD.colorFromHex('#000000');
      BSD.ColorPicker = function(spec) {
        var interface = {};
        interface.renderOn = function(html) {
          var square = DOM.div('').addClass('color-picker');
          square.css('background-color','#' + spec.color.toHex());
          square.click(function() {
            BSD.chosenColor = spec.color;
          });
          html.append(square);
        };
        return interface;
      };
      BSD.grey = BSD.Color({ r: 300, g: 300, b: 300 });
      BSD.lightGrey = BSD.Color({ r: 200, g: 200, b: 200 });
      BSD.penDown = false;
      jQuery(document).keypress(function(e) {
        if (e.charCode == 96) { //backtick
          BSD.penDown = !BSD.penDown;
        }
      });
      jQuery(document).ready(function() {
        var campfire = BSD.PubSub({});
        
        
        
        /*
        var pickers = jQuery('#pickers');		    
        var palettes = [];
        palettes.push(BSD.randomPalette2(12,70));
        palettes.each(function(pal) {
          pal.each(function(randcolor) { 
          var picker = BSD.ColorPicker({ color: randcolor});
          picker.renderOn(pickers);
          });
        });
        
        var lightGreyPicker = BSD.ColorPicker({ color: BSD.lightGrey });
        lightGreyPicker.renderOn(pickers);
        var penDownToggle = jQuery('#pen-down-toggle');
        penDownToggle.click(function() {
          BSD.penDown = ! BSD.penDown;        
        });
        */


        var stickyNoteButton = jQuery('#sticky-note-button');
        stickyNoteButton.click(function() {
          var sticky = BSD.Widgets.StickyNote();
          sticky.renderOn(jQuery(document.body));
        });

    var panelDiv = jQuery('#ruler-control-panel');
  
    var panel = BSD.ChordRulerPanel({
      builders: [
        { name: 'empty', constructor: BSD.NullRuler },
        { name: 'notes', constructor: BSD.NoteRuler },
        { name: 'major scale', constructor: BSD.MajorScaleRuler },
        { name: 'minor scale', constructor: BSD.MinorScaleRuler },
        { name: 'HM scale', constructor: BSD.HarmonicMinorScaleRuler },

        { name: 'MP scale', constructor: BSD.MajorPentatonicScaleRuler },
        { name: 'mP scale', constructor: BSD.MinorPentatonicScaleRuler },
        { name: 'blues scale', constructor: BSD.BluesScaleRuler },
        { name: 'MP Pattern', constructor: BSD.MajorPentatonicPatternRuler },

        
        { name: '-', constructor: BSD.MinorChordRuler },
        { name: 'M', constructor: BSD.MajorChordRuler },
        

        { name: '7', constructor: BSD.Dominant7ChordRuler },
        { name: '-7', constructor: BSD.Minor7ChordRuler },
        { name: 'M7', constructor: BSD.Major7ChordRuler },

        { name: '-7b5', constructor: BSD.Minor7Flat5ChordRuler },

        { name: '7b9', constructor: BSD.Dominant7Flat9ChordRuler },
        { name: '7#9', constructor: BSD.Dominant7Sharp9ChordRuler },
        { name: '7b5', constructor: BSD.Dominant7Flat5ChordRuler },
        { name: '-6', constructor: BSD.MinorSixChordRuler },
        { name: '6', constructor: BSD.MajorSixChordRuler },
        { name: '6/9', constructor: BSD.MajorSixNineChordRuler },
        { name: 'o7', constructor: BSD.Diminished7ChordRuler },

        { name: '9', constructor: BSD.Dominant9ChordRuler },
        { name: '-9', constructor: BSD.Minor9ChordRuler },
        { name: 'M9', constructor: BSD.Major9ChordRuler },

        { name: '13', constructor: BSD.Dominant13ChordRuler },
        { name: '-13', constructor: BSD.Minor13ChordRuler },
        { name: 'M13', constructor: BSD.Major13ChordRuler }

      ]
    });
    
    panel.renderOn(panelDiv);
    panel.subscribe('click',function(o){
      //console.log('oh',o);
      campfire.publish('play-note',{ note: o, duration: 1000 });
    });

    panel.subscribe('play-chord',function(o){
      campfire.publish('play-chord',{ chord: o, duration: 1000 });
    });


  campfire.subscribe('BSD.Widgets.WaveTablePlayer loaded',function(o){
    jQuery('#msg').html(o.name + ' loaded. You may begin rocking out');
  });


  var polyphonyCount = 48;


    var common = context.createGain();
    common.gain = 1.0;

    var wet = context.createGain();
    var dry = context.createGain();


    var convolver = context.createConvolver();
    convolver.buffer = impulseResponse(1.5,1.5,false);

    wet.gain.value = 0.4;
    wet.connect(convolver);
    convolver.connect(context.destination);

    dry.gain.value = 0.6;
    dry.connect(context.destination);

    common.connect(wet);
    common.connect(dry);

    BSD.audioPlayer = BSD.Widgets.SimplePlayer({
      context: context,
      destination: common,
      polyphonyCount: 48,//polyphonyCount,
      itemTitles: BSD.itemTitles,
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










  ///BSD.getWaveTableNames(function(resp) {
    //var list = eval( '(' + resp + ')');
  
  setTimeout(function(){
    var list = ['Piano'];
    ///var chosen = list.atRandom();
    campfire.subscribe('play-note',function(payload) {
      BSD.audioPlayer.playNote(payload.note,payload.duration);    
    });    
    campfire.subscribe('play-chord',function(o) {
      BSD.audioPlayer.playChord(o.chord,o.duration);    
    });
    var rulersWrap = jQuery('#rulers');
    var vars = getUrlVars();
    ////console.log('vars',vars);
    if (typeof vars.rulers != "undefined") {
      var them = eval(vars.rulers);
      ////console.log('them',them);
      
      them.each(function(set){
        var state = BSD.allMIDIValues.map(function(tf){ return false; });
      
        set.each(function(mv){  state[mv] = true; });
        //////console.log('state',state);
        var ruler = BSD.Ruler({
          items: [],
          state: state
        });
        ruler.subscribe('click',function(o){
          campfire.publish('play-note',{ note: o, duration: 1000 });
        });
        ruler.subscribe('play-chord',function(o){
          campfire.publish('play-chord',{ chord: o, duration: 1000});
        });    
        ruler.renderOn(rulersWrap);
        BSD.rulers.push(ruler);
      });
    }
    var btnBookmark = jQuery('#bookmark');
    btnBookmark.click(function(){
      var sets = BSD.rulers.select(function(ruler) { return ! ruler.deleted; }).map(function(ruler) { return ruler.allMIDIValuesCurrentlyOn(); });
      ////console.log('sets',JSON.stringify(sets));
      var url = 'rulers?rulers=' + JSON.stringify(sets);
      ////console.log(url);
      window.location.href = url;
    });
    
    
  var progInput = jQuery('#progression');
  progInput.blur(function() { 
    if (progInput.val().length == 0) { return false; }
    campfire.publish('new-progression',progInput.val());
  });
  var progClear =jQuery('#progression-clear');
  progClear.click(function(){
    progInput.val(null);
    jQuery('#rulers').empty();
    BSD.rulers = [];
  });
  var progHelp =jQuery('#progression-help');
  progHelp.click(function(){
    var lightbox = BSD.Widgets.Lightbox({
       content: jQuery('#progression-help-content')
    });
    lightbox.show();
  });
  campfire.subscribe('new-progression',function(progression) {
    var bars = progression.split('|');
    bars.each(function(bar) {
      var chordNames = bar.split(/,|\ +/);
      chordNames.each(function(name) {
        var chord = makeChord(name);
        
        
        
        var set = chord.noteValues().map(function(val) { return val - 12; }); //octave down from what the js-music-theory library would use (with C=60 as middle C)"
        
        
        
        
        
        var state = BSD.allMIDIValues.map(function(tf){ return false; });      
        set.each(function(mv){  state[mv] = true; });
        //////console.log('state',state);
        var ruler = BSD.Ruler({
          items: [],
          state: state
        });
        ruler.subscribe('click',function(o){
          campfire.publish('play-note',{ note: o, duration: 1000 });
        });
        ruler.subscribe('play-chord',function(o){
          campfire.publish('play-chord',{ chord: o, duration: 1000});
        });    
        ruler.renderOn(rulersWrap);
        BSD.rulers.push(ruler);
      });
    });
  });
  
    
    
  storage.getItem('progHelpShown',function(o){
    if (!o) {
      progHelp.trigger('click');
      storage.setItem('progHelpShown',true);
    }
  });  
    
    
  },100);
});
    
    
    
    
    </script>
<?php    
});    

get_footer();