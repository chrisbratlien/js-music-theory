function fisherYates ( myArray ) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}


BSD.Widgets.FretboardViz = function(spec) {

    var self = BSD.PubSub({}); //provides publish and subscribe
    
  
    self.guid = spec.guid;
  
  
    chordLabel = DOM.h2();
    noteLabel = DOM.label();
    board = DOM.div().addClass('fretboard');
    
    
  

    chordNoteState = false;


    var cnToggleLabel = DOM.label('Chord/Note text');
    var cnToggle = DOM.input().attr('type','checkbox');
    cnToggle.click(function() { chordNoteState = ! chordNoteState; });
    cnToggleLabel.append(cnToggle);
  
    
  
    var rightPanel = DOM.div().addClass('panel panel-right');
    

  
    var legend = DOM.div().addClass('legend');
    legend.append(DOM.div('current').addClass('fret on current'));
    legend.append(DOM.div('next').addClass('fret next'));


    var legendScale = DOM.div('legend scale').addClass('fret compat-scale');


    legend.append(legendScale);
    legend.append(DOM.div('major scale root').addClass('fret compat-scale-root'));
    legend.append(DOM.div().addClass('clear'));
    legend.append(DOM.div().addClass('clear'));



    var fretLabelDiv = DOM.div().addClass('fret-labels');
    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].each(function(fidx) {
      var labelDiv = DOM.div().addClass('fret-label').html(fidx);
      fretLabelDiv.append(labelDiv);
    });
    board.append(fretLabelDiv);
    board.append(DOM.div().addClass('clear'));


    ////var opens = [76,71,67,62,57,52];
    var opens = [64,59,55,50,45,40];
    
    
    
    
    
    [0,1,2,3,4,5].each(function(stridx) {
      var stringDiv = DOM.div().addClass('string').addClass('string-' + stridx);
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].each(function(fidx) {
        var midinote = opens[stridx] + fidx;
        var thisNote = Note(midinote);
        var noteName = thisNote.name();
        var nn = noteName.replace(/b/g,'flat').replace(/#/g,'sharp').toLowerCase();          
        ////console.log(noteName);      
        
        var fretDiv = DOM.div();
        fretDiv.addClass('fret');
        fretDiv.addClass('fret-' + fidx);
        fretDiv.addClass('midinote-' + midinote);
        fretDiv.addClass('note-' + nn); 
      
      
        
        if (nn.length == 1) {
          fretDiv.html(nn.toUpperCase());
        }
        
        
        fretDiv.addClass('guid-' + spec.guid);
        

        fretDiv.on('hover',function(){
          ///////self.publish('fretDivHover',fretDiv);
          self.publish('note-hover',thisNote);
        });
        
        
        fretDiv.click(function() {
          //////self.publish('noteClicked',thisNote);
          self.publish('play-note',thisNote);
        });
        
        
        
        
                
        stringDiv.append(fretDiv);
      });
      board.append(stringDiv);
      board.append(DOM.div().addClass('clear'));
    });



    self.updateChordLabel = function(str) {
      chordLabel.html(str);
    };
    
    self.updateNoteLabel = function(str) {
      noteLabel.html(str);
    };
    
    
    self.withBoard = function(callback) {
      //////console.log('withBoard',spec.guid);
    
      callback(board);
    };


    self.renderOn = function(wrap) {    
      wrap.empty();

      wrap.addClass('bsd-widgets-player');
      wrap.append(cnToggleLabel);      
      
      wrap.append(rightPanel);

      rightPanel.append(chordLabel);
      rightPanel.append(noteLabel);
      rightPanel.append(legend);
      rightPanel.append(board);      
      rightPanel.append(DOM.div().addClass('clear'));

    };
  
  ///self.spinCallback = function(o) {
  ///spec.gossip.subscribe('play-chord',function(o) {

  self.subscribe('chord-change',function(o) {
  
    ////console.log('chordChange');

    console.log('o?',o);

    var chord = o.current.chord;
    var chordName = chord.fullAbbrev();    
    self.updateChordLabel(chordName);    
    self.withBoard(function(board) {

      var findee = board.find('.fret');
      ///console.log('cp findee',findee);


      findee.removeClass('on');
      findee.removeClass('current');
      board.find('.fret').removeClass('next');
      board.find('.fret').removeClass('prev');
      board.find('.fret').removeClass('color');
      board.find('.fret').removeClass('root');
      
      

      ////board.find('.fret').html(null);
  
      board.find('.compat-scale').removeClass('compat-scale');
      board.find('.compat-scale-root').removeClass('compat-scale-root');
      
  
  
     var chordNotes = chord.notes();
     var colorNotes = [];
      
      colorNotes.push(chordNotes[1]);
      if (chordNotes.length > 3) {
        colorNotes.push(chordNotes[3]);         
      }





  
      colorNotes.each(function(note) {
        
        ////console.log('note',note,note.name());
      
        var nn = note.name().replace(/b/g,'flat').replace(/#/g,'sharp').toLowerCase();          
        board.find('.note-' + nn).addClass('color');
      });

      var scale = false;
      
      var preferredGuesses = [];
      
      
      var compatibleScales = chord.compatibleScales();



      /***
      if (self.currentChordIsProbably2of251(o)) {
        //console.log('probably 2');      
        preferredGuesses = ['blues','major','minor']; //the major here would be the 1 major.. but just in case that isn't found, still try for minor            
      }
      if (self.currentChordIsProbably5of251(o)) {
        //console.log('probably 5');      
        preferredGuesses = ['harmonic minor','major','blues','minor']; //the major here would be the 1 major.. but just in case that isn't found, still try for minor            
      }
      if (chord.hasDominantQuality()) {
        preferredGuesses.push('major');
      }
      ****/

      
      preferredGuesses.push(chord.rootNote.scale('major').fullName()); //hail mary before we start guessing and hit an off-major.…      

      //first go through the preferred, if any      
      while (!scale && preferredGuesses.length > 0) {
        var guess = preferredGuesses.shift();
        scale = compatibleScales.detect(function(s) {
          if (s.fullName().match(guess)) { return true; } 
        });
      }
      if (scale) {
        //console.log('found preferred',scale.fullName());
      }


      /***
      if (!scale) {
        var randomGuesses = ['major','harmonic minor','blues','pentatonic'];      
        scale = chord.scales.detect(function(s){ 
          var guess;
          guess = randomGuesses.atRandom();
          if (s.fullName().match(guess)) { return true; } 
          guess = randomGuesses.atRandom();
          if (s.fullName().match(guess)) { return true; } 
          guess = randomGuesses.atRandom();
          if (s.fullName().match(guess)) { return true; } 
          return false;
        });
      }
      ***/
      
      
      if (scale) {
        ////console.log('scale chosen',scale.fullName());
        legendScale.html(scale.fullName() + ' scale');
      }
      else {
        console.log('**NO SCALE CHOSEN FOR CHORD ',chord.fullName());
        legendScale.html(null);
      }
      chord.notes().each(function(note) {
        var noteName = note.name();
        var nn = note.name().replace(/b/g,'flat').replace(/#/g,'sharp').toLowerCase();          
    
        
        if (note.abstractlyEqualTo(chord.rootNote)) {
            board.find('.note-' + nn).addClass('root');
        }
        
        
        

        if (self.chordNoteState) {
          board.find('.note-' + nn).addClass('on').addClass('current').html(chordName);   ///(currentName);        
        }
        else {
          board.find('.note-' + nn).addClass('on').addClass('current');////.html(noteName);        
        }
        
        
        if (scale) { 
          scale.notes().each(function(n) {
            var scalenn = n.name().replace(/b/g,'flat').replace(/#/g,'sharp').toLowerCase();              
            board.find('.note-' + scalenn).addClass('compat-scale');
            if (n.abstractlyEqualTo(scale.rootNote)) {
              board.find('.note-' + scalenn).addClass('compat-scale-root');          
            }
          });
        }     
      });
      
      
      
      
      o.next.chord.notes().each(function(note) {
        ////console.log('got here!!');
      
        var noteName = note.name();
        var nn = noteName.replace(/b/g,'flat').replace(/#/g,'sharp').toLowerCase();          
        board.find('.note-' + nn).addClass('next');//.html(noteName);              
        /////////console.log('next',noteName);
      });
      
         
    });
  });
  
  
  
  return self;
};