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
