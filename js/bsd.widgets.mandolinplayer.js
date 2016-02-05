BSD.Widgets.MandolinPlayer = function(spec) {

  var self = BSD.Widgets.BasePlayer(spec);
  var context = spec.context;
  var oscillators = [];
  self.oscillators = oscillators;


  var pairs = [];

  self.name = spec.name;

  self.addNewPair = function() {
    var id = self.oscillators.length + 1;  
    var pair = [];
    var string1 = BSD.StringOscillator({ 
      id: id, 
      context: context, 
      destination: context.destination,
      volume: 0
    });
    var string2 = BSD.StringOscillator({ 
      id: id, 
      context: context, 
      destination: context.destination,
      volume: 0
    });
    self.oscillators.push(string1);
    self.oscillators.push(string2);

    var pair = [string1,string2];
    pairs.push(pair);
  };
  
  var time = context.currentTime;
  /////var isMonophonic = true;

  var polyphonyCount = spec.polyphonyCount || 4;
  for (var i = 0; i < polyphonyCount; i += 1) {
    self.addNewPair();
  }

  self.play = function(semitone, duration) {   
    var o = self.idlePairs().detect(function(o) { return true; }); //return first idle pair
    if (!o) { 
      console.log('could not find idle pair of oscillators');       
      return false; 
    }
    
    ///console.log('pair',o);
    
    var s1 = o[0];
    var s2 = o[1];
    
    s1.play(semitone, duration);
    s2.play(semitone, duration);
  };


  
  self.idlePairs = function() {
    return pairs.select(function(o){
      var s1 = o[0];
      var s2 = o[1];
      return s1.playing == false && s2.playing == false;
    });  
  }




  self.playNote = function(note,duration) {

    ////console.log('spec.range>>',spec.range);
  
    var v = note.value();
    while (v > spec.range[1]) {
      v -= 12;
    }
    self.play(v, duration);  
  };
  
  return self;
};
