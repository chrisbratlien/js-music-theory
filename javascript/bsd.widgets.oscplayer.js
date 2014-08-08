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
  
  
  return self;

};



BSD.Widgets.OSCPlayer = function(spec) {
  var context = spec.context;

  var ctx = context;

  var self = BSD.Widgets.BasePlayer(spec);

  var SINE = 0, SQUARE = 1, SAWTOOTH = 2, TRIANGLE = 3, CUSTOM = 4;


  function midi2Hertz(x) {
    return Math.pow(2,(x-69)/12)*440;
  }
  
  var hzTable = [];
  for (var x = 0; x <= 127; x += 1) {
    hzTable[x] = midi2Hertz(x);
  }

  var playing = {};
  
  [0,1,2].each(function(i){//////,3,4,5,6,7,8].each(function(i) {
    var oscillator = ctx.createOscillator();
    oscillator.id = i; //FIXME: is this sane?
    playing[oscillator.id] = false;  
    oscillator.type = SINE;////[0,1,2,3].atRandom();
    oscillator.connect(context.destination);
    self.oscillators.push(oscillator);
  });
    
  self.idleOscillators = function() {
    //return oscillators.select(function(o) { return o.playbackState == 0; });
    return self.oscillators.select(function(o) { return playing[o.id] == false; });
  };
    

  self.playNote = function(note,duration) {
    var o = self.idleOscillators().detect(function(o) { return true; });
    BSD.o = o;
    
    if (o == false) {
      console.log('no free oscs',note,duration);
      return false;
    }

    o.frequency.value = hzTable[note.value()];
    o.connect(ctx.destination);
    o.noteOn(0);
    
    playing[o.id] = true;
    
    setTimeout(function() { 
      o.disconnect(); 
      playing[o.id] = false;        
    },duration);
  
  };
  return self;
};
