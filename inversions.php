<?php 

//css
add_action('wp_head',function(){
?>
<style type="text/css">

  .cell { cursor: pointer; }


  .cell.hidden { visibility: hidden; }


  .cell.chord-0 { background: rgba(255,0,0,0.5); }
  .cell.chord-1 { background: rgba(255,255,0,0.5) }
  .cell.chord-2 { background: rgba(0,0,255,0.5); }

  .cell.chord-0.chord-1 { background: rgba(255,127,0,0.5); }
  .cell.chord-0.chord-2 { background: rgba(127,0,255,0.5); }

  .cell.chord-1.chord-2 { background: rgba(0,255,0,0.5); }
  .cell.chord-1.chord-2.chord-3 { background: black; color: white; }
  
  
  /**
  .color-cell.chord-0 { background: rgba(255,0,0,0.33); }
  .color-cell.chord-1 { background: rgba(0,255,0,0.33); }
  .color-cell.chord-2 { background: rgba(0,0,255,0.33); }
  ***/




  td { position: relative; }
  .color-cell { float: left; width: 30%; height: 10px; }
  .color-cell { float: left; width: 30%; height: 100%; }
   .color-cell { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } 

  .cell { border: 1px solid #eee; padding: 1rem; }

</style>

<?php
});

get_header(); ?>


<i class="fa fa-plus fa-2x"></i>YAY

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
  <input id="scale" type="text" />    
  <div id="focus-trap" ></div>
</label>      
<div class="fretboard-wrap"></div>
<div id="rulers"></div><!--rulers -->
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


  var scaleInput = jQuery('#scale');
  scaleInput.on('change blur',function() { 
    if (scaleInput.val().length == 0) { return false; }
    var scale = makeScale(scaleInput.val());
    console.log('scale',scale);
    waiter.beg(campfire,'new-scale',scale);
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
        colorCells.push(DOM.div().addClass('color-cell'));
        colorCells.push(DOM.div().addClass('color-cell'));
        colorCells.push(DOM.div().addClass('color-cell'));

        colorCells.each(function(o){
          cell.append(o);
        });

        campfire.subscribe('new-progression',function(o){
          cell.attr('class','cell');//remove extra classes
          colorCells.each(function(o) {
            o.attr('class','color-cell'); //remove extra classes
          });
        });        
        campfire.subscribe('new-chord',function(o){
          o.chord.notes().each(function(chordNote){
            if (note.abstractlyEqualTo(chordNote)) {
              colorCells[o.index].addClass('chord-' + o.index);
              cell.addClass('chord-' + o.index);
            }
          
          });
        });
        campfire.subscribe('new-scale',function(scale){
          cell.attr('class','cell');//remove extra classes
          colorCells.each(function(o) {
            o.attr('class','color-cell'); //remove extra classes
          });
          scale.notes().each(function(scaleNote){
            if (note.abstractlyEqualTo(scaleNote)) {
              colorCells[0].addClass('chord-0');
              cell.addClass('chord-0');
            }
          });
        });        
        

        
        cell.on('click touchend',function(){
          campfire.publish('play-note',{ note: note, duration: 1000 });
        });
        
        cell.on('mouseover',function(){
          campfire.publish('div-hover',cell);
          campfire.publish('note-hover',note);
        });

        ////console.log('double check',note.value());
       

        /***        
        var spatialNote = BSD.SpatialNote({
          note: note,
          cell: cell,
          position: [fret,stringIndex]
        });
        
        BSD.spatialNotes.push(spatialNote);
        ***/
        
        var noteName = note.name();

        /***
        if (noteNames.indexOf(noteName) > -1) {
        }
        ***/
				cell.append(noteName);
				//cell.append(DOM.sub(valley));
        
        if (options.rootNote && note.abstractlyEqualTo(options.rootNote)) {
         cell.addClass('root');
        }
          
        row.append(cell);
        //console.log(note.name());
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


