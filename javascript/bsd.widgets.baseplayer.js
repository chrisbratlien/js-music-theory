BSD.Widgets.BasePlayer = function(spec) {
  var context = spec.context;
  var ctx = context;
  var self = BSD.PubSub({});
  var oscillators = [];
  self.oscillators = oscillators;
  
  self.idleOscillators = function() {
    return "subclass responsibility";
    //return oscillators.select(function(o) { return o.playbackState == 0; });
    //return oscillators.select(function(o) { return playing[o.id] == false; });
  };


  self.subscribe('set-master-volume',function(magnitude){
    ///console.log('MAG222',magnitude);
    ///console.log('oscillators',oscillators);
    ////console.log('self.oscillators',self.oscillators);
    self.oscillators.each(function(o){ o.publish('set-master-volume',magnitude); });
  });


  self.hush = function() {
    oscillators.each(function(o) { o.disconnect(); });
  };


  self.playChord = function(chord,duration) {
    
    var tooDamnHigh = (typeof spec.range == "undefined") ? 70 : spec.range[1];
    var tooDamnLow = (typeof spec.range == "undefined") ? -300 : spec.range[0];

    ///console.log('tooDamnHigh',tooDamnHigh);
    ////console.log('tooDamnLow',tooDamnLow);

    var tooHigh = chord.notes().detect(function(n) { return n.value() > tooDamnHigh; });
    while (tooHigh) {
      ////console.log('tooDamnHigh',chord.fullName());
      chord = chord.invertDown();
      var tooHigh = chord.notes().detect(function(n) { return n.value() > tooDamnHigh; });
    }

    var tooLow = chord.notes().detect(function(n) { return n.value() < tooDamnLow; });      
    while (tooLow) {
      ////console.log('tooDamnLow',chord.fullName());
      chord = chord.invertUp();
      var tooLow = chord.notes().detect(function(n) { return n.value() < tooDamnLow; }); 
    }
          
    var midivalues = chord.notes().collect(function(n) { return n.value(); });
    ////console.log(midivalues);
    chord.notes().each(function(n) { self.playNote(n,duration); });
  };
  
  self.playNote = function() {
    return "subclass responsibility";
  }
  
  self.publish('base-player-init',null);
  return self;
};