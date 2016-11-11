BSD.Widgets.GuitarPlayer = function(spec) {

  var self = BSD.Widgets.BasePlayer(spec);
  var context = spec.context;
  var oscillators = [];
  self.oscillators = oscillators;

  self.name = spec.name;

  self.addNewString = function() {
    var id = self.oscillators.length + 1;  

    var string1 = BSD.StringOscillator({ 
      id: id, 
      context: context, 
      destination: spec.destination,
      volume: 0
    });
    self.oscillators.push(string1);

  };
  
  var time = context.currentTime;
  /////var isMonophonic = true;

  var polyphonyCount = spec.polyphonyCount || 4;
  for (var i = 0; i < polyphonyCount; i += 1) {
    self.addNewString();
  }

  self.play = function(semitone, duration, velocity) {   
    var o = self.idleStrings().detect(function(o) { return true; }); 
    if (!o) { 
      console.log('could not find idle oscillator');       
      return false; 
    }
    o.play(semitone, duration,velocity);
  };
  
  self.idleStrings = function() {
    return oscillators.select(function(o){
      return o.playing == false;
    });  
  };
  self.playNote = function(note,duration,velocity) {
    ////console.log('spec.range>>',spec.range);
  
    var v = note.value();
    while (v > spec.range[1]) {
      v -= 12;
    }
    self.play(v, duration,velocity);  
  };  

  self.stopNote = function(note) {
    self.oscillators.forEach(o => o.stopNote(note) );
  };



  return self;
};