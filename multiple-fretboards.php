<?php 


add_filter('wp_title',function($o){ return 'Multiple Fretboards'; });
add_action('wp_head',function(){
?>
<title>12 Fretboards</title>

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
  }
  table td { border-top: 1px solid  rgba(0,0,0,0.1); }
  table td { border-left: 1px solid  rgba(0,0,0,0.1); }
  .fretboard-table { margin-bottom: 1.75em; }    
  .stage { width: 100%; margin: 0; }
  
  .cell { cursor: pointer; }
  table td { cursor: pointer; }
  

  @media print  { 

    body { font-size: 7pt; }
    .inner { font-size: 7pt; }
    
    .stage { color: rgba(0,0,0,0.5); }
  
  }
  
 
  .controls { margin-left: 0.4rem; }
  .controls .fa-close { cursor: pointer; }

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

<div class="navbar-spacer screen-only noprint">
  <button class="btn btn-info btn-add-fretboard noprint"><i class="fa fa-plus"></i> Add Fretboard</button>
  <br />
  <br />
</div>
<div class="stage"></div>

<?php

add_action('wp_footer',function(){
?>
    <!--
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/array.js"></script>
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/dom.js"></script>
    <script src="http://cdn.dev.bratliensoftware.com/javascript/color.js"></script>
    
    <script src="http://lucid.bratliensoftware.com/js-music-theory/javascript/js-music-theory.js"></script>
    -->
    <script type="text/javascript">




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

      var cscale = makeScale('Cmajor');
      var noteNames = cscale.noteNames();
      

      BSD.Widgets.Fretboard = function(spec) {

        var self = BSD.PubSub({});
        self.spec = spec;
        
        
        var state = {};
        
        self.selectedNotes = function() {
          var numbers = Object.keys(state).select(function(n){ return state[n]; });
          console.log('numbers',numbers);
          var result = numbers.map(function(n) { return Note(n); });
          return result;
        }
        
        self.renderOn = function(wrap) {      
          var inner = DOM.div().addClass('inner');
          var table = DOM.table().addClass('fretboard-table');
          table.attr('cellspacing',0);
          table.attr('cellpadding',0);
          
          table.empty();
          //console.log('cscale',cscale);
          [64,59,55,50,45,40].each(function(open) { 
            var row = DOM.tr();     [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].each(function(fret){ 
              
              var cell = DOM.td();
              
              var midiValue = open+fret;
              var note = Note(midiValue);
             
              var noteName = note.name();
              
              noteName = JSMT.toUTF8(noteName);
              
              
              
              if (true || noteNames.indexOf(noteName) > -1) {
                
                cell.html(noteName);
                
              }
              
              cell.click(function(){
              
                state[midiValue] = (state[midiValue]) ? false : true;
                
                if (state[midiValue]) {
                  var hex = BSD.chosenColor.toHex();
                  
                  var sum = BSD.chosenColor.r + BSD.chosenColor.g + BSD.chosenColor.b;
                  
                  console.log('hex',hex,'sum',sum);
                  cell.css('background-color','#' + hex);
                  cell.css('color','white');

                  
                  (sum > 500) ? cell.css('color','#333') : cell.css('color','white');


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
      
      


      var stage = jQuery('.stage');
      
      function makeFretboardOn(wrap) {

        var board = BSD.Widgets.Fretboard({});
        board.renderOn(wrap);
        
        board.subscribe('play-notes',function(notes){
          campfire.publish('play-notes',notes);
        });
        board.subscribe('note-hover',function(o){
          campfire.publish('note-hover',o);
        });
        
        BSD.boards.push(board);
      
      }
      
      
      for (var i = 0; i < 12 ; i++) {
        makeFretboardOn(stage);
      }



    jQuery('.btn-add-fretboard').click(function(){
      makeFretboardOn(stage); 
    });
      



  var context = new webkitAudioContext();
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