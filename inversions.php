<?php 

//css
add_action('wp_head',function(){
?>
<style type="text/css">

  .fretboard-wrap { margin: 1rem; }

  .cell { cursor: pointer; width: 30px; height: 30px; text-align: center; color: rgba(0,0,0,0.25); }


  .cell.hidden { visibility: hidden; }


  .cell.chord-0 { background: rgba(255,0,0,0.5); }
  .cell.chord-1 { background: rgba(255,255,0,0.5) }
  .cell.chord-2 { background: rgba(0,0,255,0.5); }

  .cell.chord-0.chord-1 { background: rgba(255,127,0,0.5); }
  .cell.chord-0.chord-2 { background: rgba(127,0,255,0.5); }

  .cell.chord-1.chord-2 { background: rgba(0,255,0,0.5); }
  .cell.chord-1.chord-2.chord-3 { background: black; color: white; }
  
  
  /**
  .scale-0 { background: rgba(255,0,0,0.5); } 
  .scale-0 { background: rgba(0,0,255,0.5); } 
  .scale-1 { background: rgba(255,255,0,0.5); } 
  .scale-0.scale-1 { background: rgba(127,255,255,0.5); } 
  **/


  td { position: relative; }




  .color-cell { float: left; width: 30%; height: 10px; }
  .color-cell { float: left; width: 1rem; height: 1rem; 
  
  }
  
  .color-cell { 
    position: absolute; 
    top: 0; 
    left: 0; 
    width: 1rem; 
    height: 1rem; 
    top: 33%; 
    border-radius: 1rem;
    background: red;
    background: rgba(255,0,0,0.5);

  }
  
  .scale-0-root .color-cell:nth-child(1) { border-radius: 0; }
  .scale-1-root .color-cell:nth-child(2) { border-radius: 0; }

  .color-cell-count-1 .color-cell { 
    left: 33%;
  }
  .scale-1.color-cell-count-1 .color-cell { 
    background: blue;
    background: rgba(0,127,255,0.5);
  }


  .color-cell-count-2 .color-cell:nth-child(1) { 
    background: red;
    background: rgba(255,0,0,0.5);
    left: 15%;
  }

  .color-cell-count-2 .color-cell:nth-child(2) { 
    background: blue;
    background: rgba(0,127,255,0.5);
    left: 60%;
  }
  
   
   

  .cell { border: 1px solid #eee;  }

</style>

<?php
});

get_header(); ?>

<div class="container-fluid">
  <div class="row-fluid">
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    
    <span id="fret-range-amount"></span>
    <div class="slider-wrap header-column">
      <div class="slider" id="fret-range-input"></div>
    </div>
    
    
    <div class="boards"></div>
    <label><strong>Progression</strong><br />
      <input id="progression" type="text" />    
      <input id="scales" type="text" />    
      <div id="focus-trap" ></div>
    </label>      
    <div class="fretboard-wrap"></div>
    <div id="rulers"></div><!--rulers -->
  </div>
</div>
<?php 


//js
add_action('wp_footer',function(){
?>
<script type="text/javascript" src="js/rulers.js"></script>


<script type="text/javascript">

  var focusTrap = jQuery('#focus-trap');

  var rulersWrap = jQuery('#rulers');

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


    BSD.minFret = 0;
    BSD.maxFret = 22;

    $( "#fret-range-input" ).slider({
      orientation: "horizontal",
      range: true,
      min: 0,
      max: 22,
      step: 1,
      values: [BSD.minFret,BSD.maxFret],
      slide: function( event, ui ) {
        console.log(event,ui);
        BSD.minFret = ui.values[0]; 
        BSD.maxFret = ui.values[1]; 
        
        
        campfire.publish('update-fret-range',{ min: BSD.minFret, max: BSD.maxFret });
        jQuery('#fret-range-amount').text(BSD.minFret + ' - ' + BSD.maxFret);
        ///var newVolume = ui.value;
        ////waiter.beg(BSD.audioPlayer,'set-master-volume',newVolume);
        ///storage.setItem('volume',newVolume);  
        ////waiter.beg(BSD.chunker,'set-master-volume',ui.value);
        ///jQuery( "#volume-amount" ).text( newVolume );
      }
    });




    BSD.importJSON('data/guitar.json',function(o) { 
      BSD.guitarData = o;
    });
 
 
  var progInput = jQuery('#progression');
  progInput.on('change blur',function() { 
    if (progInput.val().length == 0) { return false; }
    var result = [];
    var bars = progInput.val().split('|');
    bars.each(function(bar) {
      var chordNames = bar.split(/,|\ +/);
      chordNames.each(function(name) {
        var chord = makeChord(name);
    		result.push(chord);
    	});
    });
    waiter.beg(campfire,'new-progression',result);
    focusTrap.focus();
  });


  var scaleInput = jQuery('#scales');
  
  scaleInput.on('change blur',function() { 
    if (scaleInput.val().length == 0) { return false; }
    var result = [];
    var scaleString = scaleInput.val();
    scaleString.split(/\ +/).each(function(o) {

      var scale = makeScale(o);
      console.log('scale',scale);
      result.push(scale);    
    });
    waiter.beg(campfire,'new-scales',result);

    focusTrap.focus();
  });



function makeTable(wrap,options) {

////var scale = options.scale;
////var noteNames = scale.noteNames();
     
var table = DOM.table().addClass('fretboard-table');
table.attr('cellspacing',0);
table.attr('cellpadding',0);
  

	table.empty();

  var openValues = [64,59,55,50,45,40];
	var fretRange = [];
	var maxFrets = 22;
	
	for (var i = options.minFret; i <= options.maxFret; i += 1) { fretRange.push(i); };

//console.log('cscale',cscale);
    [0,1,2,3,4,5].each(function(stringIndex) {
    
      var open = openValues[stringIndex];
     
      var row = DOM.tr();     
			fretRange.each(function(fret){ 
        
        var valley = open+fret;
        var note = Note(valley);

        var cell = DOM.td().addClass('cell');
        
        campfire.subscribe('update-fret-range',function(o) {
          if (fret < o.min) { 
            cell.addClass('hidden'); 
            return false;
          }
          if (fret > o.max) {  
            cell.addClass('hidden'); 
            return false;
          }
          cell.removeClass('hidden');
        });
        
        
        var colorCells = [];
        

        /**
        [0,1,2].forEach(function(o,i){
          var cc = DOM.div().addClass('color-cell color-cell-' + i);
          colorCells.push(cc);
          cell.append(cc);        
        });
        ***/
        

        campfire.subscribe('new-progression',function(o){
          cell.attr('class','cell');//remove extra classes
          campfire.publish('update-fret-range',{ min: BSD.minFret, max: BSD.maxFret });
        });        
        campfire.subscribe('new-chord',function(o){
          o.chord.notes().each(function(chordNote){
            if (note.abstractlyEqualTo(chordNote)) {
              var cc = DOM.div().addClass('color-cell on');//// color-cell-' + i);
              colorCells.push(cc);
              cell.append(cc);        
              cell.addClass('chord-' + o.index); //combined
            }
          });
          cell.addClass('color-cell-count-' + colorCells.length);          
        });
        campfire.subscribe('new-scale',function(o){
          ///cell.attr('class','cell');//remove extra classes
          //colorCells.each(function(o) {
          //  o.attr('class','color-cell'); //remove extra classes
          ///});
          var scale = o.scale;
          scale.notes().each(function(scaleNote){
            if (note.abstractlyEqualTo(scaleNote)) {


              var cc = DOM.div().addClass('color-cell on');//// color-cell-' + i);
              colorCells.push(cc);
              cell.append(cc);        


              //colorCells[o.index].addClass('on');
              cell.addClass('scale-' + o.index);


            }
          });

          cell.addClass('color-cell-count-' + colorCells.length);          



          if (note.abstractlyEqualTo(scale.rootNote)) {
              cell.addClass('scale-' + o.index + '-root');
          }
          
          campfire.publish('update-fret-range',{ min: BSD.minFret, max: BSD.maxFret });
          
        });        
        

        
        cell.on('click touchend',function(){
          campfire.publish('play-note',{ note: note, duration: 1000 });
        });
        
        cell.on('mouseover',function(){
          campfire.publish('div-hover',cell);
          campfire.publish('note-hover',note);
        });

        
        var noteName = note.name();
				cell.append(noteName);
        
        if (options.rootNote && note.abstractlyEqualTo(options.rootNote)) {
         cell.addClass('root');
        }
          
        row.append(cell);
      });
      table.append(row);
    });

  //wrap.append(DOM.label(scale.fullName));
  ////wrap.append(DOM.label(scale.fullName()));
	wrap.append(DOM.br());
	wrap.append(DOM.label().addClass('chord-name'));
  wrap.append(table);

  wrap.append(DOM.div().css('clear','both'));

}



  var fretboardWrap = jQuery('.fretboard-wrap');
    makeTable(jQuery(fretboardWrap),{
      minFret: BSD.minFret,
      maxFret: BSD.maxFret,
      ///scale: makeScale('C major'),
      //pick a root note below //
      ////rootNote: chord.rootNote,////Note('C'),
      //rootNote: Note('D'),
      //rootNote: Note('E'),
      //rootNote: Note('F'),
      //rootNote: Note('G'),
      //rootNote: Note('A'),
      //rootNote: Note('B'),
      //rootNote: false
      foo: false //ignore this
    });


  campfire.subscribe('note-hover',function(note){
    //console.log('note',note.name());
    BSD.currentNote = note;
      if (BSD.strum) {
        BSD.audioPlayer.playNote(note,1000);          
      }

  });


  BSD.rulers = [];

  campfire.subscribe('new-progression',function(prog){
    BSD.rulers.each(function(o){  o.close(); })
    BSD.rulers = [];
    console.log('prog',prog);
    prog.each(function(chord,i){
      campfire.publish('new-chord',{ chord: chord, index: i });
    });
  });


  campfire.subscribe('new-scales',function(scales){
    scales.each(function(scale,i){
      campfire.publish('new-scale',{ scale: scale, index: i });
    });
  });

  

  campfire.subscribe('new-chord',function(o){  
    var chord = o.chord;
    var state = BSD.allMIDIValues.map(function(tf){ return false; });
    chord.noteValues().each(function(nv) {  state[nv] = true; });
    var ruler = BSD.Ruler({
      items: [],
      state: state
    });
    ruler.subscribe('click',function(o){
      campfire.publish('play-note',{ note: o, duration: 1000 });
    });
    ruler.subscribe('play-chord',function(o){
      console.log('play-chord?',o);
      campfire.publish('play-chord',{ chord: o, duration: 1000});
    });    
    ruler.subscribe('current-chord',function(o){
      BSD.currentChord = o;
      BSD.currentNote = false;
    });

    ruler.renderOn(rulersWrap);
    BSD.rulers.push(ruler);
  });  
  
  campfire.subscribe('play-note',function(payload) {
    BSD.audioPlayer.playNote(payload.note,payload.duration);    
  });    
  campfire.subscribe('play-chord',function(o) {
    BSD.audioPlayer.playChord(o.chord,o.duration);    
  });

  
    
//makeChord('C').notes().forEach(function(note) { var frets = BSD.guitarData.select(function(f) { return f.noteValue == note.value(); }); console.log('frets',frets); })
    
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


