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


BSD.Widgets.ChordPlayer = function(spec) {


    var timeout = 4000;


    var self = {};
  
    self.guid = spec.guid;
  
  
    chordLabel = DOM.h2();
    noteLabel = DOM.label();
    board = DOM.div().addClass('fretboard');
    
    
    var progression = spec.progression;
  
    self.progression = progression;


    var delayLabel = DOM.label('Spinner delay');
    var delayInput = DOM.input().attr('type','range').attr('min',0).attr('max',15000).val(timeout);
    delayInput.change(function(){ self.setDelay(this.value); });
    delayLabel.append(delayInput);
  

    chordNoteState = false;
    queueState = false;


    var cnToggleLabel = DOM.label('Chord/Note text');
    var cnToggle = DOM.input().attr('type','checkbox');
    cnToggle.click(function() { chordNoteState = ! chordNoteState; });
    cnToggleLabel.append(cnToggle);
  
    var queueToggleLabel = DOM.label('Chord/Note queue');
    var queueToggle = DOM.input().attr('type','checkbox');
    queueToggle.click(function() { queueState = ! queueState; });
    queueToggleLabel.append(queueToggle);
  
    var queue = [];
    
    var spinner = false;  
  
    var leftPanel = DOM.div().addClass('panel panel-left');
    var rightPanel = DOM.div().addClass('panel panel-right');
    
    var positionIndicator = DOM.ul().addClass('position-indicator');

  
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


    var opens = [76,71,67,62,57,52];
    [0,1,2,3,4,5].each(function(stridx) {
      var stringDiv = DOM.div().addClass('string').addClass('string-' + stridx);
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].each(function(fidx) {
        var midinote = opens[stridx] + fidx;
        var thisNote = Note(midinote);
        var noteName = thisNote.name();
        var nn = noteName.toLowerCase().replace(/b/g,'flat').replace(/#/g,'sharp');          
        ////console.log(noteName);      
        
        var fretDiv = DOM.div().addClass('fret').addClass('fret-' + fidx).addClass('midinote-' + midinote).addClass('note-' + nn); 
        
        fretDiv.addClass('guid-' + spec.guid);
        
        fretDiv.click(function() {
          audioPlayer.playNote(thisNote,timeout);
        });
        fretDiv.bind('touchstart',function() {
          audioPlayer.playNote(thisNote,timeout);
        });
        
        
                
        stringDiv.append(fretDiv);
      });
      board.append(stringDiv);
      board.append(DOM.div().addClass('clear'));
    });

    self.setDelay = function(ms) {
      timeout = ms;
      spinner.timeout = ms;    
    };
    
    self.spinnerDefaults = "not implemented";
        
    self.enqueue = function(obj) {
      queue.push(obj);
    };


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
      ///console.log('asasdfasdf');
      ///console.log('progression',progression);
      wrap.empty();



      var bars = progression.split('|');

      for (var i = 0; i < bars.length; i += 1) {
        positionIndicator.append(DOM.li(i+1).addClass('bar-' + i));        
      }
      


      wrap.addClass('bsd-widgets-player');
      wrap.append(cnToggleLabel);      
      wrap.append(queueToggleLabel);      
      wrap.append(delayLabel); //which contains the delayInput
      
      
      leftPanel.append(positionIndicator);
      wrap.append(leftPanel);
      wrap.append(rightPanel);
      
      
      
      rightPanel.append(chordLabel);
      rightPanel.append(noteLabel);
      rightPanel.append(legend);
      rightPanel.append(board);      
      rightPanel.append(DOM.div().addClass('clear'));


      




  








      var last = false;
      var barIndex = 0;
      
      bars.each(function(bar) {
        var halfBar = false;
        var chordNames = bar.split(/,|\ +/);
        if (chordNames.length == 2) {
          halfBar = true;
        }
        chordNames.each(function(name) {
          var chord = makeChord(name);
          var scales = chord.compatibleScales();
          var candidateNotes = chord.notes();        
          self.enqueue({ chord: chord, scales: scales, barIndex: barIndex, halfBar: halfBar });  
        });
        barIndex += 1;        
      });
      ///console.log('queue',queue);


      //have to build the spinner after the queue has been filled up.
      var opts = self.spinnerDefaults;
      opts.items = queue;
      opts.callback = self.spinCallback; //implemented by inheriters
      spinner = BSD.Widgets.Spinner(opts);
      self.spinner = spinner;
      //spinner.spin();
    };
    
    self.start = function() {
      spinner.spin();
    };
    self.play = self.start;
    

  
  self.spinCallback = function(o) {

    //////console.log(self.guid,'got called back');

    var chord = o.current.chord;
    var chordName = chord.fullAbbrev();
    
    self.updateChordLabel(chordName);
    
    self.withBoard(function(board) {

      var findee = board.find('.fret');
      ////console.log('cp findee',findee);


      findee.removeClass('on');
      findee.removeClass('current');
      board.find('.fret').removeClass('next');
      board.find('.fret').removeClass('prev');
      board.find('.fret').removeClass('color');
      board.find('.fret').removeClass('root');
      board.find('.fret').html(null);
  
      board.find('.compat-scale').removeClass('compat-scale');
      board.find('.compat-scale-root').removeClass('compat-scale-root');
      
      positionIndicator.find('li').removeClass('selected');
      positionIndicator.find('.bar-' + o.current.barIndex).addClass('selected');
  
  
      var chordNotes = chord.notes();
      var colorNotes = [chordNotes[1],chordNotes[3]]; //FIXME: very weak assumption
  
      colorNotes.each(function(note) {
        var nn = note.name().toLowerCase().replace(/b/g,'flat').replace(/#/g,'sharp');          
        board.find('.note-' + nn).addClass('color');
      });


      /*
      var scale = o.current.scales.select(function(s){ return s.fullName().match(/major/); }).atRandom();
      if (!scale) {
        scale = o.current.scales.select(function(s){ return s.fullName().match(/harmonic minor/); }).atRandom();
      }
      if (!scale) {
        scale = o.current.scales.select(function(s){ return s.fullName().match(/blues/); }).atRandom();
      }
      */

      var guesses = ['major','harmonic minor','blues'];      
      
      var scale = o.current.scales.detect(function(s){ 

        var guess;

        guess = guesses.atRandom();
        if (s.fullName().match(guess)) { return true; } 

        guess = guesses.atRandom();
        if (s.fullName().match(guess)) { return true; } 

        guess = guesses.atRandom();
        if (s.fullName().match(guess)) { return true; } 

        return false;

      });
      
      
      
      
      if (scale) {
        legendScale.html(scale.fullName() + ' scale');
      }
      else {
        legendScale.html(null);
      }
      

      o.current.chord.notes().each(function(note) {
        var noteName = note.name();
        var nn = noteName.toLowerCase().replace(/b/g,'flat').replace(/#/g,'sharp');          
  
        if (note.abstractlyEqualTo(chord.rootNote)) {
            board.find('.note-' + nn).addClass('root');
        }
  
  
        if (self.chordNoteState) {
          board.find('.note-' + nn).addClass('on').addClass('current').html(chordName);   ///(currentName);        
        }
        else {
          board.find('.note-' + nn).addClass('on').addClass('current').html(noteName);        
        }
        
        
        if (scale) { 
          console.log(scale.fullName());
          scale.notes().each(function(n) {
            var scalenn = n.name().toLowerCase().replace(/b/g,'flat').replace(/#/g,'sharp');              
            board.find('.note-' + scalenn).addClass('compat-scale');
            if (n.abstractlyEqualTo(scale.rootNote)) {
              board.find('.note-' + scalenn).addClass('compat-scale-root');          
            }
          });
        }     
      });
      
      o.next.chord.notes().each(function(note) {
  
        var noteName = note.name();
        var nn = noteName.toLowerCase().replace(/b/g,'flat').replace(/#/g,'sharp');          
        board.find('.note-' + nn).addClass('next');//.html(noteName);              
        /////////console.log('next',noteName);
      });
      
      audioPlayer.playChord(o.current.chord,timeout);
              

    });

  };
  self.spinnerDefaults = {
      timeout: timeout,
      oneShot: false
  };

  return self;
};