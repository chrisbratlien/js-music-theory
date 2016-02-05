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


BSD.Widgets.ProgressionClock = function(spec) {

    var timeout = 4000;
    var self = BSD.PubSub({});
    self.guid = spec.guid;
  
    chordLabel = DOM.h2();
    noteLabel = DOM.label();
    ////board = DOM.div().addClass('fretboard');
    //var progression = spec.progression;
    ///self.progression = progression;

    var delayLabel = DOM.label('Spinner delay');
    
    var delayInput = DOM.input().attr('type','range').attr('min',0).attr('max',15000).val(timeout);
    delayInput.change(function(){ self.setDelay(this.value); });
    delayLabel.append(delayInput);
  
  
    var paused = true;
  
  
    var togglePlay = DOM.button('play/pause');
    togglePlay.click(function() {
      paused = ! paused;
      if (paused) {
        self.pause();
        togglePlay.html('play');
      }
      else {
        self.play();
        togglePlay.html('pause');
      }
    });

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
    
    var sequencer = BSD.Widgets.Sequencer({
      tempo: 120,
    });  
    ///sequencer.tick(); //initial domino... bad metaphors both?
    
    var setIntervalHandles = [];
  
    var leftPanel = DOM.div().addClass('panel panel-left');    
    var positionIndicator = DOM.ul().addClass('position-indicator');

    self.setDelay = function(ms) {
      timeout = ms;
      ////sequencer.timeout = ms;    
    };
    
    self.sequencerDefaults = "not implemented";
        
    self.enqueue = function(obj) {
      queue.push(obj);
      sequencer.enqueue(obj);
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



      ////var bars = progression.split('|');
      
      var bars = spec.bars;

      for (var i = 0; i < bars.length; i += 1) {
        positionIndicator.append(DOM.li(i+1).addClass('bar-' + i));        
      }
      


      wrap.addClass('bsd-widgets-player');
      wrap.append(cnToggleLabel);      
      wrap.append(queueToggleLabel);      
      wrap.append(delayLabel); //which contains the delayInput
      wrap.append(togglePlay);
      
      
      leftPanel.append(positionIndicator);
      wrap.append(leftPanel);
      
      
      

      var last = false;
      var barIndex = 0;
      var chordIndex = 0;
      
      bars.each(function(bar) {
        var halfBar = false;
        var chords = bar;
        if (chords.length == 2) {
          halfBar = true;
        }
        

        var baseTime = (new Date()).getTime()+5000; //five secs in future;
          
        
        eachify(chords).eachPCN(function(o) {
        
          var chord = o.current;
        
          ///var chord = makeChord(name);
          var scales = chord.compatibleScales();
          var candidateNotes = chord.notes();        
          
          var timeoutScale = 1.0;
          if (halfBar) {
            timeoutScale = 0.5;
          }
          
          
          
          
          baseTime += 500;
          
          ////console.log('enqueueing',chord.fullName(),timeoutScale);
          self.enqueue({ 
            when: baseTime,
            callback: function() {
              self.publish('chord-change',{ 
                chord: chord, 
                chordIndex: chordIndex, 
                scales: scales, 
                barIndex: barIndex, 
                halfBar: halfBar, 
                timeoutScale: timeoutScale 
                
              });             
            }          
          });
          
          

          
          chordIndex += 1;          
          
        });
        barIndex += 1;        
      });
      ///console.log('queue',queue);


      //have to build the spinner after the queue has been filled up.
      var opts = self.spinnerDefaults;
      opts.items = queue;

      //spinner = BSD.Widgets.Spinner(opts);
      ///self.spinner = spinner;
      //spinner.spin();
    };
    
    self.start = function() {
      paused = false;
      sequencer.resume();
    };
    self.play = self.start;
    
    self.pause = function() {
      paused = true;
      
      //console.log('asking spinner to pause');
      sequencer.pause();
    };
    

  /***
  self.currentChordIsProbably2of251 = function(o) { 
    return (o.next.chord.rootNote.isAFourthOf(o.current.chord.rootNote) // 5 is "a fourth of" 2
      && o.current.chord.hasMinorThirdInterval() 
      && o.next.chord.hasMajorThirdInterval());
  };

  self.currentChordIsProbably5of251 = function(o) {
    return (o.current.chord.rootNote.isAFourthOf(o.prev.chord.rootNote) // 5 is "a fourth of" 2
      && o.prev.chord.hasMinorThirdInterval() 
      && o.current.chord.hasMajorThirdInterval());
  };
  ***/
  
  self.spinnerDefaults = {
      timeout: timeout,
      oneShot: false
  };

  return self;
};