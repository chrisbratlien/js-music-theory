// Copyright 2011, Google Inc.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
// 
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  

//BSD.Widgets.Oscar and BSD.Widgets.WavetablePlayer are both partially derived from http://chromium.googlecode.com/svn/trunk/samples/audio/wavetable-synth.html
//BSD.Widgets.WavetablePlayer also derives from BSD.Widgets.OSCPlayer
  
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
  var masterVolume = 1;



  var panner1 = context.createPanner();
  panner1.panningModel = "equalpower";///panner1.EQUALPOWER;
  
  var panner2 = context.createPanner();
  panner2.panningModel = "equalpower";////panner2.EQUALPOWER;
  

  // Amplitude envelope
  var ampEnvelope = context.createGain();
  ampEnvelope.gain.value = 0.0; // default value

  // Create note volume.
  var noteVolume = context.createGain();
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
    
    
    

    osc1.start(0);/////noteOn(0);
    osc2.start(0);////noteOn(0);
    osc1Octave.start(0);///noteOn(0);
    osc2Octave.start(0);///noteOn(0);

    var self = BSD.PubSub({});
    self.osc1 = osc1;
    self.osc2 = osc2;
    self.osc1Octave = osc1Octave;
    self.osc2Octave = osc2Octave;
    self.playing = false;
    var o = self;



  self.subscribe('set-master-volume',function(magnitude) {
    ////console.log('MAG',magnitude);
    masterVolume = magnitude;
  });


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

    filter.frequency.setTargetAtTime(envAmountFrequency, time, filterAttack);
    filter.frequency.setTargetAtTime(startFrequency, time + filterAttack, filterDecay);
  };


  self.play = function(wave, wave2, semitone, octave, duration) {   
  
    /////console.log('playyy');
    self.playing = true;

    setTimeout(function() { self.playing = false; },duration);

    var time = context.currentTime;
        
    // Set oscillator pitches.
    
    var pitchFrequency = 20.0 /*440.0*/ * Math.pow(2.0, semitone / 12.0);
    var pitchFrequency = midi2Hertz(semitone);
    
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
    panner1.panningModel = "equalpower";
    panner1.setPosition(-x, 0, z);

    panner2.panningModel = "equalpower";
    panner2.setPosition(x, 0, z);

    // Amplitude envelope
    ampEnvelope.gain.cancelScheduledValues(0);

    
    // Amplitude attack
    var ampAttackTime = time + ampAttack;
    
    // Amplitude decay
    ampEnvelope.gain.setTargetAtTime(1, time, ampAttack);
    ampEnvelope.gain.setTargetAtTime(0, ampAttackTime, ampDecay);

    // Filter
    self.setFilterValues();

    // Set note volume.
    noteVolume.gain.value = 0.1;/// * volume*volume; // use x^2 volume curve for now


    noteVolume.gain.value = noteVolume.gain.value * masterVolume;

}



    return self;    
};


BSD.getWaveTableNames = function(cb) {
  jQuery.ajax({ 
    type: 'POST', 
    url: 'ws.php', 
    data: { action: 'wave_tables' },
     success: cb
  });
};



BSD.Gonzo = function(spec) {
  var self = BSD.PubSub({});
  var destination = spec.destination;
  var context = spec.context;

  self.playing = false;
  self.id = spec.id; ///just in case this is still needed...

  var SINE = 0, SQUARE = 1, SAWTOOTH = 2, TRIANGLE = 3, CUSTOM = 4;


  var ampEnvelope = context.createGain();
  ampEnvelope.gain.value = 0.0; // default value
  ampEnvelope.connect(destination);

  self.play = function(a,b,semitone,octave,duration)  {
    var osc1 = context.createOscillator();/////BufferSource();
    ////////var osc1 = context.createBufferSource();
    osc1.connect(ampEnvelope);
    
    var pitchFrequency = midi2Hertz(semitone);
    ///////self.pitchFrequency = pitchFrequency;
    ///////var pitchRate = pitchFrequency * wave.getRateScale();
    ////osc1.playbackRate = pitchFrequency;
    osc1.frequency.value = pitchFrequency;
    osc1.type = SINE;////[0,1,2,3].atRandom();

    
    
    ampEnvelope.gain = 1.0;
    var ampAttack = 0.056;
    var ampDecay = 0.7; ///0.100;
    
    
    var time = context.currentTime;
    var ampAttackTime = time + ampAttack;

    ampEnvelope.gain.setTargetAtTime(1, time, ampAttack);
    ampEnvelope.gain.setTargetAtTime(0, ampAttackTime, ampDecay);
    
    
    
    osc1.start(0);/////noteOn(0);
    
    setTimeout(function(){ osc1.stop();   },duration*2);
    
    
    osc1.looping = true;
  };
  
  self.playNote = function(note,duration) {
    self.play(false,false, note.value(), 0, duration);  
  };
  
  
  
  return self;
}


BSD.Widgets.WaveTablePlayer = function(spec) {
  var staticAudioRouting = new StaticAudioRouting();
  var waveTable;
  var waveTable2;
  var loader;
  
  var octave = 0;

  var self = BSD.Widgets.BasePlayer(spec);
  var context = spec.context;
  var oscillators = [];
  self.oscillators = oscillators;

  self.name = spec.name;

  self.newOscillator = function() {
    var id = self.oscillators.length + 1;  

    /**
    var result = BSD.Widgets.Oscar({ 
      id: id, 
      context: context, 
      staticAudioRouting: staticAudioRouting  
    });
    ****/  

    var result = BSD.Gonzo({ 
      id: id, 
      context: context, 
      destination: context.destination
    });

    self.oscillators.push(result);
    return result;
  };
  
  
  ////console.log('self',self);
  //return false;
  

  function loadWaveTables() {
    loader = new WaveTableLoader();
    loader.load(function start() {
      waveTable = loader.getTable(spec.name);
      waveTable2 = loader.getTable(spec.name); 
      spec.gossip.publish('BSD.Widgets.WaveTablePlayer loaded',self);
 			///alert('finished loading ' + spec.name + ', you may begin rocking out'); 
    });
  }

  ///});

  var time = context.currentTime;
  var isMonophonic = true;

  var polyphonyCount = spec.polyphonyCount || 4;
  for (var i = 0; i < polyphonyCount; i += 1) {
        self.newOscillator();
  }

  self.play = function(wave, wave2, semitone, octave, duration) {   
    /////console.log('idle',self.idleOscillators());
    var o = self.idleOscillators().detect(function(o) { return true; });
    if (!o) { 
      console.log('could not find idle oscillator');       
      return false; 
    }
    o.play(wave, wave2, semitone, octave, duration);
  };
  


  /*****
  OVERRIDES ov OSCPlayer functions below
  ***/
  self.idleOscillators = function() {
    return self.oscillators.select(function(o) { return o.playing == false; });
  };



  self.playNote = function(note,duration) {
    self.play(waveTable, waveTable2, note.value(), octave, duration);  
  };
  
  loadWaveTables();
  
  return self;
};

