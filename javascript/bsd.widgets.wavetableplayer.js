  BSD.Widgets.OSCPlayer = function(spec) {
    var context = spec.context;

    var ctx = context;

    var self = {};

    var SINE = 0, SQUARE = 1, SAWTOOTH = 2, TRIANGLE = 3, CUSTOM = 4;


    var playing = {};
    
    var oscillators = [];
    self.oscillators = oscillators;
    
    [0,1,2,3,4,5,6,7,8].each(function(i) {
      var oscillator = ctx.createOscillator();
      oscillator.id = i; //FIXME: is this sane?
      playing[oscillator.id] = false;  
      oscillator.type = SINE;////[0,1,2,3].atRandom();
      oscillator.connect(context.destination);
      oscillators.push(oscillator);
    });


    var updateFreq = function(freq) {
        oscillator.type = parseInt($('#comboWaveType').val(),10) ;
        oscillator.frequency.value = freq;
        oscillator.connect(context.destination);
        oscillator.noteOn && oscillator.noteOn(0); // this method doesn't seem to exist, though it's in the docs?
        $("#freqDisplay").val(freq + "Hz");
    };
      
    self.idleOscillators = function() {
      //return oscillators.select(function(o) { return o.playbackState == 0; });
      return oscillators.select(function(o) { return playing[o.id] == false; });
    };
      
    self.hush = function() {
      oscillators.each(function(o) { o.disconnect(); });
    };


    self.playChord = function(chord,duration) {
      
      var tooDamnHigh = 70;
      var tooDamnLow = -300;
      
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

    self.playNote = function(note,duration) {
      var o = self.idleOscillators().detect(function(o) { return true; });
      BSD.o = o;
      
      if (o == false) {
        console.log('no free oscs',note,duration);
        return false;
      }

      o.frequency.value = BSD.hzTable[note.value()];
      o.connect(ctx.destination);
      o.noteOn(0);
      
      playing[o.id] = true;
      
      setTimeout(function() { 
        o.disconnect(); 
        playing[o.id] = false;        
      },duration);
    
      /////self.soundIt(BSD.hzTable[note.value()],duration);  
    };
    return self;
  };
  
  
BSD.Widgets.Oscar = function(spec) {

  var staticAudioRouting = spec.staticAudioRouting;

  var firstTime = true;

  var context = spec.context;


  var detune1 = 4.5;
  var detune2 = -2.5;
  var width = 0.6;
  var ampAttack = 0.056;
  var ampDecay = 0.7; ///0.100;
  var cutoff = 0.2;
  var resonance = 12;
  var envAmount = 0.4;
  var filterAttack = 0.056;
  var filterDecay = 0.991;
  var volume = 1;




  var panner1 = context.createPanner();
  panner1.panningModel = webkitAudioPannerNode.EQUALPOWER;
  
  var panner2 = context.createPanner();
  panner2.panningModel = webkitAudioPannerNode.EQUALPOWER;
  

  // Amplitude envelope
  var ampEnvelope = context.createGainNode();
  ampEnvelope.gain.value = 0.0; // default value

  // Create note volume.
  var noteVolume = context.createGainNode();
  noteVolume.gain.value = 0; // start out silent until told otherwise



    // Filter
    var filter = context.createBiquadFilter();
    filter.type = 0;
    filter.gain.value = 0.0; // default value



  var isMonophonic = true;

    var osc1 = context.createBufferSource();
    osc1.looping = true;

    var osc1Octave = context.createBufferSource();
    osc1Octave.looping = true;

    var osc2 = context.createBufferSource();
    osc2.looping = true;

    var osc2Octave = context.createBufferSource();
    osc2Octave.looping = true;
        
    // oscillators --> panners.
    osc1.connect(panner1);
    osc1Octave.connect(panner1);
    osc2.connect(panner2);
    osc2Octave.connect(panner2);

    // panners --> amplitude envelope
    panner1.connect(ampEnvelope);
    panner2.connect(ampEnvelope);

    // amplitude envelope --> filter envelope
    ampEnvelope.connect(filter);

    // filter envelope --> note volume
    filter.connect(noteVolume);

    // note volume -> subsonic filter
    noteVolume.connect(staticAudioRouting.subsonicFilter /*subsonicFilter*/);
    
    
    

    osc1.noteOn(0);
    osc2.noteOn(0);
    osc1Octave.noteOn(0);
    osc2Octave.noteOn(0);

    var self = spec;
    self.osc1 = osc1;
    self.osc2 = osc2;
    self.osc1Octave = osc1Octave;
    self.osc2Octave = osc2Octave;
    self.playing = false;
    var o = self;


  self.setFilterValues = function() {
    var time = context.currentTime;

    var pitchFrequency = self.pitchFrequency;
    
    filter.frequency.cancelScheduledValues(0);

    filter.type = 0; // Lowpass
    filter.Q.value = resonance; // !!FIXME: should be Q

    var nyquist = 0.5 * context.sampleRate;

    var cutoffCents = 9600 * cutoff;
    var cutoffRate = Math.pow(2, cutoffCents / 1200.0);
    var startFrequency = cutoffRate * pitchFrequency;
    if (startFrequency > nyquist)
        startFrequency = nyquist;

    var envAmountCents = 7200 * envAmount;
    var envAmountRate = Math.pow(2, envAmountCents / 1200.0);
    var envAmountFrequency = startFrequency * envAmountRate;
    if (envAmountFrequency > nyquist)
        envAmountFrequency = nyquist;

    filter.frequency.setTargetValueAtTime(envAmountFrequency, time, filterAttack);
    filter.frequency.setTargetValueAtTime(startFrequency, time + filterAttack, filterDecay);
  };


  self.play = function(wave, wave2, semitone, octave, duration) {   
  
    /////console.log('playyy');
    self.playing = true;

    setTimeout(function() { self.playing = false; },duration);

    var time = context.currentTime;
        
    // Set oscillator pitches.
    
    var pitchFrequency = 20.0 /*440.0*/ * Math.pow(2.0, semitone / 12.0);
    ////console.log('semitone',semitone,'pf',pitchFrequency);
    ///pitchFrequency = 261;
    
    
    /////var pitchFrequency = BSD.hzTable[semitone];
    var pitchFrequency = midi2Hertz(semitone);
    ///console.log('semitone',semitone,'pf',pitchFrequency);

    
    self.pitchFrequency = pitchFrequency;
    
    
    var pitchRate = pitchFrequency * wave.getRateScale();

    var rate1 = pitchRate * Math.pow(2.0, -detune1/1200);
    var buffer1 = wave.getWaveDataForPitch(rate1);
    if (firstTime) osc1.buffer = buffer1;

    osc1.playbackRate.value = rate1;


    var rate2 = pitchRate * Math.pow(2.0, octave - detune2/1200);
    var buffer2 = wave2.getWaveDataForPitch(rate2);
    if (firstTime) osc1Octave.buffer = buffer2;
    osc1Octave.playbackRate.value = rate2;

    if (firstTime) osc2.buffer = buffer1;
    osc2.playbackRate.value = pitchRate * Math.pow(2.0, +detune1/1200); // max one semi-tone

    if (firstTime) osc2Octave.buffer = buffer2;
    osc2Octave.playbackRate.value = pitchRate * Math.pow(2.0, octave + detune2/1200); // max one semi-tone
    
    // Set panning amount for width spreading.
    
    // pan maximum from -90 -> +90 degrees
    var x = Math.sin(0.5*Math.PI * width);
    var z = -Math.cos(0.5*Math.PI * width);
    panner1.panningModel = webkitAudioPannerNode.EQUALPOWER;
    panner1.setPosition(-x, 0, z);

    panner2.panningModel = webkitAudioPannerNode.EQUALPOWER;
    panner2.setPosition(x, 0, z);

    // Amplitude envelope
    ampEnvelope.gain.cancelScheduledValues(0);

    
    // Amplitude attack
    var ampAttackTime = time + ampAttack;
    
    // Amplitude decay
    ampEnvelope.gain.setTargetValueAtTime(1, time, ampAttack);
    ampEnvelope.gain.setTargetValueAtTime(0, ampAttackTime, ampDecay);

    // Filter
    self.setFilterValues();

    // Set note volume.
    noteVolume.gain.value = 0.1 * volume*volume; // use x^2 volume curve for now

}



    return self;    
};


BSD.Widgets.WaveTablePlayer = function(spec) {
  var staticAudioRouting = new StaticAudioRouting();
  var waveTable;
  var waveTable2;
  var loader;
  
  var octave = 0;

  function loadWaveTables() {
    loader = new WaveTableLoader();
    loader.load(function start() {
      waveTable = loader.getTable(spec.name);
      waveTable2 = loader.getTable(spec.name);  
    });
  }

  var context = spec.context;

  var time = context.currentTime;
  var isMonophonic = true;

  var self = BSD.Widgets.OSCPlayer(spec);

  self.idleOscillators = function() {
    return oscillators.select(function(o) { return o.playing == false; });
  };

  var oscillators = [];
  self.oscillators = oscillators;
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].each(function(i) {
    var oscillator = BSD.Widgets.Oscar({ 
      id: i, 
      context: context, 
      staticAudioRouting: staticAudioRouting  
    });  
    oscillators.push(oscillator);
  });

  self.play = function(wave, wave2, semitone, octave, duration) {   
    var o = self.idleOscillators().detect(function(o) { return true; });
    if (!o) { 
      console.log('could not find idle oscillator'); 
      return false; 
    }
    o.play(wave, wave2, semitone, octave, duration);
  };

  self.playNote = function(note,duration) {
    self.play(waveTable, waveTable2, note.value(), octave, duration);  
  };
  
  loadWaveTables();
  
  return self;
};

