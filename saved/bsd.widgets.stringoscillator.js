BSD.StringOscillator = function(spec) {
  var self = BSD.PubSub({});
  var destination = spec.destination;
  var context = spec.context;


  var oscillatorBank = {}; //oscillators by semitone map.

  var worlds = {};


  var gainBank = {};


  self.playing = false;
  self.id = spec.id; ///just in case this is still needed...

  var SINE = 0, SQUARE = 1, SAWTOOTH = 2, TRIANGLE = 3, CUSTOM = 4;




  var volume = 0;
  var detuneSemis = 0;

  self.subscribe('set-master-volume',function(magnitude) {
    //console.log('MAG BEFORE',magnitude,volume);
    volume = magnitude;
    
    ////console.log('MAG AFTER',magnitude,volume);
  });
  

  self.subscribe('set-detune-semis',function(magnitude) {
    detuneSemis = magnitude;
    console.log('DETUNE-MAG AFTER',detuneSemis);
  });


  
  
  
  
  function randomInRange(min, max) {
    return Math.random() * (max-min) + min;
  }  
  

  self.play = function(semitone,duration,velocity)  {

    ///console.log('play>>>',semitone,duration);

    var detune1 = 4.5;    
    var time = context.currentTime;
    var ampAttack = Math.random() / 10; //////[0.056,0.099,0.07,0.5].atRandom();
    var ampDecay = Math.random() + 0.2; 


    //ampAttack = Math.random() * 0.4 + 0.01;
    ampAttack = Math.random() * 0.2;


    ////var 

    var ampEnvelope = gainBank[semitone];
    if (!ampEnvelope) {
      gainBank[semitone] = context.createGain();
      ampEnvelope = gainBank[semitone];
    }

    ampEnvelope.gain.value = volume;////0.0; // default value
    ampEnvelope.connect(destination);



    var myGain = volume;
    if (velocity) {
      myGain *= (velocity / 128);
    }


/***
    //attack
    ampEnvelope.gain.linearRampToValueAtTime(myGain, time + ampAttack);    
    //decay
    ampEnvelope.gain.exponentialRampToValueAtTime(myGain * 0.9, time + ampAttack + ampDecay);    
    

    if (duration) {
      //release
      ampEnvelope.gain.linearRampToValueAtTime(0.0, time + ampAttack + duration);    
    }
***/
       
    
    [
    { title: 'fundamental', freq: midi2Hertz(semitone,detuneSemis), volumeRange: [0.5,1.0] },
    { title: 'octave', freq: midi2Hertz(semitone+12,detuneSemis), volumeRange: [0.1,0.2] },
    { title: 'dominant', freq: midi2Hertz(semitone+19,detuneSemis), volumeRange: [0.0,0.15] }
    ].each(function(o){
  

      var slot = oscillatorBank[semitone];
      if (!slot) {
        slot = [];
        oscillatorBank[semitone] = slot;
      }; 
      var osc = context.createOscillator();/////BufferSource();
      oscillatorBank[semitone].push(osc);
      var gain = context.createGain();
      
      var myVolume = randomInRange(o.volumeRange[0],o.volumeRange[1]) * volume;

      if (velocity) {
        myVolume *= (velocity / 128);
      }

      osc.connect(gain);
      gain.connect(ampEnvelope);
      //gain.connect(destination);
    
      var rate = o.freq * Math.pow(2.0, -detune1/1200);
      osc.frequency.value = rate;
      //////osc.type = (Math.random() > 0.9) ? SINE : TRIANGLE;/////].atRandom();//SINE;
      osc.type = 'sine';
  
      ///gain.gain.exponentialRampToValueAtTime(0.1,time+ampAttack);



      osc.start(0);/////noteOn(0);
      self.playing = true;
      

      if (duration) {

        gain.gain.setTargetAtTime(myVolume, time, ampAttack);
        gain.gain.setTargetAtTime(0, time + ampAttack, ampDecay);

        setTimeout(function(){ 
          self.stopSemitone(semitone);
        },duration);
      }

    });
  };

  self.stopSemitone = function(semitone) {
      var slot = oscillatorBank[semitone];
      if (!slot) { return false; }
      slot.forEach(function(osc) { self.stopOsc(osc); });
  };

  self.stopOsc = function(osc) {
    osc.stop();   
    osc.disconnect();
    self.playing = false;   
  };


  
  self.playNote = function(note,duration,velocity) {
    self.play(note.value(),duration);  
  };
 self.stopNote = function(note) {
  self.stopSemitone(note.value());
 }

  return self;
};
